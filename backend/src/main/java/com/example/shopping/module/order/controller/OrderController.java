package com.example.shopping.module.order.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.shopping.common.util.KdniaoUtil;
import com.example.shopping.config.Result;
import com.example.shopping.gateway.dto.GatewayMessageDTO;
import com.example.shopping.gateway.handler.GatewayMessageHandler;
import com.example.shopping.module.order.entity.Order;
import com.example.shopping.module.order.service.OrderService;
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
public class OrderController {

    private final OrderService orderService;
    private final KdniaoUtil kdniaoUtil;

    // 【后台 - 管理员】
    @GetMapping("/back/list")
    public Result<?> backList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        Page<Order> page = orderService.backOrderList(pageNum, pageSize);
        return Result.success(page.getRecords());
    }

    // 发货
    @PostMapping("/back/updateStatus")
    public Result<?> backUpdateStatus(
            @RequestParam Long orderId,
            @RequestParam Integer status,
            @RequestParam(required = false) String expressCompany,
            @RequestParam(required = false) String expressNo
    ) {
        // 1. 更新订单状态 + 快递信息
        Order order = new Order();
        order.setId(orderId);
        order.setStatus(status);
        order.setShipperCode(expressCompany);
        order.setLogisticCode(expressNo);
        orderService.updateById(order);

        // 2. 已发货 → 调用你封装好的工具类，存真实物流
        if (status == 2) {
            try {
                // 请求快递鸟接口(写入操作,不走缓存)
                String realLogistics = kdniaoUtil.trackQuery(expressCompany, expressNo);

                // 快递鸟接口返回的数据,存进数据库
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
    @PostMapping("/back/delete")
    public Result<?> backDelete(@RequestParam Long orderId) {
        orderService.removeById(orderId);
        return Result.success("删除成功");
    }

    // 【前台 - 用户】
    @PostMapping("/front/add")
    public Result<?> frontAdd(@RequestBody Order order, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String userName = (String) request.getAttribute("username");
        order.setUserId(userId);
        order.setUserName(userName);
        orderService.frontAddOrder(order);
        // 创建新订单时间
        LocalDateTime createTime = order.getCreateTime();
        // 新订单推送
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
    public Result<Page<Order>> frontMyOrder(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        return Result.success(orderService.frontMyOrder(userId, pageNum, pageSize));
    }

    // 删除
    @PostMapping("/front/delete")
    public Result<?> frontDelete(
            @RequestParam Long orderId,
            @RequestParam Long userId
    ) {
        orderService.frontDeleteOrder(orderId, userId);
        return Result.success("删除成功");
    }

    // 订单详情
    @GetMapping("/front/detail/{orderId}/{userId}")
    public Result<Order> frontDetail(
            @PathVariable Long orderId,
            @PathVariable Long userId
    ) {
        return Result.success(orderService.frontDetail(orderId, userId));
    }

    /**
     * 【前台 - 用户】申请退款 / 退货退款
     */
    @PostMapping("/front/applyRefund")
    public Result<?> applyRefund(
            @RequestBody Map<String, Object> params,
            HttpServletRequest request
    ) {
        // 1. 必传字段
        Long orderId = Long.parseLong(params.get("orderId").toString());
        // 1=仅退款 2=退货退款
        Integer refundType = Integer.parseInt(params.get("refundType").toString());
        String refundReason = params.get("refundReason") == null ? "用户申请退款" : params.get("refundReason").toString();

        // 2. 当前登录用户
        Long userId = (Long) request.getAttribute("userId");

        // 3. 业务层处理退款
        orderService.applyRefund(orderId, userId, refundType, refundReason);

        return Result.success("退款申请已提交，等待客服审核");
    }

    // ========================= 【售后工单管理 - 后台接口】 =========================
    // 1. 售后工单列表（所有退款/退货申请）
    @GetMapping("/back/refund/list")
    public Result<?> refundOrderList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false, name = "refundStatus[]") Integer[] refundStatus
    ) {
        return Result.success(orderService.getRefundOrderList(pageNum, pageSize, refundStatus));
    }

    // 2. 售后工单详情
    @GetMapping("/back/refund/detail")
    public Result<?> refundDetail(@RequestParam Long orderId) {
        return Result.success(orderService.getRefundDetail(orderId));
    }

    // 3. 审核退款（同意 / 拒绝）
    @PostMapping("/back/refund/audit")
    public Result<?> auditRefund(
            @RequestParam Long orderId,
            @RequestParam Integer refundStatus, // 2=通过 4=拒绝
            @RequestParam(required = false) String refundRemark
    ) {
        orderService.auditRefund(orderId, refundStatus, refundRemark);
        return Result.success("审核成功");
    }


}