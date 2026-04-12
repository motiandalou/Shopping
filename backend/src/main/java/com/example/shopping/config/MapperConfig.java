package com.example.shopping.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan({
        "com.example.shopping.module.category.mapper",
        "com.example.shopping.module.goods.mapper",
        "com.example.shopping.module.user.mapper",
        "com.example.shopping.module.order.mapper",
})
public class MapperConfig {

}