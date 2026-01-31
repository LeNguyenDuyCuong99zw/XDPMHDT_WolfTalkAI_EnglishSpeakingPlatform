package com.wolftalk.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User Quest Progress - Tiến độ nhiệm vụ của người dùng
 * 
 * Theo dõi tiến độ cho cả Daily Quest và Monthly Challenge
 */
@Entity
@Table(name = "user_quest_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "daily_quest_id", "quest_date"}),
    @UniqueConstraint(columnNames = {"user_id", "monthly_challenge_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserQuestProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_quest_id")
    private DailyQuest dailyQuest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monthly_challenge_id")
    private MonthlyChallenge monthlyChallenge;

    @Column(nullable = false)
    private Integer currentProgress = 0; // Tiến độ hiện tại

    @Column(nullable = false)
    private Integer targetValue; // Mục tiêu cần đạt

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestStatus status = QuestStatus.IN_PROGRESS;

    private LocalDate questDate; // Ngày của quest (cho daily quest)

    private LocalDateTime completedAt; // Thời gian hoàn thành

    private Boolean rewardClaimed = false; // Đã nhận thưởng chưa

    private LocalDateTime rewardClaimedAt; // Thời gian nhận thưởng

    private LocalDateTime expiresAt; // Thời gian hết hạn quest

    private LocalDateTime createdAt;
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

    /**
     * Cập nhật tiến độ và kiểm tra hoàn thành
     */
    public void addProgress(int amount) {
        this.currentProgress = Math.min(this.currentProgress + amount, this.targetValue);
        if (this.currentProgress >= this.targetValue && this.status == QuestStatus.IN_PROGRESS) {
            this.status = QuestStatus.COMPLETED;
            this.completedAt = LocalDateTime.now();
        }
    }

    /**
     * Lấy phần trăm hoàn thành
     */
    public double getProgressPercentage() {
        if (targetValue == 0) return 0;
        return Math.min(100.0, (currentProgress.doubleValue() / targetValue) * 100);
    }

    /**
     * Kiểm tra đã hoàn thành chưa
     */
    public boolean isCompleted() {
        return status == QuestStatus.COMPLETED;
    }

    /**
     * Kiểm tra đã hết hạn chưa
     */
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    public enum QuestStatus {
        IN_PROGRESS,  // Đang thực hiện
        COMPLETED,    // Đã hoàn thành
        EXPIRED,      // Đã hết hạn
        CLAIMED       // Đã nhận thưởng
    }
}
