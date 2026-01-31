package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitialAssessmentDTO {
    private Long id;
    private Integer totalScore;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private String assessmentLevel;
    private Integer listeningScore;
    private Integer speakingScore;
    private Integer writingScore;
    private Integer readingScore;
    private String recommendation;
    private String strengths;
    private String weaknesses;
    private Instant createdAt;
    private Instant completedAt;
    private String status;
}
