package com.wolftalk.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "learner_assessments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerAssessment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "learner_id", nullable = false)
    private Long learnerId;
    
    @Column(name = "assessment_id", nullable = false)
    private Long assessmentId;
    
    @Column(length = 50)
    private String status = "IN_PROGRESS"; // IN_PROGRESS, SUBMITTED, GRADED
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "time_spent_minutes")
    private Integer timeSpentMinutes;
    
    @Column(name = "total_score", precision = 5, scale = 2)
    private BigDecimal totalScore;
    
    @Column(name = "level_result", length = 50)
    private String levelResult; // A1, A2, B1, B2, C1, C2
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        startedAt = LocalDateTime.now();
    }
}
