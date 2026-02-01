package com.wolftalk.microservices.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrammarCheckResponse {
    private Long checkId;
    private String originalText;
    private String correctedText;
    private List<GrammarError> errors;
    private List<String> suggestions;
    private Integer errorCount;
    private String overallFeedback;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GrammarError {
        private String type; // grammar, spelling, punctuation
        private String message;
        private String incorrectText;
        private String correctText;
        private Integer position;
        private String explanation;
    }
}
