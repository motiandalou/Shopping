package com.example.shopping.module.chat.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatSessionVO {
    private Long id;
    private Long shopId;
    private Long userId;
    private Integer unreadCount;
    private String lastMessage;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime updatedAt;

    // 用户名
    private String userName;
}