package com.example.shopping.module.dashboard.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.dashboard.entity.Dashboard;
import com.example.shopping.module.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired; // 1. 导入这个包

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * 获取数据概览统计接口
     */
    @GetMapping("/stats")
    public Result<Dashboard> getStats() {
        Dashboard stats = dashboardService.getStats();
        return Result.success(stats);
    }
}