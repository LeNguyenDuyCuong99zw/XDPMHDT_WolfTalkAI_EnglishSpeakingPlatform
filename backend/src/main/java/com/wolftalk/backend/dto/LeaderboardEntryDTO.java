package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private String avatar;
    private Integer totalPoints;
    private Integer currentStreak;
    private Integer maxStreak;
    private Integer completedChallenges;
    private Integer rank;
}
