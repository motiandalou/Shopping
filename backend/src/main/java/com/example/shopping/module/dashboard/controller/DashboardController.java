package com.example.shopping.module.dashboard.controller;

import com.example.shopping.common.result.Result;
import com.example.shopping.module.dashboard.entity.Dashboard;
import com.example.shopping.module.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@Tag(name = "数据概览/首页统计", description = "后台管理首页数据统计、大盘接口")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "获取首页统计数据", description = "用户数、订单数、销售额、商品数等概览统计")
    public Result<Dashboard> getStats() {
        Dashboard stats = dashboardService.getStats();
        return Result.success(stats);
    }
}