package com.example.shopping.module.shopConfig.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.shopping.module.shopConfig.entity.ShopConfig;
import com.example.shopping.module.shopConfig.mapper.ShopConfigMapper;
import com.example.shopping.module.shopConfig.service.ShopConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShopConfigServiceImpl implements ShopConfigService {

    private final ShopConfigMapper shopConfigMapper;

    /**
     * 获取店铺配置
     */
    @Override
    public ShopConfig getConfig() {
        return shopConfigMapper.selectOne(new LambdaQueryWrapper<>());
    }

    /**
     * 保存配置
     */
    @Override
    public String saveConfig(ShopConfig shopConfig) {
        shopConfigMapper.insert(shopConfig);
        return "保存成功";
    }

    /**
     * 修改配置
     */
    @Override
    public String updateConfig(ShopConfig shopConfig) {
        System.out.println("shopConfig:" + shopConfig);
        shopConfigMapper.updateById(shopConfig);
        return "修改成功";
    }
}