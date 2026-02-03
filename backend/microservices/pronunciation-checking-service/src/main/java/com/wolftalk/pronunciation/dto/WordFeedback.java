package com.wolftalk.pronunciation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WordFeedback {
    
    private String word;
    private Double confidence;
    private Boolean isCorrect;
    private String issue;
    private String color; // "green", "orange", "red"
}
