package com.wolftalk.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "learning_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "current_level")
    private String currentLevel; // Beginner, Intermediate, Advanced

    @Column(name = "target_level")
    private String targetLevel;

    @Column(name = "study_hours_per_week")
    private Integer studyHoursPerWeek;

    @Column(name = "preferred_learning_style")
    private String preferredLearningStyle; // Visual, Auditory, Kinesthetic, Reading/Writing

    @Column(name = "learning_purpose")
    private String learningPurpose; // Business, Travel, Academic, Daily Life

    @Column(name = "speaking_confidence")
    private Integer speakingConfidence; // 1-10 scale

    @Column(name = "pronunciation_score")
    private Double pronunciationScore;

    @Column(name = "grammar_score")
    private Double grammarScore;

    @Column(name = "vocabulary_score")
    private Double vocabularyScore;

    @Column(name = "fluency_score")
    private Double fluencyScore;

    @Column(name = "bio", length = 500)
    private String bio;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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
}
