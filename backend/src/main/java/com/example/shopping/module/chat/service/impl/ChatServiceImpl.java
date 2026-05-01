package com.example.shopping.module.chat.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.example.shopping.module.chat.entity.ChatMessage;
import com.example.shopping.module.chat.entity.ChatSession;
import com.example.shopping.module.chat.mapper.ChatMessageMapper;
import com.example.shopping.module.chat.mapper.ChatSessionMapper;
import com.example.shopping.module.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatSessionMapper sessionMapper;

    @Autowired
    private ChatMessageMapper messageMapper;

    @Override
    public ChatSession getOrCreateSession(Long shopId, Long userId) {
        LambdaQueryWrapper<ChatSession> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatSession::getShopId, shopId)
                .eq(ChatSession::getUserId, userId);

        ChatSession session = sessionMapper.selectOne(wrapper);
        if (session == null) {
            session = new ChatSession();
            session.setShopId(shopId);
            session.setUserId(userId);
            session.setUnreadCount(0);
            session.setCreatedAt(LocalDateTime.now());
            session.setUpdatedAt(LocalDateTime.now());
            sessionMapper.insert(session);
        }
        return session;
    }

    @Override
    public void saveMessage(Long sessionId, Long fromUserId, String content, String topic, String senderType) {
        ChatMessage message = new ChatMessage();
        message.setSessionId(sessionId);
        message.setFromUserId(fromUserId);
        message.setContent(content);
        message.setTopic(topic);
        message.setIsRead(0);
        message.setSenderType(senderType);
        message.setCreatedAt(LocalDateTime.now());
        messageMapper.insert(message);

        ChatSession session = sessionMapper.selectById(sessionId);
        session.setLastMessage(content);
        session.setUnreadCount(session.getUnreadCount() + 1);
        session.setUpdatedAt(LocalDateTime.now());
        sessionMapper.updateById(session);
    }

    @Override
    public List<ChatSession> getSessionListByShopId(Long shopId) {
        LambdaQueryWrapper<ChatSession> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatSession::getShopId, shopId)
                .orderByDesc(ChatSession::getUpdatedAt);
        return sessionMapper.selectList(wrapper);
    }

    @Override
    public List<ChatMessage> getMessageListBySessionId(Long sessionId) {
        LambdaQueryWrapper<ChatMessage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatMessage::getSessionId, sessionId)
                .orderByAsc(ChatMessage::getCreatedAt);
        return messageMapper.selectList(wrapper);
    }

    @Override
    public void clearUnreadCount(Long sessionId) {
        LambdaUpdateWrapper<ChatMessage> msgUpdate = new LambdaUpdateWrapper<>();
        msgUpdate.eq(ChatMessage::getSessionId, sessionId)
                .eq(ChatMessage::getIsRead, 0)
                .set(ChatMessage::getIsRead, 1);
        messageMapper.update(null, msgUpdate);

        ChatSession session = new ChatSession();
        session.setId(sessionId);
        session.setUnreadCount(0);
        sessionMapper.updateById(session);
    }
}