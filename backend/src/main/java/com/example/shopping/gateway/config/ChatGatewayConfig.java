package com.example.shopping.gateway.config;

import com.example.shopping.gateway.gateway.ChatGatewayServer;
import com.example.shopping.gateway.handler.GatewayMessageHandler;
import com.example.shopping.module.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class ChatGatewayConfig {

    @Autowired
    private ChatService chatService;

    @PostConstruct
    public void init() {
        // 注入 ChatService 到静态 Handler
        GatewayMessageHandler.setChatService(chatService);

        // Netty 放到守护线程里异步启动，不阻塞 Spring 主线程
        new Thread(() -> {
            new ChatGatewayServer().start(8888);
        }, "netty-gateway-thread").start();
    }
}