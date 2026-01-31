package com.wolftalk.backend.dto;

import java.time.Instant;

import com.wolftalk.backend.entity.Friendship.FriendshipStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipDTO {
    private Long id;
    private Long requesterId;
    private String requesterName;
    private String requesterAvatar;
    private Long receiverId;
    private String receiverName;
    private String receiverAvatar;
    private FriendshipStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
