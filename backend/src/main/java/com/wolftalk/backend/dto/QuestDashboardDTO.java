package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO tổng hợp cho toàn bộ Quest Dashboard
 * Bao gồm: Daily Quests, Monthly Challenge, Stats
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestDashboardDTO {

    // Daily Quests
    private List<DailyQuestProgressDTO> dailyQuests;
    private Integer dailyQuestsCompleted;
    private Integer dailyQuestsTotal;
    private Long remainingTimeHours; // Thời gian còn lại đến reset
    
    // Monthly Challenge
    private MonthlyChallengeProgressDTO monthlyChallenge;
    
    // User Stats
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer totalXpToday;
    private Integer totalXpThisWeek;
    private Integer totalQuestsCompletedAllTime;
    
    // Unclaimed Rewards
    private Integer unclaimedRewardsCount;
    private Integer pendingXpReward;
    private Integer pendingGemsReward;
    
    /**
     * DTO cho request claim reward
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClaimRewardRequest {
        private Long progressId;
        private String questType; // "daily" or "monthly"
    }
    
    /**
     * DTO cho response claim reward
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClaimRewardResponse {
        private Boolean success;
        private String message;
        private Integer xpEarned;
        private Integer gemsEarned;
        private Integer newTotalXp;
        private Integer newStreak;
    }
    
    /**
     * DTO cho cập nhật tiến độ quest
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestProgressUpdateRequest {
        private Long questId;
        private Integer progressAmount;
        private String eventType; // "xp_earned", "lesson_completed", "challenge_completed", etc.
    }
}
