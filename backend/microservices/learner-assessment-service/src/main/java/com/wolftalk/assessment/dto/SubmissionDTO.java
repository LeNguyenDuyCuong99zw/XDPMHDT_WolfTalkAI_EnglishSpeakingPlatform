package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private Long attemptId;
    private Long learnerId;
    private String learnerName;
    private String learnerEmail;
    private Long assessmentId;
    private String assessmentTitle;
    private String status; // SUBMITTED, GRADED
    private String submittedAt;
    private Integer timeSpentMinutes;
    private Integer totalAnswered;
    private Integer totalQuestions;
}
