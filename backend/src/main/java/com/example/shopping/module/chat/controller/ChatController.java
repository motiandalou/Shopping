package com.example.shopping.module.chat.controller;

import com.example.shopping.common.result.Result;
import com.example.shopping.gateway.handler.GatewayMessageHandler;
import com.example.shopping.module.chat.entity.ChatMessage;
import com.example.shopping.module.chat.service.ChatService;
import com.example.shopping.module.chat.vo.ChatSessionVO;
import com.example.shopping.module.log.annotation.Log;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@Tag(name = "在线客服聊天", description = "客服会话、聊天记录、未读消息、在线状态接口")
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * 获取店铺的所有会话列表（后台客服页）
     * @param shopId 店铺ID，默认1
     */
    @GetMapping("/sessions")
    @Operation(summary = "获取店铺客服会话列表", description = "后台客服查看当前店铺的所有用户聊天会话")
    public Result<List<ChatSessionVO>> getSessions(
            @Parameter(description = "店铺ID", example = "1") @RequestParam(defaultValue = "1") Long shopId) {
        return Result.success(chatService.getSessionListByShopId(shopId));
    }

    /**
     * 获取会话的聊天记录
     */
    @Log(module = "聊天管理", operation = "查看聊天记录")
    @GetMapping("/messages")
    @Operation(summary = "获取会话聊天记录", description = "根据会话ID查询历史聊天消息")
    public Result<List<ChatMessage>> getMessages(
            @Parameter(description = "会话ID", required = true, example = "1001") @RequestParam Long sessionId) {
        List<ChatMessage> list = chatService.getMessageListBySessionId(sessionId);
        return Result.success(list);
    }


    /**
     * 清空未读
     */
    @Log(module = "聊天管理", operation = "清空未读消息")
    @GetMapping("/clearUnread")
    @Operation(summary = "清空会话未读消息", description = "将指定会话的未读消息数置为0")
    public Result clearUnread(
            @Parameter(description = "会话ID", required = true, example = "1001") @RequestParam Long sessionId) {
        chatService.clearUnreadCount(sessionId);
        return Result.success();
    }

    @GetMapping("/user/status")
    @Operation(summary = "获取用户在线状态", description = "查看所有用户的在线/离线状态")
    public Map<Long, Boolean> getUserOnlineStatus() {
        return GatewayMessageHandler.getAllUserOnlineStatus();
    }
}