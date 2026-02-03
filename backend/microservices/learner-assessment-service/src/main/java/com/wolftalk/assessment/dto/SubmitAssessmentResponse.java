package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAssessmentResponse {
    private String message;
    private String submittedAt;
    private Integer totalAnswered;
    private Integer totalQuestions;
}
