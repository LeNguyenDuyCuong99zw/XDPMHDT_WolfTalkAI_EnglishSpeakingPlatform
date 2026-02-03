package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentDTO {
    private Long id;
    private String title;
    private String description;
    private String level;
    private Integer durationMinutes;
    private Integer passingScore;
    private Boolean isActive;
    private Integer totalQuestions;
    private List<QuestionDTO> questions;
}
