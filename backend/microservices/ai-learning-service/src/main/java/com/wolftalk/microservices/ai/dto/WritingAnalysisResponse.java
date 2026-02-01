package com.wolftalk.microservices.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WritingAnalysisResponse {
    private String originalText;
    private Integer score; // 0-100
    private List<String> strengths;
    private List<String> improvements;
    private Map<String, List<String>> suggestions; // vocabulary, grammar, structure
    private String overallFeedback;
    private String correctedText;
}
