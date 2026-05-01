package com.example.shopping.gateway.dto;

import com.example.shopping.module.order.entity.Order;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
// 自动忽略所有 null 字段，只显示有值的
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GatewayMessageDTO {

    // 通用
    private String topic;
    private String type;

    // 聊天专用字段
    private Long fromUserId;
    private String content;
    private Long shopId;
    private String senderType;

    // 订单专用字段
    private Order orderInfo;
    private Long goodsId;
    // 订单创建时间（格式化：yyyy-MM-dd HH:mm:ss）
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime orderCreateTime;

    // 构造方法1：专门给【客服聊天】使用
    public GatewayMessageDTO(String topic, String type,
                             Long fromUserId, String content,
                             Long shopId, String senderType) {
        this.topic = topic;
        this.type = type;
        this.fromUserId = fromUserId;
        this.content = content;
        this.shopId = shopId;
        this.senderType = senderType;
    }

    // 构造方法2：专门给【订单推送】使用
    public GatewayMessageDTO(String topic, String type, String content,Order orderInfo,LocalDateTime orderCreateTime) {
        this.topic = topic;
        this.type = type;
        this.orderInfo = orderInfo;
        this.content = content;
        this.orderCreateTime = orderCreateTime;
    }

    // 无参构造（必须保留，否则反序列化报错）
    public GatewayMessageDTO() {
    }
}