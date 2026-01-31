package com.wolftalk.backend.dto;

import com.wolftalk.backend.entity.Challenge;
import com.wolftalk.backend.entity.DailyQuest;
import com.wolftalk.backend.entity.UserQuestProgress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO cho Daily Quest progress
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyQuestProgressDTO {

    private Long questId;
    private Long progressId;
    
    // Quest info
    private DailyQuest.QuestType questType;
    private String title;
    private String description;
    private String iconType;
    
    // Progress info  
    private Integer currentProgress;
    private Integer targetValue;
    private Double progressPercentage;
    private UserQuestProgress.QuestStatus status;
    
    // Reward info
    private Integer xpReward;
    private Integer gemsReward;
    private Boolean rewardClaimed;
    
    // Time info
    private LocalDate questDate;
    private LocalDateTime expiresAt;
    private Long remainingTimeHours;
    
    // Target type specific
    private Challenge.ChallengeType targetChallengeType;
    private Integer minAccuracy;
    
    /**
     * Static factory method to create DTO from entities
     */
    public static DailyQuestProgressDTO fromEntities(DailyQuest quest, UserQuestProgress progress) {
        DailyQuestProgressDTO dto = new DailyQuestProgressDTO();
        
        // Quest info
        dto.setQuestId(quest.getId());
        dto.setQuestType(quest.getQuestType());
        dto.setTitle(quest.getTitle());
        dto.setDescription(quest.getDescription());
        dto.setIconType(quest.getQuestType().getIconType());
        dto.setTargetValue(quest.getTargetValue());
        dto.setXpReward(quest.getXpReward());
        dto.setGemsReward(quest.getGemsReward());
        dto.setTargetChallengeType(quest.getTargetChallengeType());
        dto.setMinAccuracy(quest.getMinAccuracy());
        
        // Progress info
        if (progress != null) {
            dto.setProgressId(progress.getId());
            dto.setCurrentProgress(progress.getCurrentProgress());
            dto.setProgressPercentage(progress.getProgressPercentage());
            dto.setStatus(progress.getStatus());
            dto.setRewardClaimed(progress.getRewardClaimed());
            dto.setQuestDate(progress.getQuestDate());
            dto.setExpiresAt(progress.getExpiresAt());
            
            // Calculate remaining time
            if (progress.getExpiresAt() != null) {
                long hours = java.time.Duration.between(LocalDateTime.now(), progress.getExpiresAt()).toHours();
                dto.setRemainingTimeHours(Math.max(0, hours));
            }
        } else {
            // Not started yet
            dto.setCurrentProgress(0);
            dto.setProgressPercentage(0.0);
            dto.setStatus(UserQuestProgress.QuestStatus.IN_PROGRESS);
            dto.setRewardClaimed(false);
            dto.setQuestDate(LocalDate.now());
        }
        
        return dto;
    }
}
