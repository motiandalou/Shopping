package com.example.shopping.module.chat.service;

import com.example.shopping.module.chat.entity.ChatMessage;
import com.example.shopping.module.chat.entity.ChatSession;
import com.example.shopping.module.chat.vo.ChatSessionVO;

import java.util.List;

public interface ChatService {

    ChatSession getOrCreateSession(Long shopId, Long userId);

    void saveMessage(Long sessionId, Long fromUserId, String content, String topic,String senderType);

//    List<ChatSession> getSessionListByShopId(Long shopId);

    List<ChatMessage> getMessageListBySessionId(Long sessionId);

    void clearUnreadCount(Long sessionId);

    List<ChatSessionVO> getSessionListByShopId(Long shopId);
}