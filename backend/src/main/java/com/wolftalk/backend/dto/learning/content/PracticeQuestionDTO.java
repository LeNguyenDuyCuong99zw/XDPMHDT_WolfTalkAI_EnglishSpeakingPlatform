package com.wolftalk.backend.dto.learning.content;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PracticeQuestionDTO {
    private String id;
    private String type;
    private String question;
    private String explanation;
    private String correctAnswer;
    private List<String> options;
    private List<String> segments;
    private List<String> correctOrder;
    private List<MatchingPairDTO> pairs;
    private String imageUrl;
    private String audioUrl;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchingPairDTO {
        private String id;
        private String left;
        private String right;
    }
}
