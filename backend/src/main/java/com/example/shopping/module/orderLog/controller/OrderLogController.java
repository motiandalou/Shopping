package com.example.shopping.module.orderLog.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.orderLog.service.OrderLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/order/log")
public class OrderLogController {

    private final OrderLogService orderLogService;

    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String refundOrderNo
    ) {
        return Result.success(orderLogService.getLogList(pageNum, pageSize, refundOrderNo));
    }
}