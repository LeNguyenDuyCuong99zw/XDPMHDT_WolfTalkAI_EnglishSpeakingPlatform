package com.wolftalk.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListeningProgressDTO {
    private Long id;
    private Long challengeId;
    private String challengeTitle;
    private Boolean completed;
    private Integer attempts;
    private Integer correctAttempts;
    private Integer pointsEarned;
    private Integer currentStreak;
    private Integer maxStreak;
    private LocalDate lastCompletedDate;
    private String userAnswer;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
