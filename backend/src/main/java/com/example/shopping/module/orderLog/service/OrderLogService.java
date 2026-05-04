package com.example.shopping.module.orderLog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.shopping.module.orderLog.entity.OrderLog;

public interface OrderLogService extends IService<OrderLog> {
    Page<OrderLog> getLogList(Integer pageNum, Integer pageSize, String refundOrderNo);
    void addLog(Long orderId, String refundOrderNo, String operatorName, String content);
}