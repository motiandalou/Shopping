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
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10 + RANDOM.nextInt(5)))

                // Key 序列化
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(stringSerializer)
                )
                // Value 用 Kryo（无类名、无JSON、无明文）
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(kryoSerializer)
                );

        return RedisCacheManager.builder(factory)
                .cacheDefaults(config)
                .build();
    }


}