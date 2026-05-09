package com.example.shopping.module.log.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.log.entity.OperationLog;
import com.example.shopping.module.log.service.OperationLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/log")
@RequiredArgsConstructor
@Tag(name = "操作日志管理", description = "系统操作日志查询接口")
public class LogController {

    private final OperationLogService logService;

    @GetMapping("/list")
    @Operation(summary = "查询系统操作日志列表", description = "查看所有用户的操作记录")
    public Result<List<OperationLog>> list() {
        return Result.success(logService.list());
    }
}