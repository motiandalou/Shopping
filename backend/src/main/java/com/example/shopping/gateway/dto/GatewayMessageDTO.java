package com.example.shopping.gateway.dto;

import com.example.shopping.module.order.entity.Order;
import lombok.Data;

@Data
public class GatewayMessageDTO {
    private String topic;       // 主题：chat_1_2 / order_admin
    private Long fromUserId;    // 发送者ID
    private String type;        // 消息类型：ORDER / CHAT / NOTICE
    private String content;     // 消息内容
    private Long shopId;        // 店铺ID，聊天业务用
    private Order orderInfo;    // 订单信息
    private Long goodsId;
    private String senderType;
}