package com.example.shopping.module.chat.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("chat_session")
@Schema(description = "聊天会话实体")
public class ChatSession {

    @TableId(type = IdType.AUTO)
    @Schema(description = "会话ID", example = "1", required = true)
    private Long id;

    @Schema(description = "店铺ID", example = "1")
    private Long shopId;

    @Schema(description = "用户ID", example = "1001")
    private Long userId;

    @Schema(description = "未读消息数量", example = "0")
    private Integer unreadCount;

    @Schema(description = "最新一条消息内容", example = "你好")
    private String lastMessage;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "会话创建时间", example = "2025-05-09 15:30:00")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "会话更新时间", example = "2025-05-09 16:20:00")
    private LocalDateTime updatedAt;
}