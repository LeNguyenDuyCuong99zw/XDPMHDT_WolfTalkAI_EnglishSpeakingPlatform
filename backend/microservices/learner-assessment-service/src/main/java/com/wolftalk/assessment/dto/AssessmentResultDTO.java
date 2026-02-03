package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentResultDTO {
    private Long attemptId;
    private String assessmentTitle;
    private String status; // GRADED
    private String submittedAt;
    private String gradedAt;
    private Integer timeSpentMinutes;
    private Double totalScore;
    private String levelResult;
    private Map<String, SectionScore> breakdown; // section -> score
    private String overallFeedback;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectionScore {
        private Double score;
        private Double maxScore;
        private String feedback;
    }
}
