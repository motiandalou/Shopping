package com.example.shopping.module.order.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.shopping.module.order.entity.Order;

public interface OrderService extends IService<Order> {
    // 后台
    // 查询
    Page<Order> backOrderList(Integer pageNum, Integer pageSize);
    // 更新状态
    void backUpdateStatus(Long orderId, Integer status);

    // 前台
    // 新增
    void frontAddOrder(Order order);
    // 查询
    Page<Order> frontMyOrder(Long userId, Integer pageNum, Integer pageSize);
    // 删除
    void frontDeleteOrder(Long orderId, Long userId);
}