package com.example.shopping.websocket;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ServerEndpoint("/websocket/{userId}")
public class WebSocketServer {

    private static final ConcurrentHashMap<String, Session> SESSION_POOL = new ConcurrentHashMap<>();
    private String userId;
    private Session session;

    @OnOpen
    public void onOpen(Session session, @PathParam("userId") String userId) {
        this.session = session;
        this.userId = userId;
        SESSION_POOL.put(userId, session);
        System.out.println("✅ 用户连接：" + userId + " 在线人数：" + SESSION_POOL.size());
    }

    @OnClose
    public void onClose() {
        SESSION_POOL.remove(userId);
        System.out.println("❌ 用户断开：" + userId + " 在线人数：" + SESSION_POOL.size());
    }

    @OnMessage
    public void onMessage(String message) {
        System.out.println("📩 收到 " + userId + " 消息：" + message);
    }

    @OnError
    public void onError(Throwable error) {
        // 不打印，避免刷屏
    }

    // ==========================================
    // 给前端推送消息（你业务里直接调用）
    // ==========================================
    public static void pushToUser(String userId, String message) {
        try {
            Session session = SESSION_POOL.get(userId);
            if (session != null && session.isOpen()) {
                session.getBasicRemote().sendText(message);
            }
        } catch (Exception ignored) {}
    }

    public static void broadcast(String message) {
        for (Session session : SESSION_POOL.values()) {
            try {
                if (session.isOpen()) session.getBasicRemote().sendText(message);
            } catch (Exception ignored) {}
        }
    }

    public static int getOnlineCount() {
        return SESSION_POOL.size();
    }
}