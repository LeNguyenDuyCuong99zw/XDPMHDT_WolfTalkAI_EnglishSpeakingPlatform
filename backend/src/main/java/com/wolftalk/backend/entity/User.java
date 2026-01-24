package com.wolftalk.backend.entity;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private String provider; // google, facebook, local

    private String providerId;

    private String firstName;

    private String lastName;

    private String roles; // comma separated roles

    private String avatar; // link ảnh đại diện

    private String learningLanguage; // en, ja, zh

    private Boolean hasCompletedPlacementTest = false;

    private Boolean isFirstLogin = true;

    private Boolean isEnabled = true; // Để quản lý bật/tắt tài khoản

    private Instant createdAt = Instant.now();

<<<<<<< HEAD
    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
=======
    // Gamification
    private Integer streak = 0;

    private Instant lastActiveDate;

    private Integer points = 0;

    private Integer todayLearningMinutes = 0;

    private LocalDate lastLearningDate;
>>>>>>> cc38da3 (sửa database , login , thêm thời gian thực dashboard)

}
