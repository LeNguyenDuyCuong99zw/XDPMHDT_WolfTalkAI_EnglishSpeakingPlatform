package com.wolftalk.pronunciation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PronunciationCheckResponse {
    
    private Long attemptId;
    private String transcript;
    private String expectedText;
    private Double accuracyScore;
    private Double pronunciationScore;
    private Double overallScore;
    private String level; // "Lower intermediate", "Intermediate", "Upper intermediate", etc.
    private List<WordFeedback> wordFeedback;
    private List<String> suggestions;
}
