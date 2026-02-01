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
public class ReadingPassageResponse {
    private String passage;
    private List<Question> questions;
    private List<VocabularyItem> vocabulary;
    private String topic;
    private String level;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Question {
        private String type; // multiple_choice, true_false, open_ended
        private String question;
        private List<String> options; // for multiple choice
        private String correctAnswer;
        private String explanation;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VocabularyItem {
        private String word;
        private String definition;
        private String example;
    }
}
