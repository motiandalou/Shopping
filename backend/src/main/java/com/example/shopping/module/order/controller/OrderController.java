package com.example.shopping.module.order.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.shopping.common.util.KdniaoUtil;
import com.example.shopping.common.result.Result;
import com.example.shopping.gateway.dto.GatewayMessageDTO;
import com.example.shopping.gateway.handler.GatewayMessageHandler;
import com.example.shopping.module.log.annotation.Log;
import com.example.shopping.module.order.entity.Order;
import com.example.shopping.module.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/order")
@Tag(name = "订单管理", description = "订单创建、查询、发货、删除、退款售后全流程接口")
public class OrderController {

    private final OrderService orderService;
    private final KdniaoUtil kdniaoUtil;

    // 【后台 - 管理员】
    @GetMapping("/back/list")
    @Operation(summary = "后台-订单列表", description = "管理员查看所有订单数据")
    public Result<?> backList(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        Page<Order> page = orderService.backOrderList(pageNum, pageSize);
        return Result.success(page.getRecords());
    }

    // 发货
    @Log(module = "订单管理", operation = "订单发货")
    @PostMapping("/back/updateStatus")
    @Operation(summary = "后台-订单发货/修改状态", description = "支持修改状态、填写快递信息、同步物流")
    public Result<?> backUpdateStatus(
            @Parameter(description = "订单ID", required = true, example = "1001") @RequestParam Long orderId,
            @Parameter(description = "订单状态", required = true, example = "2") @RequestParam Integer status,
            @Parameter(description = "快递公司编码 SF/STO/YTO") @RequestParam(required = false) String expressCompany,
            @Parameter(description = "快递单号") @RequestParam(required = false) String expressNo
    ) {
        Order order = new Order();
        order.setId(orderId);
        order.setStatus(status);
        order.setShipperCode(expressCompany);
        order.setLogisticCode(expressNo);
        orderService.updateById(order);

        if (status == 2) {
            try {
                String realLogistics = kdniaoUtil.trackQuery(expressCompany, expressNo);
                Order updateOrder = orderService.getById(orderId);
                updateOrder.setLogisticsTrace(realLogistics);
                orderService.updateById(updateOrder);

            } catch (Exception e) {
                log.error("发货物流异常", e);
                return Result.error("物流查询失败");
            }
        }

        return Result.success("操作成功");
    }

    // 删除
    @Log(module = "订单管理", operation = "删除订单")
    @PostMapping("/back/delete")
    @Operation(summary = "后台-删除订单", description = "管理员删除指定订单")
    public Result<?> backDelete(
            @Parameter(description = "订单ID", required = true, example = "1001") @RequestParam Long orderId
    ) {
        orderService.removeById(orderId);
        return Result.success("删除成功");
    }

    // 【前台 - 用户】
    @PostMapping("/front/add")
    @Operation(summary = "前台-创建订单", description = "用户提交订单，自动推送消息给管理员")
    public Result<?> frontAdd(
            @Parameter(description = "订单信息", required = true) @RequestBody Order order,
            HttpServletRequest request
    ) {
        Long userId = (Long) request.getAttribute("userId");
        String userName = (String) request.getAttribute("username");
        order.setUserId(userId);
        order.setUserName(userName);
        orderService.frontAddOrder(order);
        LocalDateTime createTime = order.getCreateTime();
        GatewayMessageDTO adminMsg = new GatewayMessageDTO( "order_all",
                "NEW_ORDER",
                "您有新订单！",
                order,
                createTime);
        GatewayMessageHandler.sendToTopic("order_all", adminMsg);
        return Result.success("下单成功");
    }

    // 列表
    @GetMapping("/front/my")
    @Operation(summary = "前台-我的订单", description = "用户查询自己的订单列表")
    public Result<Page<Order>> frontMyOrder(
            @Parameter(description = "用户ID", required = true, example = "1001") @RequestParam Long userId,
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        return Result.success(orderService.frontMyOrder(userId, pageNum, pageSize));
    }

    // 删除
    @PostMapping("/front/delete")
    @Operation(summary = "前台-删除订单", description = "用户删除自己的订单")
    public Result<?> frontDelete(
            @Parameter(description = "订单ID", required = true) @RequestParam Long orderId,
            @Parameter(description = "用户ID", required = true) @RequestParam Long userId
    ) {
        orderService.frontDeleteOrder(orderId, userId);
        return Result.success("删除成功");
    }

    // 订单详情
    @GetMapping("/front/detail/{orderId}/{userId}")
    @Operation(summary = "前台-订单详情", description = "查询订单详细信息")
    public Result<Order> frontDetail(
            @Parameter(description = "订单ID", required = true) @PathVariable Long orderId,
            @Parameter(description = "用户ID", required = true) @PathVariable Long userId
    ) {
        return Result.success(orderService.frontDetail(orderId, userId));
    }

    /**
     * 【前台 - 用户】申请退款 / 退货退款
     */
    @PostMapping("/front/applyRefund")
    @Operation(summary = "前台-申请退款/退货", description = "用户发起退款或退货退款申请")
    public Result<?> applyRefund(
            @RequestBody Map<String, Object> params,
            HttpServletRequest request
    ) {
        Long orderId = Long.parseLong(params.get("orderId").toString());
        Integer refundType = Integer.parseInt(params.get("refundType").toString());
        String refundReason = params.get("refundReason") == null ? "用户申请退款" : params.get("refundReason").toString();
        Long userId = (Long) request.getAttribute("userId");
        orderService.applyRefund(orderId, userId, refundType, refundReason);
        return Result.success("退款申请已提交，等待客服审核");
    }

    // 售后工单列表
    @GetMapping("/back/refund/list")
    @Operation(summary = "后台-退款/售后列表", description = "管理员查看所有退款申请")
    public Result<?> refundOrderList(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "退款状态筛选") @RequestParam(required = false, name = "refundStatus[]") Integer[] refundStatus
    ) {
        return Result.success(orderService.getRefundOrderList(pageNum, pageSize, refundStatus));
    }

    // 售后工单详情
    @GetMapping("/back/refund/detail")
    @Operation(summary = "后台-退款详情", description = "查看退款申请详情")
    public Result<?> refundDetail(
            @Parameter(description = "订单ID", required = true) @RequestParam Long orderId
    ) {
        return Result.success(orderService.getRefundDetail(orderId));
    }

    // 审核退款
    @Log(module = "订单管理", operation = "审核退款订单")
    @PostMapping("/back/refund/audit")
    @Operation(summary = "后台-审核退款", description = "同意/拒绝用户退款申请")
    public Result<?> auditRefund(
            @Parameter(description = "订单ID", required = true) @RequestParam Long orderId,
            @Parameter(description = "审核结果状态", required = true) @RequestParam Integer refundStatus,
            @Parameter(description = "审核备注") @RequestParam(required = false) String refundRemark
    ) {
        orderService.auditRefund(orderId, refundStatus, refundRemark);
        return Result.success("审核成功");
    }

}