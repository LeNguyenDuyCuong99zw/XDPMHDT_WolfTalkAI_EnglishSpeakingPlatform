package com.wolftalk.microservices.ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pronunciation_assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PronunciationAssessment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "audio_url", length = 500)
    private String audioUrl;
    
    @Column(name = "transcript", columnDefinition = "TEXT")
    private String transcript;
    
    @Column(name = "expected_text", columnDefinition = "TEXT")
    private String expectedText;
    
    @Column(name = "accuracy_score", precision = 5, scale = 2)
    private BigDecimal accuracyScore;
    
    @Column(name = "fluency_score", precision = 5, scale = 2)
    private BigDecimal fluencyScore;
    
    @Column(name = "pronunciation_score", precision = 5, scale = 2)
    private BigDecimal pronunciationScore;
    
    @Column(name = "feedback", columnDefinition = "jsonb")
    private String feedback;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
