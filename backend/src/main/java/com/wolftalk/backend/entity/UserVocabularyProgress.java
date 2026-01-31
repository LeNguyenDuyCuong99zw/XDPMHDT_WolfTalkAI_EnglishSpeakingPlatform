package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_vocabulary_progress", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "vocabulary_word_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVocabularyProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vocabulary_word_id", nullable = false)
    private VocabularyWord vocabularyWord;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LearningStatus status = LearningStatus.NEW;

    private Integer correctCount = 0;    // Số lần trả lời đúng
    private Integer attemptCount = 0;    // Tổng số lần làm
    private Integer masteryScore = 0;    // Điểm thành thạo (0-100)
    
    private LocalDateTime lastPracticed;
    private LocalDateTime nextReviewDate; // Spaced repetition
    private LocalDateTime learnedAt;      // Khi nào đã học xong
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = LearningStatus.NEW;
        }
    }

    public void recordAttempt(boolean isCorrect) {
        this.attemptCount++;
        if (isCorrect) {
            this.correctCount++;
        }
        this.lastPracticed = LocalDateTime.now();
        
        // Calculate mastery score
        if (attemptCount > 0) {
            this.masteryScore = (int) ((correctCount * 100.0) / attemptCount);
        }
        
        // Update status based on mastery
        updateStatus();
        
        // Calculate next review date (spaced repetition)
        calculateNextReview();
    }

    private void updateStatus() {
        if (correctCount >= 5 && masteryScore >= 80) {
            this.status = LearningStatus.MASTERED;
            if (this.learnedAt == null) {
                this.learnedAt = LocalDateTime.now();
            }
        } else if (correctCount >= 3 && masteryScore >= 60) {
            this.status = LearningStatus.FAMILIAR;
        } else if (attemptCount > 0) {
            this.status = LearningStatus.LEARNING;
        }
    }

    private void calculateNextReview() {
        // Simple spaced repetition: review intervals increase based on mastery
        int daysUntilReview;
        if (masteryScore >= 90) {
            daysUntilReview = 7;  // 1 week
        } else if (masteryScore >= 80) {
            daysUntilReview = 3;  // 3 days
        } else if (masteryScore >= 60) {
            daysUntilReview = 1;  // 1 day
        } else {
            daysUntilReview = 0;  // Review today/ASAP
        }
        this.nextReviewDate = LocalDateTime.now().plusDays(daysUntilReview);
    }

    public enum LearningStatus {
        NEW,        // Chưa học
        LEARNING,   // Đang học
        FAMILIAR,   // Quen thuộc
        MASTERED    // Thành thạo
    }
}
