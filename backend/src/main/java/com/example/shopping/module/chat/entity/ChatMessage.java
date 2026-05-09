package com.example.shopping.module.chat.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("chat_message")
@Schema(description = "聊天消息实体")
public class ChatMessage {
    @TableId(type = IdType.AUTO)
    @Schema(description = "消息ID", example = "1", required = true)
    private Long id;

    @Schema(description = "会话ID", example = "1001", required = true)
    private Long sessionId;

    @Schema(description = "发送方用户ID", example = "101")
    private Long fromUserId;

    @Schema(description = "消息内容", example = "你好，请问商品什么时候发货？")
    private String content;

    @Schema(description = "消息主题", example = "商品咨询")
    private String topic;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Schema(description = "发送时间", example = "2025-05-09 15:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "是否已读 0-未读 1-已读", example = "0")
    private Integer isRead; // 0=未读，1=已读

    @Schema(description = "发送者类型 USER-买家 SHOP_ADMIN-店铺客服", example = "USER")
    private String senderType;
}