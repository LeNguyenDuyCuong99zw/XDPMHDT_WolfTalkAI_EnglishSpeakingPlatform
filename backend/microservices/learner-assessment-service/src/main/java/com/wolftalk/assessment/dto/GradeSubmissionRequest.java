package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeSubmissionRequest {
    private List<AnswerGrade> answers;
    private Double totalScore;
    private String levelResult; // A1, A2, B1, B2, C1, C2
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerGrade {
        private Long answerId;
        private Double score;
        private String feedback;
    }
}
