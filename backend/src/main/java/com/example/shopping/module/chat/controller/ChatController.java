package com.example.shopping.module.chat.controller;

import com.example.shopping.config.Result;
import com.example.shopping.module.chat.entity.ChatMessage;
import com.example.shopping.module.chat.entity.ChatSession;
import com.example.shopping.module.chat.service.ChatService;
import com.example.shopping.module.chat.vo.ChatSessionVO;
import com.example.shopping.module.log.annotation.Log;
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
     * @param shopId 店铺ID，默认1
     */
//    @GetMapping("/sessions")
//    public Result<List<ChatSession>> getSessions(
//            @RequestParam(defaultValue = "1") Long shopId) {
//        List<ChatSession> list = chatService.getSessionListByShopId(shopId);
//        return Result.success(list);
//    }

    @GetMapping("/sessions")
    public Result<List<ChatSessionVO>> getSessions(
            @RequestParam(defaultValue = "1") Long shopId) {
        return Result.success(chatService.getSessionListByShopId(shopId));
    }

    /**
     * 获取会话的聊天记录
     */
    @Log(module = "聊天管理", operation = "查看聊天记录")
    @GetMapping("/messages")
    public Result<List<ChatMessage>> getMessages(
            @RequestParam Long sessionId) {  // 客服ID（必须传）
        List<ChatMessage> list = chatService.getMessageListBySessionId(sessionId);
        return Result.success(list);
    }


    /**
     * 清空未读
     */
    @Log(module = "聊天管理", operation = "清空未读消息")
    @GetMapping("/clearUnread")
    public Result clearUnread(
            @RequestParam Long sessionId) {
        chatService.clearUnreadCount(sessionId);
        return Result.success();
    }
}