package com.example.shopping.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaBatchConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.max-poll-records}")
    private Integer maxPollRecords;

    /**
     * 批量消费工厂 bean 名称：batchListenerContainerFactory
     * 对应 @KafkaListener(containerFactory = "batchListenerContainerFactory")
     */
    @Bean("batchListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, Object> batchListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        // 设置消费者工厂
        factory.setConsumerFactory(consumerFactory());
        // 开启批量消费（核心开关）
        factory.setBatchListener(true);
        // 手动提交偏移量（保证消息不丢失）
        factory.getContainerProperties().setAckMode(org.springframework.kafka.listener.ContainerProperties.AckMode.MANUAL);

        return factory;
    }

    /**
     * 消费者工厂
     */
    private ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        // kafka地址
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        // key 反序列化
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        // value 反序列化（JSON）
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        // 一次最多拉取消息条数（批量大小）
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, maxPollRecords);
        // 关闭自动提交
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);

        // JSON 反序列化信任所有包（解决实体类解析问题）
        JsonDeserializer<Object> jsonDeserializer = new JsonDeserializer<>();
        jsonDeserializer.addTrustedPackages("*");

        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                jsonDeserializer
        );
    }
}