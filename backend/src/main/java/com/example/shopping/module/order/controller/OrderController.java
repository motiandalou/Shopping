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

    @GetMapping("/front/my")
    public Result<Page<Order>> frontMyOrder(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        return Result.success(orderService.frontMyOrder(userId, pageNum, pageSize));
    }

    /**
     * 获取订单物流轨迹
     */
//    @GetMapping("/front/getLogistics/{orderId}")
//    public Result<List<LogisticsTrace>> getLogistics(@PathVariable Long orderId) {
//        Order order = orderService.getById(orderId);
//        if (order == null) {
//            return Result.error("订单不存在");
//        }
//
//        String traceJson = order.getLogisticsTrace();
//        if (traceJson == null || traceJson.isEmpty()) {
//            // 这里不报错，返回空数组
//            return Result.success(new ArrayList<>());
//        }
//
//        try {
//            // 直接解析整个JSON
//            JSONObject jsonObject = JSON.parseObject(traceJson);
//
//            // 直接拿 Traces 数组
//            List<LogisticsTrace> nodeList =
//                    jsonObject.getJSONArray("Traces").toJavaList(LogisticsTrace.class);
//
//            return Result.success(nodeList);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return Result.success(new ArrayList<>());
//        }
//    }

    @PostMapping("/front/delete")
    public Result<?> frontDelete(
            @RequestParam Long orderId,
            @RequestParam Long userId
    ) {
        orderService.frontDeleteOrder(orderId, userId);
        return Result.success("删除成功");
    }

    @GetMapping("/front/detail")
    public Result<Order> frontDetail(@RequestParam Long orderId) {
        return Result.success(orderService.getById(orderId));
    }
}