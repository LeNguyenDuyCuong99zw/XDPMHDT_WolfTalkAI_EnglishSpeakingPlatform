package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LevelRecommendationDTO {
    private String level; // BEGINNER, ELEMENTARY, INTERMEDIATE, ADVANCED, EXPERT
    private Integer score;
    private String recommendation;
    private String strengths;
    private String weaknesses;
    private String nextSteps;
}
