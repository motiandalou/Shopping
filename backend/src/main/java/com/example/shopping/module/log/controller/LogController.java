package com.example.shopping.module.log.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.log.entity.OperationLog;
import com.example.shopping.module.log.service.OperationLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/log")
@RequiredArgsConstructor
public class LogController {

    private final OperationLogService logService;

    @GetMapping("/list")
    public Result<List<OperationLog>> list() {
        return Result.success(logService.list());
    }
}