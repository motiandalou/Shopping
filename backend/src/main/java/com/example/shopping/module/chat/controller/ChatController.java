package com.example.shopping.module.chat.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.chat.entity.ChatMessage;
import com.example.shopping.module.chat.entity.ChatSession;
import com.example.shopping.module.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * 获取店铺的所有会话列表（后台客服页）
     * 这里只查询，不清零未读！
     * @param shopId 店铺ID，默认1
     */
    @GetMapping("/sessions")
    public Result<List<ChatSession>> getSessions(
            @RequestParam(defaultValue = "1") Long shopId) {
        List<ChatSession> list = chatService.getSessionListByShopId(shopId);
        return Result.success(list);
    }

    /**
     * 获取会话的聊天记录
     * 进入聊天页 → 清空未读小红点
     */
    @GetMapping("/messages")
    public Result<List<ChatMessage>> getMessages(
            @RequestParam Long sessionId) {  // 客服ID（必须传）

        // 1. 查询消息列表
        List<ChatMessage> list = chatService.getMessageListBySessionId(sessionId);

        // 2. 关键：进入聊天页 → 清空未读数
        chatService.clearUnreadCount(sessionId);

        return Result.success(list);
    }

    /**
     * 单独清空未读（备用，前端也可以调用）
     */
    @GetMapping("/clearUnread")
    public Result clearUnread(
            @RequestParam Long sessionId) {
        chatService.clearUnreadCount(sessionId);
        return Result.success();
    }
}