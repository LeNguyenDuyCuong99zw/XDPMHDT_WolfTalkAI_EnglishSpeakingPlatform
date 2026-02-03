package com.wolftalk.authservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = true)
    private String password;
    private String provider;
    private String providerId;
    private String firstName;
    private String lastName;
    private String roles;
    private String avatar;
    private String learningLanguage;
    private Boolean hasCompletedPlacementTest = false;
    private Boolean isFirstLogin = true;
    private Boolean isEnabled = true;
    private Instant createdAt = Instant.now();
    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
    private Integer streak = 0;
}
