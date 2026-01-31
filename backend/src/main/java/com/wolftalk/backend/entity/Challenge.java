package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "challenges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ChallengeType type; // LISTENING, SPEAKING, READING, WRITING, VOCABULARY, GRAMMAR

    private String title;
    private String description;
    private String content;
    private String audioUrl; // For listening/speaking
    private String imageUrl; // For reading/writing

    @Column(name = "level")
    private Integer level; // 1-5 (EASY to EXPERT)

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> options; // For multiple choice questions - stored as JSONB

    private Integer correctOptionIndex; // Index of correct answer
    private Integer timeLimit; // Seconds

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ChallengeType {
        LISTENING, SPEAKING, READING, WRITING, VOCABULARY, GRAMMAR
    }

    /**
     * Get ChallengeLevel from integer level
     */
    public ChallengeLevel getChallengeLevel() {
        if (level == null) return ChallengeLevel.EASY;
        return switch (level) {
            case 1 -> ChallengeLevel.EASY;
            case 2 -> ChallengeLevel.NORMAL;
            case 3 -> ChallengeLevel.MEDIUM;
            case 4 -> ChallengeLevel.HARD;
            case 5 -> ChallengeLevel.EXPERT;
            default -> ChallengeLevel.EASY;
        };
    }

    public enum ChallengeLevel {
        EASY(1), NORMAL(2), MEDIUM(3), HARD(4), EXPERT(5);

        private final int value;

        ChallengeLevel(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }
}
