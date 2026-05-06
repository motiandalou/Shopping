package com.example.shopping.module.shopConfig.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.log.annotation.Log;
import com.example.shopping.module.shopConfig.entity.ShopConfig;
import com.example.shopping.module.shopConfig.service.ShopConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/shopConfig")
public class ShopConfigController {

    private final ShopConfigService shopConfigService;

    // =====================【获取店铺配置】=====================
    @GetMapping("/detail")
    public Result<ShopConfig> getConfig() {
        ShopConfig config = shopConfigService.getConfig();
        return Result.success(config);
    }

    // =====================【保存配置】=====================
    @Log(module = "店铺配置", operation = "保存店铺配置")
    @PostMapping("/add")
    public Result<String> add(@RequestBody ShopConfig shopConfig) {
        try {
            String msg = shopConfigService.saveConfig(shopConfig);
            return Result.success(msg);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    // =====================【修改配置】=====================
    @Log(module = "店铺配置", operation = "修改店铺配置")
    @PutMapping("/update")
    public Result<String> update(@RequestBody ShopConfig shopConfig) {
        return Result.success(shopConfigService.updateConfig(shopConfig));
    }
}