package com.example.shopping.module.shopConfig.service;

import com.example.shopping.module.shopConfig.entity.ShopConfig;

public interface ShopConfigService {

    // 获取店铺配置
    ShopConfig getConfig();

    // 保存配置
    String saveConfig(ShopConfig shopConfig);

    // 修改配置
    String updateConfig(ShopConfig shopConfig);
}