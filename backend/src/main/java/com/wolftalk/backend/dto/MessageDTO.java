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
public class MessageDTO {
    private Long id;

    @JsonProperty("sender_id")
    private Long senderId;

    @JsonProperty("sender_name")
    private String senderName;

    @JsonProperty("sender_avatar")
    private String senderAvatar;

    private String content;

    @JsonProperty("created_at")
    private Instant createdAt;

    @JsonProperty("is_deleted")
    private Boolean isDeleted;

    @JsonProperty("firebase_message_id")
    private String firebaseMessageId;
}
