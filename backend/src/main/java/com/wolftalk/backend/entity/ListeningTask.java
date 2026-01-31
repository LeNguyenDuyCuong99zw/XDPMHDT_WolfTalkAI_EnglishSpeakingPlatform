package com.wolftalk.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "listening_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListeningTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer targetPoints; // Điểm mục tiêu cần đạt

    @Column(name = "reward_points", nullable = false)
    private Integer rewardPoints = 0; // Điểm thưởng

    @Column(name = "reward_description")
    private String rewardDescription; // Mô tả phần thưởng

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "task_type") // "daily", "weekly", "milestone"
    private String taskType = "daily";

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
