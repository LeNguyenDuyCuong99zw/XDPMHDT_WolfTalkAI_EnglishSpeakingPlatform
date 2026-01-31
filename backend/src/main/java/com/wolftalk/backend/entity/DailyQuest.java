package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Daily Quest - Nhiệm vụ hằng ngày (giống Duolingo)
 * 
 * Các loại nhiệm vụ:
 * - EARN_XP: Kiếm X XP
 * - COMPLETE_LESSONS: Hoàn thành X bài học với độ chính xác từ Y% trở lên
 * - COMBO_XP: Đạt X XP thưởng combo
 * - STREAK_DAYS: Duy trì streak X ngày
 * - PERFECT_LESSONS: Hoàn thành bài học với 100% chính xác
 * - CHALLENGE_TYPE: Hoàn thành X bài của loại cụ thể (LISTENING, SPEAKING, etc.)
 */
@Entity
@Table(name = "daily_quests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestType questType;

    @Column(nullable = false)
    private String title; // "Kiếm 10 KN"

    private String description; // "Hoàn thành bài học để kiếm kinh nghiệm"

    @Column(nullable = false)
    private Integer targetValue; // 10, 2, 15, etc.

    @Column(nullable = false)
    private Integer xpReward; // XP thưởng khi hoàn thành quest

    private Integer gemsReward = 0; // Gems thưởng (optional)

    @Enumerated(EnumType.STRING)
    private Challenge.ChallengeType targetChallengeType; // For CHALLENGE_TYPE quests

    private Integer minAccuracy; // Độ chính xác tối thiểu (cho COMPLETE_LESSONS)

    @Column(nullable = false)
    private Boolean isActive = true;

    private Integer difficulty = 1; // 1-Easy, 2-Medium, 3-Hard

    private Integer resetHours = 24; // Số giờ trước khi reset (24h cho daily)

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

    public enum QuestType {
        EARN_XP("Kiếm XP", "xp"),
        COMPLETE_LESSONS("Hoàn thành bài học", "lessons"),
        COMBO_XP("XP thưởng combo", "combo"),
        STREAK_DAYS("Duy trì streak", "streak"),
        PERFECT_LESSONS("Bài học hoàn hảo", "perfect"),
        CHALLENGE_TYPE("Hoàn thành bài tập", "challenge"),
        TIME_SPENT("Thời gian học", "time");

        private final String displayName;
        private final String iconType;

        QuestType(String displayName, String iconType) {
            this.displayName = displayName;
            this.iconType = iconType;
        }

        public String getDisplayName() {
            return displayName;
        }

        public String getIconType() {
            return iconType;
        }
    }
}
