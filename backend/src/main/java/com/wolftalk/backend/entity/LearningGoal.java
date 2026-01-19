package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_goals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "goal_type", nullable = false)
    private String goalType; // DAILY, WEEKLY, MONTHLY, CUSTOM

    @Column(name = "goal_category", nullable = false)
    private String goalCategory; // SPEAKING_TIME, VOCABULARY, PRONUNCIATION, FLUENCY, LESSONS

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "target_value", nullable = false)
    private Integer targetValue;

    @Column(name = "current_value")
    private Integer currentValue = 0;

    @Column(name = "unit")
    private String unit; // minutes, words, lessons, sessions

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "status")
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, ABANDONED

    @Column(name = "priority")
    private Integer priority = 1; // 1-5

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (startDate == null) {
            startDate = LocalDate.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (currentValue >= targetValue && !isCompleted) {
            isCompleted = true;
            status = "COMPLETED";
            completedAt = LocalDateTime.now();
        }
    }
}
