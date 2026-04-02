package com.example.shopping.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan({
        "com.example.shopping.module.auth.mapper",
        "com.example.shopping.module.category.mapper",
        "com.example.shopping.module.goods.mapper"
})
public class MapperConfig {

}