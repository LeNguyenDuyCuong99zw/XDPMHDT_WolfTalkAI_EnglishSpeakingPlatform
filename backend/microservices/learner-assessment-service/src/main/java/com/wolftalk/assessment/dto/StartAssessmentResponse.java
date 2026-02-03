package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartAssessmentResponse {
    private Long attemptId;
    private Long assessmentId;
    private String startedAt;
    private Integer durationMinutes;
    private String message;
}
