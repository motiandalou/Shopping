package com.example.shopping.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Profile("dev") // 只在【开发环境】生效！
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 允许所有前端域名（生产环境可替换为你的前端地址）
                .allowedOriginPatterns("*")
                // 允许所有请求方法
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // 允许所有请求头，必须包含Authorization（JWT Token用）
                .allowedHeaders("*")
                // 暴露Authorization头，前端才能拿到Token
                .exposedHeaders("Authorization")
                // 允许携带Cookie/认证信息
                .allowCredentials(true)
                // 预检请求有效期（3600秒=1小时）
                .maxAge(3600);
    }
}