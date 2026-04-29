package com.example.shopping.module.chat.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("chat_message")
public class ChatMessage {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long sessionId;

    private Long fromUserId;

    private String content;

    private String topic;

    private LocalDateTime createdAt;

    private Integer isRead; // 0=未读，1=已读

    /**
     * 发送者类型：USER-买家，SHOP_ADMIN-店铺客服
     */
    private String senderType;
}