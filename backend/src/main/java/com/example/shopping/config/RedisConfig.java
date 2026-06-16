package com.example.shopping.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.Map;
import java.util.Random;

@Configuration
@EnableCaching
public class RedisConfig {

    private static final Random RANDOM = new Random();

    // Kryo 序列化器（大厂高性能）
    private final KryoRedisSerializer<Object> kryoSerializer = new KryoRedisSerializer<>();
    private final StringRedisSerializer stringSerializer = new StringRedisSerializer();

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // Key 使用字符串
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // Value 使用 Kryo 二进制序列化
        template.setValueSerializer(kryoSerializer);
        template.setHashValueSerializer(kryoSerializer);

        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        // 全局默认配置：10~15分钟随机TTL，给其他普通缓存用
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10 + new Random().nextInt(5)))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(stringSerializer)
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(kryoSerializer)
                );

        // 单独配置秒杀首页缓存：强制30秒过期，覆盖全局配置
        RedisCacheConfiguration flashHomeConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(30))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(stringSerializer)
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(kryoSerializer)
                );

        return RedisCacheManager.builder(factory)
                .cacheDefaults(defaultConfig)
                // 指定缓存名称 flash_sale_home 使用30秒TTL
                .withInitialCacheConfigurations(Map.of(
                        "flash_sale_home", flashHomeConfig
                ))
                .build();
    }
}