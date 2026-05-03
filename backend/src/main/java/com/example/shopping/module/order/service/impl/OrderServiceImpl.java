package com.example.shopping.module.order.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.shopping.common.exception.BusinessException;
import com.example.shopping.module.order.entity.Order;
import com.example.shopping.module.order.mapper.OrderMapper;
import com.example.shopping.module.order.service.OrderService;
import com.example.shopping.module.orderLog.service.OrderLogService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    @Resource
    private OrderLogService orderLogService;

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
//        order.setStatus(0); // 0=待支付
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

    // 订单详情
    @Override
    public Order frontDetail(Long orderId, Long userId) {
        // 1. 查询订单
        Order order = this.getById(orderId);
        // 2. 订单不存在校验
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        // 3. 权限校验：只能查看自己的订单
        if (!userId.equals(order.getUserId())) {
            throw new BusinessException("无权限查看该订单");
        }
        // 4. 返回订单详情
        return order;
    }

    // 删除
    @Override
    public void frontDeleteOrder(Long orderId, Long userId) {
        Order order = this.getById(orderId);
        if (order == null) throw new BusinessException("订单不存在");
        if (!userId.equals(order.getUserId())) throw new BusinessException("无权限删除");

        this.removeById(orderId);
    }

    // ================== 申请退款 ==================
    @Override
    @Transactional
    public void applyRefund(Long orderId, Long userId, Integer refundType, String refundReason) {
        Order order = this.getById(orderId);
        if (order == null) throw new RuntimeException("订单不存在");
        if (!userId.equals(order.getUserId())) throw new RuntimeException("无权限");

        Integer status = order.getStatus();
        if (status == null || !(status == 1 || status == 2 || status == 3)) {
            throw new RuntimeException("当前状态不可退款");
        }
        if (order.getRefundStatus() != null && order.getRefundStatus() != 0) {
            throw new RuntimeException("已申请售后");
        }

        // 生成工单号
        String refundOrderNo = "REFUND_" + System.currentTimeMillis();

        order.setRefundOrderNo(refundOrderNo);
        order.setRefundType(refundType);
        order.setRefundStatus(1);
        order.setRefundReason(refundReason);
        order.setRefundAmount(order.getTotalAmount());
        order.setRefundApplyTime(LocalDateTime.now());

        this.updateById(order);
    }

    // ================== 【售后工单 - 后台接口】 ==================

    // 售后工单
    @Override
    public Page<Order> getRefundOrderList(Integer pageNum, Integer pageSize, Integer[] refundStatus) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        // 查询对应状态的工单
        if (refundStatus != null && refundStatus.length > 0) {
            wrapper.in(Order::getRefundStatus, refundStatus);
        } else {
            // 不传查询全部
            wrapper.gt(Order::getRefundStatus, 0);
        }

        wrapper.orderByDesc(Order::getRefundApplyTime);
        return this.page(new Page<>(pageNum, pageSize), wrapper);
    }

    // 2. 工单详情
    @Override
    public Order getRefundDetail(Long orderId) {
        return this.getById(orderId);
    }

    // 3. 审核退款
    @Override
    @Transactional
    public void auditRefund(Long orderId, Integer refundStatus, String refundRemark) {
        Order order = this.getById(orderId);
        if (order == null) throw new RuntimeException("订单不存在");

        // 操作内容
        String operateContent = "";
        if (refundStatus == 2) {
            operateContent = "审核通过，等待退款";
        } else if (refundStatus == 4) {
            operateContent = "审核驳回：" + refundRemark;
        }

        orderLogService.addLog(
                orderId,                // 订单ID
                order.getRefundOrderNo(),// 工单号
                "管理员",               // TODO 操作人
                operateContent,         // 操作内容
                ""                      // TODO IP（可空）
        );

        // 更新订单状态
        order.setRefundStatus(refundStatus);
        if (refundStatus == 4) {
            order.setRefundReason(refundRemark);
        }
        this.updateById(order);
    }
}