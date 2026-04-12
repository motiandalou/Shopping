package com.example.shopping.module.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.shopping.common.exception.BusinessException;
import com.example.shopping.module.order.entity.Order;
import com.example.shopping.module.order.mapper.OrderMapper;
import com.example.shopping.module.order.service.OrderService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    // ====================== 后台 ======================
    // 查询
    @Override
    public Page<Order> backOrderList(Integer pageNum, Integer pageSize) {
        Page<Order> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Order::getCreateTime);
        return this.page(page, wrapper);
    }

    // 更新
    @Override
    public void backUpdateStatus(Long orderId, Integer status) {
        Order order = this.getById(orderId);
        if (order == null) throw new BusinessException("订单不存在");

        order.setStatus(status);
        if (status == 1) { // 已支付
            order.setPayTime(LocalDateTime.now());
        }
        this.updateById(order);
    }

    // ====================== 前台 ======================
    // 新增
    @Override
    public void frontAddOrder(Order order) {
        order.setCreateTime(LocalDateTime.now());
        order.setStatus(0); // 0=待支付
        this.save(order);
    }

    // 查询
    @Override
    public Page<Order> frontMyOrder(Long userId, Integer pageNum, Integer pageSize) {
        Page<Order> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);
        wrapper.orderByDesc(Order::getCreateTime);
        return this.page(page, wrapper);
    }

    // 删除
    @Override
    public void frontDeleteOrder(Long orderId, Long userId) {
        Order order = this.getById(orderId);
        if (order == null) throw new BusinessException("订单不存在");
        if (!userId.equals(order.getUserId())) throw new BusinessException("无权限删除");

        this.removeById(orderId);
    }
}