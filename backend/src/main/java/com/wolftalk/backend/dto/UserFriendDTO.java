package com.wolftalk.backend.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFriendDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String avatar;
    private String learningLanguage;
    private Integer points;
    private Integer streak;
    private Instant lastActiveDate;
}
