package com.wolftalk.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "learner_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "learner_assessment_id", nullable = false)
    private Long learnerAssessmentId;
    
    @Column(name = "question_id", nullable = false)
    private Long questionId;
    
    @Column(name = "answer_text", length = 5000)
    private String answerText; // JSON cho trắc nghiệm, text cho viết
    
    @Column(name = "video_url", length = 500)
    private String videoUrl; // Cho phần nói
    
    @Column(name = "audio_url", length = 500)
    private String audioUrl;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal score;
    
    @Column(length = 2000)
    private String feedback; // Feedback từ mentor hoặc AI
    
    @Column(name = "created_at", nullable = false, updatable = false)
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
