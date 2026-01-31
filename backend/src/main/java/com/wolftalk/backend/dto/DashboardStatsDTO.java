package com.wolftalk.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private int streak;
    private long wordsLearned;
    private long unitsCompleted;
    private int points;
    private int todayLearningMinutes;
}
