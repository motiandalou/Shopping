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
    // 在线状态
    private static final Map<Long, Boolean> userOnlineMap = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    private static ChatService chatService;

    public static final Long SHOP_ID = 1L;

    public static void setChatService(ChatService service) {
        chatService = service;
    }

    // ===================== 客户端连接 =====================
    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        channelGroup.add(ctx.channel());
        System.out.println("✅ 新客户端连接：" + ctx.channel().id());
    }

    // ===================== 客户端断开 =====================
    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) {
        Channel channel = ctx.channel();

        // 找到断开连接的用户
        Long offlineUserId = null;
        for (Map.Entry<Long, Channel> entry : userChannelMap.entrySet()) {
            if (entry.getValue() == channel) {
                offlineUserId = entry.getKey();
                break;
            }
        }

        // 用户离线
        if (offlineUserId != null) {
            userChannelMap.remove(offlineUserId);
            userOnlineMap.put(offlineUserId, false);
            broadcastUserStatus(offlineUserId, false); // 广播离线
            System.out.println("❌ 用户离线：" + offlineUserId);
        }

        topicChannelMap.forEach((k, channels) -> channels.removeIf(c -> c == channel));
        channelGroup.remove(channel);
        System.out.println("❌ 客户端断开：" + ctx.channel().id());
    }

    // ===================== 消息处理 =====================
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame frame) throws Exception {
        try {
            String json = frame.text();
            GatewayMessageDTO dto = objectMapper.readValue(json, GatewayMessageDTO.class);

            Long fromUserId = dto.getFromUserId();
            String topic = dto.getTopic();
            String content = dto.getContent();
            Long shopId = dto.getShopId() == null ? 1L : dto.getShopId();

            // ========== 用户绑定 + 上线标记 ==========
            if (fromUserId != null) {
                userChannelMap.put(fromUserId, ctx.channel());
                userOnlineMap.put(fromUserId, true);  // 标记在线
                broadcastUserStatus(fromUserId, true); // 广播上线
            }
            // 绑定 topic
            if (topic != null && !topic.isBlank()) {
                topicChannelMap.computeIfAbsent(topic, k -> ConcurrentHashMap.newKeySet()).add(ctx.channel());
                System.out.println("当前已注册 topic: " + topicChannelMap.keySet());
            }

            // 聊天消息入库
            if ("CHAT".equals(dto.getType())) {
                if (chatService == null) return;

                Long targetUserId = null;

                if (fromUserId != null) {
                    targetUserId = fromUserId;
                } else {
                    if (topic.startsWith("chat_")) {
                        String userIdStr = topic.replace("chat_", "");
                        targetUserId = Long.parseLong(userIdStr);
                    }
                }

                if (targetUserId != null) {
                    ChatSession session = chatService.getOrCreateSession(shopId, targetUserId);
                    chatService.saveMessage(
                            session.getId(),
                            fromUserId,
                            content,
                            topic,
                            dto.getSenderType()
                    );
                }
            }

            // 发送消息
            sendToTopic(topic, json);

            // 推送给店铺
            GatewayMessageDTO shopMsg = new GatewayMessageDTO();
            shopMsg.setTopic("shop_" + shopId);
            shopMsg.setType(dto.getType());
            shopMsg.setFromUserId(dto.getFromUserId());
            shopMsg.setShopId(dto.getShopId());
            shopMsg.setGoodsId(dto.getGoodsId());
            shopMsg.setSenderType(dto.getSenderType());
            shopMsg.setContent(dto.getContent());
            String shopJson = objectMapper.writeValueAsString(shopMsg);
            sendToTopic("shop_" + shopId, shopJson);

        } catch (Exception e) {
            System.err.println("❌ 消息处理失败：" + e.getMessage());
            e.printStackTrace();
        }
    }

    // ===================== 广播用户在线/离线状态 =====================
    private void broadcastUserStatus(Long userId, boolean isOnline) {
        try {
            GatewayMessageDTO dto = new GatewayMessageDTO();
            dto.setTopic("shop_" + SHOP_ID);
            dto.setType("USER_STATUS");
            dto.setFromUserId(userId);
            dto.setContent(isOnline ? "online" : "offline");

            String json = objectMapper.writeValueAsString(dto);
            sendToTopic("shop_" + SHOP_ID, json);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ===================== 工具方法 =====================
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

    // 【新增】给前端提供获取所有用户在线状态的方法
    public static Map<Long, Boolean> getAllUserOnlineStatus() {
        return new ConcurrentHashMap<>(userOnlineMap);
    }
}