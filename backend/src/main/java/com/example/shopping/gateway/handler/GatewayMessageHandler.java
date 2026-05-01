package com.example.shopping.gateway.handler;

import com.example.shopping.gateway.dto.GatewayMessageDTO;
import com.example.shopping.module.chat.entity.ChatSession;
import com.example.shopping.module.chat.service.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.util.concurrent.GlobalEventExecutor;
import io.netty.channel.ChannelHandler.Sharable;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Sharable
public class GatewayMessageHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

    private static final ChannelGroup channelGroup = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);
    private static final Map<Long, Channel> userChannelMap = new ConcurrentHashMap<>();
    private static final Map<String, Set<Channel>> topicChannelMap = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    private static ChatService chatService;

    public static void setChatService(ChatService service) {
        chatService = service;
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        channelGroup.add(ctx.channel());
        System.out.println("✅ 新客户端连接：" + ctx.channel().id());
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame frame) throws Exception {
        try {
            String json = frame.text();
            GatewayMessageDTO dto = objectMapper.readValue(json, GatewayMessageDTO.class);
            System.out.println("📋 解析后消息对象 = " + dto);

            Long fromUserId = dto.getFromUserId();
            String topic = dto.getTopic();
            String content = dto.getContent();
            Long shopId = dto.getShopId() == null ? 1L : dto.getShopId();

            // 绑定用户
            if (fromUserId != null) {
                userChannelMap.put(fromUserId, ctx.channel());
            }

            // 绑定 topic
            if (topic != null && !topic.isBlank()) {
                topicChannelMap.computeIfAbsent(topic, k -> ConcurrentHashMap.newKeySet()).add(ctx.channel());
                System.out.println("当前已注册 topic: " + topicChannelMap.keySet());
            }

            // 聊天消息（只在 用户发送 时创建会话 + 入库）
            if ("CHAT".equals(dto.getType())) {
                if (chatService == null) return;

                Long targetUserId = null;

                // 1. 用户发消息
                if (fromUserId != null) {
                    targetUserId = fromUserId;
                }
                // 2. 客服发消息（从 topic 解析出用户ID：chat_2 → 2）
                else {
                    if (topic.startsWith("chat_")) {
                        String userIdStr = topic.replace("chat_", "");
                        targetUserId = Long.parseLong(userIdStr);
                    }
                }

                // 只要找到目标用户，就入库
                if (targetUserId != null) {
                    ChatSession session = chatService.getOrCreateSession(shopId, targetUserId);

//                    String userName = (String) request.getAttribute("username");
//                    order.setUserName(userName);


                    chatService.saveMessage(
                            session.getId(),
                            fromUserId,
                            content,
                            topic,
                            dto.getSenderType()
                    );

                    System.out.println("✅ 消息已入库：" + content);
                }
            }

            sendToTopic(topic , json);
            sendToTopic("shop_" + shopId, json);

        } catch (Exception e) {
            System.err.println("❌ 消息处理失败：" + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) {
        Channel channel = ctx.channel();
        userChannelMap.values().removeIf(c -> c == channel);
        topicChannelMap.forEach((k, channels) -> channels.removeIf(c -> c == channel));
        channelGroup.remove(channel);
        System.out.println("❌ 客户端断开：" + ctx.channel().id());
    }

    public static void sendToUser(Long userId, Object msg) {
        try {
            Channel channel = userChannelMap.get(userId);
            if (channel == null || !channel.isOpen()) {
                System.out.println("❌ 用户不在线：" + userId);
                return;
            }
            ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
            String json = mapper.writeValueAsString(msg);
            channel.writeAndFlush(new TextWebSocketFrame(json));
            System.out.println("✅ 推送给用户成功：" + userId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void sendToTopic(String topic, Object msg) {
        try {
            Set<Channel> channels = topicChannelMap.get(topic);

            if (channels == null || channels.isEmpty()) {
                System.out.println("❌ 无人订阅该 topic：" + topic);
                return;
            }

            ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
            String json = mapper.writeValueAsString(msg);

            for (Channel channel : channels) {
                if (channel.isOpen()) {
                    channel.writeAndFlush(new TextWebSocketFrame(json));
                    System.out.println("✅ 推送 topic 成功：" + topic + json);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void broadcast(Object msg) {
        try {
            ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
            String json = mapper.writeValueAsString(msg);
            channelGroup.writeAndFlush(new TextWebSocketFrame(json));
            System.out.println("✅ 全局广播成功");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}