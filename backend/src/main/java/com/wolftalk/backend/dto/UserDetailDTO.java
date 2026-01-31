package com.wolftalk.backend.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String roles;
    private String avatar;
    private String learningLanguage;
    private Boolean isEnabled;
    private Boolean hasCompletedPlacementTest;
    private Boolean isFirstLogin;
    private Instant createdAt;
    private Instant updatedAt;
}
