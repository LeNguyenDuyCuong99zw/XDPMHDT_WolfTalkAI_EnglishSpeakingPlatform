package com.wolftalk.backend.dto;

import com.wolftalk.backend.entity.Challenge;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeWeeklyProgressDTO {
    private Long id;
    private Challenge.ChallengeType challengeType;
    private Integer year;
    private Integer weekNumber;
    private Integer totalAttempts;
    private Integer correctAttempts;
    private Integer totalXP;
    private Integer totalTime;
    private Double accuracyPercentage;
    private Double averageXPPerAttempt;
}
