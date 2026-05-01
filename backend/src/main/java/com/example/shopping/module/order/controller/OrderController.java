package com.example.shopping.module.order.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.shopping.config.Result;
import com.example.shopping.gateway.dto.GatewayMessageDTO;
import com.example.shopping.gateway.handler.GatewayMessageHandler;
import com.example.shopping.module.order.entity.Order;
import com.example.shopping.module.order.service.OrderService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Resource
    private OrderService orderService;

    // ============================ 【后台 - 管理员】 ============================
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
            @RequestParam Integer status
    ) {
        orderService.backUpdateStatus(orderId, status);
        return Result.success("修改成功");
    }

    @PostMapping("/back/delete")
    public Result<?> backDelete(@RequestParam Long orderId) {
        orderService.removeById(orderId);
        return Result.success("删除成功");
    }

    // ============================ 【前台 - 用户】 ============================
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