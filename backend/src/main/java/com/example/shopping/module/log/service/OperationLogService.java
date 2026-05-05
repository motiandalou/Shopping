package com.example.shopping.module.log.service;

import com.example.shopping.module.log.entity.OperationLog;

import java.util.List;

public interface OperationLogService {
    // 存
    void save(OperationLog log);
    // 查询列表
    List<OperationLog> list();
}