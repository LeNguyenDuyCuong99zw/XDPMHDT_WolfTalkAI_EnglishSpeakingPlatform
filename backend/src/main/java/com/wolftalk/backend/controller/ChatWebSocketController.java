package com.wolftalk.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.wolftalk.backend.dto.MessageDTO;
import com.wolftalk.backend.service.ChatService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class ChatWebSocketController {

    @Autowired
    private ChatService chatService;

    /**
     * Xử lý tin nhắn từ client qua WebSocket
     * Client gửi đến: /app/chat/{conversationId}
     * Server broadcast đến: /topic/chat/conversation/{conversationId}
     */
    @MessageMapping("/chat/{conversationId}")
    public void handleChatMessage(
            @DestinationVariable Long conversationId,
            @Payload ChatMessageRequest message,
            SimpMessageHeaderAccessor headerAccessor) {
        
        try {
            // Lấy userId từ session
            Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
            
            if (userId == null) {
                log.warn("User ID not found in session");
                return;
            }
            
            log.info("Received message for conversation {} from user {}", conversationId, userId);
            
            // Gửi tin nhắn qua service (service sẽ broadcast qua WebSocket)
            chatService.sendMessage(conversationId, userId, message.getContent());
            
        } catch (Exception e) {
            log.error("Error handling chat message: {}", e.getMessage(), e);
        }
    }

    /**
     * DTO để nhận tin nhắn từ client
     */
    public static class ChatMessageRequest {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
