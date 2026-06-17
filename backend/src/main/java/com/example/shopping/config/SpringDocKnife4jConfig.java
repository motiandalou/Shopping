package com.example.shopping.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger
 * 访问地址: http://localhost:8081/api/doc.html
 */

@Configuration
public class SpringDocKnife4jConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        Contact contact = new Contact();
        contact.setName("JIANG WEI");
        return new OpenAPI()
                .info(new Info()
                        .title("MALL商城-在线API文档")
                        .version("v1.0.0")
                        .description("MALL商城 和Shop Admin后台管理系统的全部接口")
                        .contact(contact)
                );
    }

    /**
     * 全部接口总览分组
     */
    @Bean
    public GroupedOpenApi allApiGroup() {
        return GroupedOpenApi.builder()
                .group("全部接口")
                .pathsToMatch("/**")
                .build();
    }

    /**
     * 用户管理
     */
    @Bean
    public GroupedOpenApi userGroup() {
        return GroupedOpenApi.builder()
                .group("用户管理")
                .pathsToMatch("/user/**")
                .build();
    }

    /**
     * 订单操作日志
     */
    @Bean
    public GroupedOpenApi orderLogGroup() {
        return GroupedOpenApi.builder()
                .group("订单操作日志")
                .pathsToMatch("/order/log/**")
                .build();
    }

    /**
     * 认证授权
     */
    @Bean
    public GroupedOpenApi authGroup() {
        return GroupedOpenApi.builder()
                .group("认证授权")
                .pathsToMatch("/auth/**")
                .build();
    }

    /**
     * 秒杀模块
     */
    @Bean
    public GroupedOpenApi seckillGroup() {
        return GroupedOpenApi.builder()
                .group("秒杀模块")
                .pathsToMatch("/flash/**")
                .build();
    }

    /**
     * 商品收藏管理
     */
    @Bean
    public GroupedOpenApi collectGroup() {
        return GroupedOpenApi.builder()
                .group("商品收藏管理")
                .pathsToMatch("/favorite/**")
                .build();
    }

    /**
     * 商品分类管理
     */
    @Bean
    public GroupedOpenApi categoryGroup() {
        return GroupedOpenApi.builder()
                .group("商品分类管理")
                .pathsToMatch("/category/**")
                .build();
    }

    /**
     * 在线客服聊天
     */
    @Bean
    public GroupedOpenApi chatGroup() {
        return GroupedOpenApi.builder()
                .group("在线客服聊天")
                .pathsToMatch("/chat/**")
                .build();
    }

    /**
     * 操作日志管理
     */
    @Bean
    public GroupedOpenApi operateLogGroup() {
        return GroupedOpenApi.builder()
                .group("操作日志管理")
                .pathsToMatch("/log/**")
                .build();
    }

    /**
     * 购物车管理
     */
    @Bean
    public GroupedOpenApi cartGroup() {
        return GroupedOpenApi.builder()
                .group("购物车管理")
                .pathsToMatch("/cart/**")
                .build();
    }

    /**
     * 数据概览-首页统计
     */
    @Bean
    public GroupedOpenApi dashboardGroup() {
        return GroupedOpenApi.builder()
                .group("数据概览-首页统计")
                .pathsToMatch("/dashboard/**")
                .build();
    }

    /**
     * 物流快递管理
     */
    @Bean
    public GroupedOpenApi logisticsGroup() {
        return GroupedOpenApi.builder()
                .group("物流快递管理")
                .pathsToMatch("/logistics/**")
                .build();
    }

    /**
     * 店铺系统配置
     */
    @Bean
    public GroupedOpenApi shopConfigGroup() {
        return GroupedOpenApi.builder()
                .group("店铺系统配置")
                .pathsToMatch("/shopConfig/**")
                .build();
    }

    /**
     * 商品管理
     */
    @Bean
    public GroupedOpenApi goodsGroup() {
        return GroupedOpenApi.builder()
                .group("商品管理")
                .pathsToMatch("/goods/**")
                .build();
    }

    /**
     * 后台员工管理
     */
    @Bean
    public GroupedOpenApi staffGroup() {
        return GroupedOpenApi.builder()
                .group("后台员工管理")
                .pathsToMatch("/staff/**")
                .build();
    }

    /**
     * 订单管理
     */
    @Bean
    public GroupedOpenApi orderGroup() {
        return GroupedOpenApi.builder()
                .group("订单管理")
                .pathsToMatch("/order/front/**")
                .build();
    }
}