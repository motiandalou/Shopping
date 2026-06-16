package com.example.shopping.common.config;

import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 全局Jackson时间序列化/反序列化配置
 * 统一支持 yyyy-MM-dd HH:mm:ss 格式 LocalDateTime
 * 解决前端传递 2026-06-18 00:00:00 解析报错问题
 */
@Configuration
public class JacksonConfig {

    // 统一日期格式
    private static final String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonDateTimeCustomizer() {
        return builder -> {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_TIME_PATTERN);
            // 序列化：后端返回实体LocalDateTime时，自动转为 yyyy-MM-dd HH:mm:ss 字符串
            builder.serializers(new LocalDateTimeSerializer(formatter));
            // 反序列化：前端传入 yyyy-MM-dd HH:mm:ss 字符串，自动转LocalDateTime
            builder.deserializers(new LocalDateTimeDeserializer(formatter));
        };
    }
}