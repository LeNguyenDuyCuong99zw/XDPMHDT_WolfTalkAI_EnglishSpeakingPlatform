package com.wolftalk.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDTO {
    private Long id;

    @JsonProperty("user_1_id")
    private Long user1Id;

    @JsonProperty("user_1_name")
    private String user1Name;

    @JsonProperty("user_1_avatar")
    private String user1Avatar;

    @JsonProperty("user_2_id")
    private Long user2Id;

    @JsonProperty("user_2_name")
    private String user2Name;

    @JsonProperty("user_2_avatar")
    private String user2Avatar;

    @JsonProperty("other_user_id")
    private Long otherUserId; // ID của người kia

    @JsonProperty("other_user_name")
    private String otherUserName;

    @JsonProperty("other_user_avatar")
    private String otherUserAvatar;

    @JsonProperty("last_message")
    private String lastMessage;

    @JsonProperty("last_message_sender_id")
    private Long lastMessageSenderId;

    @JsonProperty("last_message_at")
    private Instant lastMessageAt;

    @JsonProperty("firebase_room_id")
    private String firebaseRoomId;

    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonProperty("updated_at")
    private Instant updatedAt;
}
