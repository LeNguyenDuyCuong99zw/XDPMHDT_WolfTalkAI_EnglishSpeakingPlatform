package com.wolftalk.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.dto.ConversationDTO;
import com.wolftalk.backend.dto.MessageDTO;
import com.wolftalk.backend.entity.Conversation;
import com.wolftalk.backend.entity.Message;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.ConversationRepository;
import com.wolftalk.backend.repository.FriendshipRepository;
import com.wolftalk.backend.repository.MessageRepository;
import com.wolftalk.backend.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ChatService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Lấy hoặc tạo cuộc trò chuyện giữa 2 người
     */
    @Transactional
    public Conversation getOrCreateConversation(Long userId1, Long userId2) {
        // Validate input
        if (userId1 == null || userId1 <= 0) {
            throw new RuntimeException("Invalid userId1: " + userId1);
        }
        if (userId2 == null || userId2 <= 0) {
            throw new RuntimeException("Invalid userId2: " + userId2);
        }
        if (userId1.equals(userId2)) {
            throw new RuntimeException("Cannot create conversation with yourself");
        }

        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId1));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId2));

        // Tìm hoặc tạo cuộc trò chuyện
        Conversation existingConversation = conversationRepository.findConversation(user1, user2).orElse(null);
        if (existingConversation != null) {
            log.info("Found existing conversation {} between {} and {}", existingConversation.getId(), userId1, userId2);
            return existingConversation;
        }

        log.info("Creating new conversation between {} and {}", userId1, userId2);
        Conversation conversation = new Conversation();
        conversation.setUser1(user1);
        conversation.setUser2(user2);
        
        Instant now = Instant.now();
        conversation.setCreatedAt(now);
        conversation.setUpdatedAt(now);
        conversation.setIsArchived(false);
        
        Conversation savedConversation = conversationRepository.save(conversation);
        log.info("New conversation created with ID: {}", savedConversation.getId());
        
        return savedConversation;
    }

    /**
     * Gửi tin nhắn
     */
    @Transactional
    public MessageDTO sendMessage(Long conversationId, Long senderId, String content) {
        // Validate input
        if (conversationId == null || conversationId <= 0) {
            throw new RuntimeException("Invalid conversation ID");
        }
        if (senderId == null || senderId <= 0) {
            throw new RuntimeException("Invalid sender ID");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Message content cannot be empty");
        }
        
        String trimmedContent = content.trim();
        if (trimmedContent.length() > 5000) {
            throw new RuntimeException("Message content is too long (max 5000 characters)");
        }

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender user not found: " + senderId));

        // Kiểm tra xem sender có phải là người trong cuộc trò chuyện không
        if (!conversation.getUser1().getId().equals(senderId) &&
            !conversation.getUser2().getId().equals(senderId)) {
            log.warn("Unauthorized: User {} is not part of conversation {}", senderId, conversationId);
            throw new RuntimeException("User is not part of this conversation");
        }

        // Lưu tin nhắn vào database
        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(trimmedContent);
        message.setCreatedAt(Instant.now());
        message.setUpdatedAt(Instant.now());
        message.setIsDeleted(false);

        Message savedMessage = messageRepository.save(message);
        log.info("Message saved to database with ID: {} from sender: {}", savedMessage.getId(), senderId);

        // Cập nhật cuộc trò chuyện
        Instant now = Instant.now();
        conversation.setLastMessage(trimmedContent);
        conversation.setLastMessageSenderId(senderId);
        conversation.setLastMessageAt(now);
        conversation.setUpdatedAt(now);
        conversationRepository.save(conversation);
        log.info("Conversation {} updated with last message", conversationId);

        // Gửi tin nhắn qua WebSocket
        MessageDTO messageDTO = convertMessageToDTO(savedMessage, sender);
        String destination = "/topic/chat/conversation/" + conversationId;
        messagingTemplate.convertAndSend(destination, messageDTO);
        log.info("Message sent to WebSocket: {}", destination);

        return messageDTO;
    }

    /**
     * Lấy danh sách tin nhắn của một cuộc trò chuyện
     */
    public List<MessageDTO> getMessages(Long conversationId, int page) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Pageable pageable = PageRequest.of(page, 50);
        return messageRepository.findByConversationAndNotDeleted(conversation, pageable)
                .stream()
                .map(msg -> convertMessageToDTO(msg, msg.getSender()))
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách cuộc trò chuyện của người dùng
     */
    public List<ConversationDTO> getUserConversations(Long userId, int page) {
        if (userId == null || userId <= 0) {
            throw new RuntimeException("Invalid user ID: " + userId);
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (page < 0) {
            throw new RuntimeException("Invalid page number: " + page);
        }
        
        log.info("Getting conversations for user {} (page: {})", userId, page);
        Pageable pageable = PageRequest.of(page, 20);
        return conversationRepository.findUserConversations(user, pageable)
                .stream()
                .map(conv -> convertConversationToDTO(conv, user))
                .collect(Collectors.toList());
    }

    /**
     * Xóa tin nhắn (soft delete)
     */
    @Transactional
    public void deleteMessage(Long messageId) {
        if (messageId == null || messageId <= 0) {
            throw new RuntimeException("Invalid message ID: " + messageId);
        }
        
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));

        if (Boolean.TRUE.equals(message.getIsDeleted())) {
            log.warn("Message {} is already deleted", messageId);
            return;
        }

        message.setIsDeleted(true);
        message.setUpdatedAt(Instant.now());
        messageRepository.save(message);
        log.info("Message {} marked as deleted", messageId);

        // Gửi thông báo xóa qua WebSocket
        if (message.getConversation() != null) {
            String destination = "/topic/chat/conversation/" + message.getConversation().getId();
            messagingTemplate.convertAndSend(destination, Map.of(
                    "type", "DELETE_MESSAGE",
                    "messageId", messageId
            ));
        }
    }

    /**
     * Lưu trữ cuộc trò chuyện
     */
    @Transactional
    public void archiveConversation(Long conversationId) {
        if (conversationId == null || conversationId <= 0) {
            throw new RuntimeException("Invalid conversation ID: " + conversationId);
        }
        
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));

        if (Boolean.TRUE.equals(conversation.getIsArchived())) {
            log.warn("Conversation {} is already archived", conversationId);
            return;
        }

        conversation.setIsArchived(true);
        conversation.setUpdatedAt(Instant.now());
        conversationRepository.save(conversation);
        log.info("Conversation {} archived", conversationId);
    }

    /**
     * Bỏ lưu trữ cuộc trò chuyện
     */
    @Transactional
    public void unarchiveConversation(Long conversationId) {
        if (conversationId == null || conversationId <= 0) {
            throw new RuntimeException("Invalid conversation ID: " + conversationId);
        }
        
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));

        if (Boolean.FALSE.equals(conversation.getIsArchived())) {
            log.warn("Conversation {} is already unarchived", conversationId);
            return;
        }

        conversation.setIsArchived(false);
        conversation.setUpdatedAt(Instant.now());
        conversationRepository.save(conversation);
        log.info("Conversation {} unarchived", conversationId);
    }

    /**
     * Lấy hoặc tạo cuộc trò chuyện bằng email
     */
    @Transactional
    public Conversation getOrCreateConversationByEmail(String email1, String email2) {
        // Validate input
        if (email1 == null || email1.trim().isEmpty()) {
            throw new RuntimeException("Invalid email1: " + email1);
        }
        if (email2 == null || email2.trim().isEmpty()) {
            throw new RuntimeException("Invalid email2: " + email2);
        }
        if (email1.equalsIgnoreCase(email2)) {
            throw new RuntimeException("Cannot create conversation with yourself");
        }

        User user1 = userRepository.findByEmailIgnoreCase(email1)
                .orElseThrow(() -> new RuntimeException("User not found: " + email1));
        User user2 = userRepository.findByEmailIgnoreCase(email2)
                .orElseThrow(() -> new RuntimeException("User not found: " + email2));

        // Tìm hoặc tạo cuộc trò chuyện
        Conversation existingConversation = conversationRepository.findConversation(user1, user2).orElse(null);
        if (existingConversation != null) {
            log.info("Found existing conversation {} between {} and {}", existingConversation.getId(), email1, email2);
            return existingConversation;
        }

        log.info("Creating new conversation between {} and {}", email1, email2);
        Conversation conversation = new Conversation();
        conversation.setUser1(user1);
        conversation.setUser2(user2);
        
        Instant now = Instant.now();
        conversation.setCreatedAt(now);
        conversation.setUpdatedAt(now);
        conversation.setIsArchived(false);
        
        Conversation savedConversation = conversationRepository.save(conversation);
        log.info("New conversation created with ID: {}", savedConversation.getId());
        
        return savedConversation;
    }

    /**
     * Gửi tin nhắn bằng email người gửi
     */
    @Transactional
    public MessageDTO sendMessageByEmail(Long conversationId, String senderEmail, String content) {
        // Validate input
        if (conversationId == null || conversationId <= 0) {
            throw new RuntimeException("Invalid conversation ID");
        }
        if (senderEmail == null || senderEmail.trim().isEmpty()) {
            throw new RuntimeException("Invalid sender email");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Message content cannot be empty");
        }
        
        String trimmedContent = content.trim();
        if (trimmedContent.length() > 5000) {
            throw new RuntimeException("Message content is too long (max 5000 characters)");
        }

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));

        User sender = userRepository.findByEmailIgnoreCase(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender user not found: " + senderEmail));

        // Kiểm tra xem sender có phải là người trong cuộc trò chuyện không
        if (!conversation.getUser1().getId().equals(sender.getId()) &&
            !conversation.getUser2().getId().equals(sender.getId())) {
            log.warn("Unauthorized: User {} is not part of conversation {}", senderEmail, conversationId);
            throw new RuntimeException("User is not part of this conversation");
        }

        // Lưu tin nhắn vào database
        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(trimmedContent);
        message.setCreatedAt(Instant.now());
        message.setUpdatedAt(Instant.now());
        message.setIsDeleted(false);

        Message savedMessage = messageRepository.save(message);
        log.info("Message saved to database with ID: {} from sender: {}", savedMessage.getId(), senderEmail);

        // Cập nhật cuộc trò chuyện
        Instant now = Instant.now();
        conversation.setLastMessage(trimmedContent);
        conversation.setLastMessageSenderId(sender.getId());
        conversation.setLastMessageAt(now);
        conversation.setUpdatedAt(now);
        conversationRepository.save(conversation);
        log.info("Conversation {} updated with last message", conversationId);

        // Gửi tin nhắn qua WebSocket
        MessageDTO messageDTO = convertMessageToDTO(savedMessage, sender);
        String destination = "/topic/chat/conversation/" + conversationId;
        messagingTemplate.convertAndSend(destination, messageDTO);
        log.info("Message sent to WebSocket: {}", destination);

        return messageDTO;
    }

    /**
     * Lấy danh sách cuộc trò chuyện của người dùng bằng email
     */
    public List<ConversationDTO> getUserConversationsByEmail(String userEmail, int page) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new RuntimeException("Invalid user email: " + userEmail);
        }
        
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        if (page < 0) {
            throw new RuntimeException("Invalid page number: " + page);
        }
        
        log.info("Getting conversations for user {} (page: {})", userEmail, page);
        Pageable pageable = PageRequest.of(page, 20);
        return conversationRepository.findUserConversations(user, pageable)
                .stream()
                .map(conv -> convertConversationToDTO(conv, user))
                .collect(Collectors.toList());
    }

    private MessageDTO convertMessageToDTO(Message message, User sender) {
        return MessageDTO.builder()
                .id(message.getId())
                .senderId(sender.getId())
                .senderName(sender.getFirstName() + " " + sender.getLastName())
                .senderAvatar(sender.getAvatar())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .isDeleted(message.getIsDeleted())
                .build();
    }

    private ConversationDTO convertConversationToDTO(Conversation conversation, User currentUser) {
        User otherUser = conversation.getUser1().getId().equals(currentUser.getId())
                ? conversation.getUser2()
                : conversation.getUser1();

        return ConversationDTO.builder()
                .id(conversation.getId())
                .user1Id(conversation.getUser1().getId())
                .user1Name(conversation.getUser1().getFirstName() + " " + conversation.getUser1().getLastName())
                .user1Avatar(conversation.getUser1().getAvatar())
                .user2Id(conversation.getUser2().getId())
                .user2Name(conversation.getUser2().getFirstName() + " " + conversation.getUser2().getLastName())
                .user2Avatar(conversation.getUser2().getAvatar())
                .otherUserId(otherUser.getId())
                .otherUserName(otherUser.getFirstName() + " " + otherUser.getLastName())
                .otherUserAvatar(otherUser.getAvatar())
                .lastMessage(conversation.getLastMessage())
                .lastMessageSenderId(conversation.getLastMessageSenderId())
                .lastMessageAt(conversation.getLastMessageAt())
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .build();
    }
}
