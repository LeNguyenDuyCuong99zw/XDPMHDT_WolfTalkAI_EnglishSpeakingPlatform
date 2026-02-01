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
public class GrammarExerciseResponse {
    private String topic;
    private String level;
    private List<Exercise> exercises;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Exercise {
        private Integer id;
        private String question;
        private String correctAnswer;
        private String explanation;
        private String type; // fill_blank, multiple_choice, correction
        private List<String> options; // for multiple choice
    }
}
