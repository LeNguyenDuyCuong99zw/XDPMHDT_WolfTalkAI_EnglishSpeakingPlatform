package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDetailDTO {
    private Long attemptId;
    private LearnerInfo learner;
    private AssessmentInfo assessment;
    private String submittedAt;
    private Integer timeSpentMinutes;
    private List<AnswerDetail> answers;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearnerInfo {
        private Long id;
        private String name;
        private String email;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssessmentInfo {
        private Long id;
        private String title;
        private String level;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerDetail {
        private Long answerId;
        private Long questionId;
        private String questionText;
        private String section; // MULTIPLE_CHOICE, READING, SPEAKING, WRITING
        private String questionType;
        private String answerText;
        private String videoUrl;
        private String audioUrl;
        private String correctAnswer; // Cho trắc nghiệm
        private Boolean isCorrect; // Cho trắc nghiệm
        private Double score;
        private String feedback;
    }
}
