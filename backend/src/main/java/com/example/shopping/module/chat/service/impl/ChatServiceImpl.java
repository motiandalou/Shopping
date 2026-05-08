package com.example.shopping.module.chat.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.example.shopping.module.chat.entity.ChatMessage;
import com.example.shopping.module.chat.entity.ChatSession;
import com.example.shopping.module.chat.mapper.ChatMessageMapper;
import com.example.shopping.module.chat.mapper.ChatSessionMapper;
import com.example.shopping.module.chat.service.ChatService;
import com.example.shopping.module.chat.vo.ChatSessionVO;
import com.example.shopping.module.user.mapper.UserMapper;
import com.example.shopping.module.user.entity.User;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatSessionMapper sessionMapper;

    @Autowired
    private ChatMessageMapper messageMapper;

    @Autowired
    private UserMapper userMapper;

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
        // 只有【用户发送】的消息，才增加未读数量(解决BUG: 客服发的也加未读消息)
        if ("USER".equals(senderType)) {
            session.setUnreadCount(session.getUnreadCount() + 1);
        }
        session.setUpdatedAt(LocalDateTime.now());
        sessionMapper.updateById(session);
    }

//    @Override
//    public List<ChatSession> getSessionListByShopId(Long shopId) {
//        LambdaQueryWrapper<ChatSession> wrapper = new LambdaQueryWrapper<>();
//        wrapper.eq(ChatSession::getShopId, shopId)
//                .orderByDesc(ChatSession::getUpdatedAt);
//        return sessionMapper.selectList(wrapper);
//    }

    @Override
    public List<ChatSessionVO> getSessionListByShopId(Long shopId) {
        // 1. 查询会话
        LambdaQueryWrapper<ChatSession> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChatSession::getShopId, shopId)
                .orderByDesc(ChatSession::getUpdatedAt);
        List<ChatSession> sessions = sessionMapper.selectList(wrapper);

        // 2. 批量拿用户ID
        Set<Long> userIds = new HashSet<>();
        for (ChatSession s : sessions) {
            userIds.add(s.getUserId());
        }

        // 3. 批量查用户名
        Map<Long, String> userMap = new HashMap<>();
        if (!userIds.isEmpty()) {
            List<User> users = userMapper.selectBatchIds(userIds);
            for (User u : users) {
                userMap.put(u.getId(), u.getUserName());
            }
        }

        // 4. 组装VO返回
        List<ChatSessionVO> result = new ArrayList<>();
        for (ChatSession s : sessions) {
            ChatSessionVO vo = new ChatSessionVO();
            BeanUtils.copyProperties(s, vo);
            vo.setUserName(userMap.getOrDefault(s.getUserId(), "未知用户"));
            result.add(vo);
        }

        return result;
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