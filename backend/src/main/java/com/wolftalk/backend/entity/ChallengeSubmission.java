package com.wolftalk.backend.entity;

import java.time.LocalDateTime;

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
@Table(name = "challenge_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    private String userAnswer; // Text answer or selected option index
    private Boolean isCorrect; // true if answer is correct
    private Integer timeSpent; // Seconds taken to answer
    private Integer xpEarned; // XP points awarded

    // Metadata
    private Integer accuracy; // 0-100% for scoring
    private Boolean firstAttempt; // true if first try

    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        createdAt = LocalDateTime.now();
    }

    // Calculate XP based on challenge parameters
    public void calculateXP() {
        int level = challenge.getLevel() != null ? challenge.getLevel() : 1;
        int baseXP = level * 10; // 10-50 base XP
        int bonus = 0;

        // Correctness bonus
        if (Boolean.TRUE.equals(isCorrect)) {
            bonus += 10; // Correct answer bonus
        } else if (accuracy != null && accuracy >= 50) {
            bonus += 5; // Partial credit
        }

        // Speed bonus (answered in less than 15 seconds)
        if (timeSpent != null && timeSpent < 15) {
            bonus += 5;
        }

        // First attempt bonus
        if (Boolean.TRUE.equals(firstAttempt)) {
            bonus += 5;
        }

        this.xpEarned = Math.min(baseXP + bonus, 50); // Max 50 XP
    }
}
