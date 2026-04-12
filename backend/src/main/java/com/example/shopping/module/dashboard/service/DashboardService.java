package com.example.shopping.module.dashboard.service;

import com.example.shopping.module.dashboard.entity.Dashboard;

public interface DashboardService {
    /**
     * 获取数据概览统计
     */
    Dashboard getStats();
}