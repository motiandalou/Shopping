package com.example.shopping.module.orderLog.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.orderLog.service.OrderLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/order/log")
@Tag(name = "订单操作日志", description = "订单、退款、售后全流程操作日志查询接口")
public class OrderLogController {

    private final OrderLogService orderLogService;

    @GetMapping("/list")
    @Operation(summary = "分页查询订单日志列表", description = "支持根据售后工单号筛选日志")
    public Result<?> list(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "每页条数", example = "10") @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "售后工单号（可选）", example = "REFUND20250509")
            @RequestParam(required = false) String refundOrderNo
    ) {
        return Result.success(orderLogService.getLogList(pageNum, pageSize, refundOrderNo));
    }

}