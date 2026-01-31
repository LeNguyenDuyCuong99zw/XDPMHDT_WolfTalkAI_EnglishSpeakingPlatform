package com.wolftalk.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListeningChallengeDTO {
    private Long id;
    private String title;
    private String description;
    private Integer difficultyLevel;
    private String audioUrl;
    private String englishText;
    private String vietnameseText;
    private Integer basePoints;
    private String category;
    private Integer durationSeconds;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
