package com.wolftalk.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "assessment_id", nullable = false)
    private Long assessmentId;
    
    @Column(nullable = false, length = 50)
    private String section; // MULTIPLE_CHOICE, READING, SPEAKING, WRITING
    
    @Column(name = "question_type", length = 50)
    private String questionType; // SINGLE_CHOICE, MULTI_CHOICE, ESSAY, VIDEO
    
    @Column(name = "question_text", nullable = false, length = 2000)
    private String questionText;
    
    @Column(name = "reading_passage", length = 5000)
    private String readingPassage; // Cho phần đọc hiểu
    
    @Column(name = "correct_answer", length = 500)
    private String correctAnswer; // JSON array cho trắc nghiệm
    
    private Integer points = 1;
    
    @Column(name = "order_index")
    private Integer orderIndex;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
