package com.wolftalk.backend.dto;

import com.wolftalk.backend.entity.MonthlyChallenge;
import com.wolftalk.backend.entity.UserQuestProgress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * DTO cho Monthly Challenge progress
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyChallengeProgressDTO {

    private Long challengeId;
    private Long progressId;
    
    // Challenge info
    private String title;
    private String description;
    private String monthNameVi;
    private String monthNameEn;
    private Integer year;
    private Integer month;
    
    // Progress info
    private Integer completedQuests;
    private Integer totalQuestsRequired;
    private Double progressPercentage;
    private UserQuestProgress.QuestStatus status;
    
    // Badge info
    private String badgeName;
    private String badgeIcon;
    private String badgeImageUrl;
    
    // Reward info
    private Integer xpReward;
    private Integer gemsReward;
    private Boolean rewardClaimed;
    
    // Time info
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long remainingDays;
    
    /**
     * Static factory method
     */
    public static MonthlyChallengeProgressDTO fromEntities(MonthlyChallenge challenge, UserQuestProgress progress, Long completedQuests) {
        MonthlyChallengeProgressDTO dto = new MonthlyChallengeProgressDTO();
        
        // Challenge info
        dto.setChallengeId(challenge.getId());
        dto.setTitle(challenge.getTitle());
        dto.setDescription(challenge.getDescription());
        dto.setMonthNameVi(challenge.getMonthNameVi());
        dto.setMonthNameEn(challenge.getMonthNameEn());
        dto.setYear(challenge.getYear());
        dto.setMonth(challenge.getMonth());
        dto.setTotalQuestsRequired(challenge.getTotalQuestsRequired());
        
        // Badge info
        dto.setBadgeName(challenge.getBadgeName());
        dto.setBadgeIcon(challenge.getBadgeIcon());
        dto.setBadgeImageUrl(challenge.getBadgeImageUrl());
        
        // Reward info
        dto.setXpReward(challenge.getXpReward());
        dto.setGemsReward(challenge.getGemsReward());
        
        // Time info
        dto.setStartDate(challenge.getStartDate());
        dto.setEndDate(challenge.getEndDate());
        
        // Calculate remaining days
        long days = Duration.between(LocalDateTime.now(), challenge.getEndDate()).toDays();
        dto.setRemainingDays(Math.max(0, days));
        
        // Progress info
        int completed = completedQuests != null ? completedQuests.intValue() : 0;
        dto.setCompletedQuests(completed);
        
        double percentage = challenge.getTotalQuestsRequired() > 0 
            ? (completed * 100.0) / challenge.getTotalQuestsRequired() 
            : 0;
        dto.setProgressPercentage(Math.min(100.0, percentage));
        
        if (progress != null) {
            dto.setProgressId(progress.getId());
            dto.setStatus(progress.getStatus());
            dto.setRewardClaimed(progress.getRewardClaimed());
        } else {
            dto.setStatus(completed >= challenge.getTotalQuestsRequired() 
                ? UserQuestProgress.QuestStatus.COMPLETED 
                : UserQuestProgress.QuestStatus.IN_PROGRESS);
            dto.setRewardClaimed(false);
        }
        
        return dto;
    }
}
