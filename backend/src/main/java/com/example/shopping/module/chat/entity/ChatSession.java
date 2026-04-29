package com.example.shopping.module.chat.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("chat_session")
public class ChatSession {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long shopId;
    private Long userId;
    private Integer unreadCount;
    private String lastMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}