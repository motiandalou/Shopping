package com.example.shopping.module.order.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.shopping.module.order.entity.Order;

public interface OrderService extends IService<Order> {
    // 后台--查询
    Page<Order> backOrderList(Integer pageNum, Integer pageSize);
    // 后台--更新状态
    void backUpdateStatus(Long orderId, Integer status);

    // 前台--新增
    void frontAddOrder(Order order);
    // 前台--查询
    Page<Order> frontMyOrder(Long userId, Integer pageNum, Integer pageSize);
    // 前台--删除
    void frontDeleteOrder(Long orderId, Long userId);
    // 前台--订单详情
    Order frontDetail(Long orderId, Long userId);
    // 前台--申请退款
    void applyRefund(Long orderId, Long userId, Integer refundType, String refundReason);
    // ==================== 【售后工单接口】 ====================
    // 1. 售后工单列表(根据状态筛选)
    Page<Order> getRefundOrderList(Integer pageNum, Integer pageSize,Integer[] refundStatus);
    // 2. 工单详情
    Order getRefundDetail(Long orderId);
    // 3. 审核退款（通过 / 拒绝）
    void auditRefund(Long orderId, Integer refundStatus, String refundRemark);
}