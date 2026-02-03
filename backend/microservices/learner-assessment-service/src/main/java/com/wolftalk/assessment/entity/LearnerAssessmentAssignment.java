package com.wolftalk.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "learner_assessment_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerAssessmentAssignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "learner_id", nullable = false)
    private Long learnerId;
    
    @Column(name = "assessment_id", nullable = false)
    private Long assessmentId;
    
    @Column(name = "assigned_by")
    private Long assignedBy; // mentor_id
    
    @Column(name = "assigned_at", nullable = false, updatable = false)
    private LocalDateTime assignedAt;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(length = 50)
    private String status = "ASSIGNED"; // ASSIGNED, IN_PROGRESS, SUBMITTED, GRADED
    
    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
    }
}
