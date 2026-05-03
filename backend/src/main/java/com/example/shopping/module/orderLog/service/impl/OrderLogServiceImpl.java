package com.example.shopping.module.orderLog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.shopping.module.orderLog.entity.OrderLog;
import com.example.shopping.module.orderLog.entity.OrderLog;
import com.example.shopping.module.orderLog.mapper.OrderLogMapper;
import com.example.shopping.module.orderLog.service.OrderLogService;
import com.example.shopping.module.orderLog.mapper.OrderLogMapper;
import com.example.shopping.module.orderLog.service.OrderLogService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OrderLogServiceImpl extends ServiceImpl<OrderLogMapper, OrderLog> implements OrderLogService {

    @Override
    public Page<OrderLog> getLogList(Integer pageNum, Integer pageSize, String refundOrderNo) {
        LambdaQueryWrapper<OrderLog> wrapper = new LambdaQueryWrapper<>();
        if (refundOrderNo != null && !refundOrderNo.isEmpty()) {
            wrapper.eq(OrderLog::getRefundOrderNo, refundOrderNo);
        }
        wrapper.orderByDesc(OrderLog::getCreateTime);
        return page(new Page<>(pageNum, pageSize), wrapper);
    }

    @Override
    public void addLog(Long orderId, String refundOrderNo, String operatorName, String content, String ip) {
        OrderLog log = new OrderLog();
        log.setOrderId(orderId);
        log.setRefundOrderNo(refundOrderNo);
        log.setOperatorName(operatorName);
        log.setOperateContent(content);
        log.setIpAddress(ip);
        log.setCreateTime(LocalDateTime.now());
        save(log);
    }
}