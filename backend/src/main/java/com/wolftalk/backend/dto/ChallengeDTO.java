package com.wolftalk.backend.dto;

import com.wolftalk.backend.entity.Challenge;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeDTO {
    private Long id;
    private Challenge.ChallengeType type;
    private String title;
    private String description;
    private String content;
    private String audioUrl;
    private String imageUrl;
    private Integer level; // 1-5
    private String levelName; // EASY, NORMAL, MEDIUM, HARD, EXPERT
    private List<String> options;
    private Integer correctOptionIndex;
    private Integer timeLimit;
}
