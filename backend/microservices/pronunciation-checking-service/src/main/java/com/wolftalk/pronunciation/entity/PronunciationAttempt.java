package com.wolftalk.pronunciation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "pronunciation_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PronunciationAttempt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "expected_text", nullable = false, columnDefinition = "TEXT")
    private String expectedText;
    
    @Column(name = "transcript", columnDefinition = "TEXT")
    private String transcript;
    
    @Column(name = "accuracy_score")
    private Double accuracyScore;
    
    @Column(name = "pronunciation_score")
    private Double pronunciationScore;
    
    @Column(name = "overall_score")
    private Double overallScore;
    
    @Column(name = "level")
    private String level;
    
    @Column(name = "word_feedback_json", columnDefinition = "TEXT")
    private String wordFeedbackJson;
    
    @Column(name = "suggestions_json", columnDefinition = "TEXT")
    private String suggestionsJson;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
