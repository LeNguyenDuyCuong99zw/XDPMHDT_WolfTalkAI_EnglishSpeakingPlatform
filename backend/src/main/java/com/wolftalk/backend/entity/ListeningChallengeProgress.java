package com.wolftalk.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "listening_challenge_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListeningChallengeProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private ListeningChallenge challenge;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(nullable = false)
    private Integer attempts = 0;

    @Column(nullable = false)
    private Integer correctAttempts = 0;

    @Column(nullable = false)
    private Integer pointsEarned = 0;

    // Streak tracking
    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0;

    @Column(name = "max_streak", nullable = false)
    private Integer maxStreak = 0;

    @Column(name = "last_completed_date")
    private LocalDate lastCompletedDate;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "user_answer")
    private String userAnswer;

    @PrePersist
    protected void onCreate() {
        startedAt = LocalDateTime.now();
    }
}
