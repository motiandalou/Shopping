package com.example.shopping.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan({
        "com.example.shopping.module.category.mapper",
        "com.example.shopping.module.goods.mapper",
        "com.example.shopping.module.user.mapper",
        "com.example.shopping.module.order.mapper",
        "com.example.shopping.module.dashboard.mapper",
        "com.example.shopping.module.staff.mapper",
        "com.example.shopping.module.cart.mapper",
        "com.example.shopping.module.chat.mapper",
        "com.example.shopping.module.orderLog.mapper",
        "com.example.shopping.module.log.mapper",
        "com.example.shopping.module.shopConfig.mapper",
        "com.example.shopping.module.favorite.mapper",
})
public class MapperConfig {

}