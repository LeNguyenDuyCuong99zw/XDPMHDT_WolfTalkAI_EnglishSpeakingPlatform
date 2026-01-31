package com.wolftalk.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wolftalk.backend.dto.ConversationDTO;
import com.wolftalk.backend.dto.MessageDTO;
import com.wolftalk.backend.dto.SendMessageRequest;
import com.wolftalk.backend.entity.Conversation;
import com.wolftalk.backend.service.ChatService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * Lấy hoặc tạo cuộc trò chuyện với một người dùng cụ thể
     * POST /api/chat/start/{userEmail}
     */
    @PostMapping("/start/{userEmail}")
    public ResponseEntity<?> startConversation(@PathVariable String userEmail, Authentication auth) {
        try {
            // Check if user is authenticated
            if (auth == null || !auth.isAuthenticated()) {
                log.error("User is not authenticated");
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized"));
            }
            
            // Extract user email from JWT token (subject contains email)
            String currentUserEmail = auth.getName();
            
            if (currentUserEmail == null || currentUserEmail.isEmpty()) {
                log.error("No email found in JWT token");
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid authentication"));
            }
            
            // Validate that userEmail is valid
            if (userEmail == null || userEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid user email"));
            }
            
            // Prevent user from starting conversation with themselves
            if (currentUserEmail.equalsIgnoreCase(userEmail)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Cannot start conversation with yourself"));
            }
            
            log.info("Starting conversation between {} and {}", currentUserEmail, userEmail);
            
            Conversation conversation = chatService.getOrCreateConversationByEmail(currentUserEmail, userEmail);
            
            // Build full conversation response with user details
            Map<String, Object> response = new HashMap<>();
            response.put("id", conversation.getId());
            response.put("user1_id", conversation.getUser1().getId());
            
            // Build user1 map
            Map<String, Object> user1Map = new HashMap<>();
            user1Map.put("id", conversation.getUser1().getId());
            user1Map.put("firstName", conversation.getUser1().getFirstName());
            user1Map.put("lastName", conversation.getUser1().getLastName());
            user1Map.put("avatar", conversation.getUser1().getAvatar());
            response.put("user1", user1Map);
            
            response.put("user2_id", conversation.getUser2().getId());
            
            // Build user2 map
            Map<String, Object> user2Map = new HashMap<>();
            user2Map.put("id", conversation.getUser2().getId());
            user2Map.put("firstName", conversation.getUser2().getFirstName());
            user2Map.put("lastName", conversation.getUser2().getLastName());
            user2Map.put("avatar", conversation.getUser2().getAvatar());
            response.put("user2", user2Map);
            
            response.put("last_message", conversation.getLastMessage());
            response.put("last_message_at", conversation.getLastMessageAt());
            response.put("is_archived", conversation.getIsArchived());
            response.put("created_at", conversation.getCreatedAt());
            response.put("updated_at", conversation.getUpdatedAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error starting conversation", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Gửi tin nhắn
     * POST /api/chat/send
     * Body: { "conversation_id": 1, "content": "Hello" }
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request, Authentication auth) {
        try {
            // Validate request
            if (request == null || request.getConversationId() == null || request.getContent() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Missing required fields: conversation_id and content"));
            }
            
            String senderEmail = auth.getName();
            log.info("Sending message from {} to conversation {}", senderEmail, request.getConversationId());
            
            MessageDTO message = chatService.sendMessageByEmail(
                    request.getConversationId(),
                    senderEmail,
                    request.getContent()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", message);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Validation error sending message: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * Lấy danh sách tin nhắn của cuộc trò chuyện
     * GET /api/chat/messages/1?page=0
     */
    @GetMapping("/messages/{conversationId}")
    public ResponseEntity<?> getMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page) {
        try {
            if (conversationId == null || conversationId <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid conversation ID"));
            }
            
            log.info("Getting messages for conversation {} (page: {})", conversationId, page);
            
            List<MessageDTO> messages = chatService.getMessages(conversationId, page);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messages", messages);
            response.put("count", messages.size());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Validation error getting messages: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error getting messages: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Internal server error"));
        }
    }

    /**
     * Lấy danh sách cuộc trò chuyện của người dùng hiện tại
     * GET /api/chat/conversations?page=0
     */
    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(
            @RequestParam(defaultValue = "0") int page,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            log.info("Getting conversations for user {} (page: {})", userEmail, page);
            
            List<ConversationDTO> conversations = chatService.getUserConversationsByEmail(userEmail, page);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("conversations", conversations);
            response.put("count", conversations.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting conversations: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Xóa tin nhắn
     * DELETE /api/chat/message/1
     */
    @DeleteMapping("/message/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long messageId) {
        try {
            log.info("Deleting message {}", messageId);
            
            chatService.deleteMessage(messageId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Message deleted successfully"
            ));
        } catch (Exception e) {
            log.error("Error deleting message: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Lưu trữ cuộc trò chuyện
     * PUT /api/chat/conversation/1/archive
     */
    @PutMapping("/conversation/{conversationId}/archive")
    public ResponseEntity<?> archiveConversation(@PathVariable Long conversationId) {
        try {
            log.info("Archiving conversation {}", conversationId);
            
            chatService.archiveConversation(conversationId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Conversation archived successfully"
            ));
        } catch (Exception e) {
            log.error("Error archiving conversation: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Bỏ lưu trữ cuộc trò chuyện
     * PUT /api/chat/conversation/1/unarchive
     */
    @PutMapping("/conversation/{conversationId}/unarchive")
    public ResponseEntity<?> unarchiveConversation(@PathVariable Long conversationId) {
        try {
            log.info("Unarchiving conversation {}", conversationId);
            
            chatService.unarchiveConversation(conversationId);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Conversation unarchived successfully"
            ));
        } catch (Exception e) {
            log.error("Error unarchiving conversation: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
