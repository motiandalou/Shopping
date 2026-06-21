package com.example.shopping.module.shopConfig.controller;

import com.example.shopping.common.result.Result;
import com.example.shopping.module.log.annotation.Log;
import com.example.shopping.module.shopConfig.entity.ShopConfig;
import com.example.shopping.module.shopConfig.service.ShopConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/shopConfig")
@Tag(name = "店铺系统配置", description = "店铺基础信息、开关、参数等系统配置接口")
public class ShopConfigController {

    private final ShopConfigService shopConfigService;

    @GetMapping("/detail")
    @Operation(summary = "获取店铺全局配置", description = "查询当前店铺唯一的系统配置信息")
    public Result<ShopConfig> getConfig() {
        ShopConfig config = shopConfigService.getConfig();
        return Result.success(config);
    }

    @Log(module = "店铺配置", operation = "保存店铺配置")
    @PostMapping("/add")
    @Operation(summary = "新增/初始化店铺配置", description = "第一次创建店铺系统配置")
    public Result<String> add(
            @Parameter(description = "店铺配置信息", required = true) @RequestBody ShopConfig shopConfig) {
        try {
            String msg = shopConfigService.saveConfig(shopConfig);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @Log(module = "店铺配置", operation = "修改店铺配置")
    @PutMapping("/update")
    @Operation(summary = "修改店铺配置", description = "更新已有的店铺系统配置")
    public Result<String> update(
            @Parameter(description = "店铺配置信息", required = true) @RequestBody ShopConfig shopConfig) {
        return Result.success(shopConfigService.updateConfig(shopConfig));
    }
}