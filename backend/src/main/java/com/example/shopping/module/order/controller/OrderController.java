package com.example.shopping.module.order.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.shopping.config.Result;
import com.example.shopping.module.order.entity.Order;
import com.example.shopping.module.order.service.OrderService;
import com.example.shopping.websocket.WebSocketServer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Resource
    private OrderService orderService;

    // ============================ 【后台 - 管理员：全部去掉缓存】 ============================
    /**
     * 后台查询所有订单（分页）
     */
    @GetMapping("/back/list")
    public Result<List<Order>> backList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        Page<Order> page = orderService.backOrderList(pageNum, pageSize);
        return Result.success(page.getRecords());
    }

    /**
     * 后台修改订单状态（发货/完成/取消）
     */
    @PostMapping("/back/updateStatus")
    public Result<?> backUpdateStatus(
            @RequestParam Long orderId,
            @RequestParam Integer status
    ) {
        orderService.backUpdateStatus(orderId, status);
        return Result.success("修改成功");
    }

    /**
     * 后台删除订单（硬删除）
     */
    @PostMapping("/back/delete")
    public Result<?> backDelete(@RequestParam Long orderId) {
        orderService.removeById(orderId);
        return Result.success("删除成功");
    }

    // ============================ 【前台 - 用户：只加合理缓存】 ============================
    /**
     * 前台创建订单（用户下单）
     */
    @PostMapping("/front/add")
    @CacheEvict(value = {"orderFrontMy", "orderDetail"}, allEntries = true)
    public Result<?> frontAdd(@RequestBody Order order, HttpServletRequest request) {
        // 从 Token 自动获取当前登录用户 ID
        Long userId = (Long) request.getAttribute("userId");
        String userName = (String) request.getAttribute("username");
        // 用户id 和 用户名 赋值给订单
        order.setUserId(userId);
        order.setUserName(userName);
        // 保存订单
        orderService.frontAddOrder(order);

        // 1. 构造通用消息，type 用来区分业务
        Map<String, Object> msg = new HashMap<>();
        msg.put("type", "NEW_ORDER");
        // 2. 把整个订单对象放进去
        msg.put("order", order);

        try {
            // ====================== 修复日期序列化问题 ======================
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());

            String json = objectMapper.writeValueAsString(msg);
            WebSocketServer.broadcast(json);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Result.success("下单成功");
    }

    /**
     * 前台查询我的订单（分页）
     */
    @GetMapping("/front/my")
    @Cacheable(value = "orderFrontMy", key = "#userId + '-' + #pageNum + '-' + #pageSize")
    public Result<Page<Order>> frontMyOrder(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        return Result.success(orderService.frontMyOrder(userId, pageNum, pageSize));
    }

    /**
     * 前台删除自己的订单
     */
    @PostMapping("/front/delete")
    @CacheEvict(value = {"orderFrontMy", "orderDetail"}, allEntries = true)
    public Result<?> frontDelete(
            @RequestParam Long orderId,
            @RequestParam Long userId
    ) {
        orderService.frontDeleteOrder(orderId, userId);
        return Result.success("删除成功");
    }

    /**
     * 前台查看订单详情
     */
    @GetMapping("/front/detail")
    @Cacheable(value = "orderDetail", key = "#orderId")
    public Result<Order> frontDetail(@RequestParam Long orderId) {
        return Result.success(orderService.getById(orderId));
    }
}