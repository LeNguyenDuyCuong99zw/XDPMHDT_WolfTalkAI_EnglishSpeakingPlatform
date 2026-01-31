package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_weekly_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "challenge_type", "year", "week_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeWeeklyProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private Challenge.ChallengeType challengeType;

    private Integer year;
    private Integer weekNumber;

    private Integer totalAttempts; // Total challenges attempted
    private Integer correctAttempts; // Correct answers
    private Integer totalXP; // XP earned this week
    private Integer totalTime; // Total seconds spent

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (totalAttempts == null) totalAttempts = 0;
        if (correctAttempts == null) correctAttempts = 0;
        if (totalXP == null) totalXP = 0;
        if (totalTime == null) totalTime = 0;
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Get accuracy percentage
    public Double getAccuracyPercentage() {
        if (totalAttempts == 0) return 0.0;
        return (correctAttempts.doubleValue() / totalAttempts) * 100;
    }

    // Get average XP per attempt
    public Double getAverageXPPerAttempt() {
        if (totalAttempts == 0) return 0.0;
        return totalXP.doubleValue() / totalAttempts;
    }
}
