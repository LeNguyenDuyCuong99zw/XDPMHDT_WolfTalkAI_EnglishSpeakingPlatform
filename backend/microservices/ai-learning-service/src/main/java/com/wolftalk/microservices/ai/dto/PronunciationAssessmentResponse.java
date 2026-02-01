package com.wolftalk.microservices.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PronunciationAssessmentResponse {
    private Long assessmentId;
    private String transcript;
    private BigDecimal accuracyScore;
    private BigDecimal fluencyScore;
    private BigDecimal pronunciationScore;
    private BigDecimal overallScore;
    private List<WordFeedback> wordFeedback;
    private List<String> suggestions;
    private String generalFeedback;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WordFeedback {
        private String word;
        private BigDecimal score;
        private String phonetic;
        private String issue;
    }
}
