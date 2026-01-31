package com.wolftalk.backend.dto;

import com.wolftalk.backend.entity.Challenge;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeSubmissionDTO {
    private Long id;
    private Long challengeId;
    private String userAnswer;
    private Boolean isCorrect;
    private Integer timeSpent;
    private Integer xpEarned;
    private Integer accuracy;
    private Boolean firstAttempt;

    // Submission request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private Long challengeId;
        private String userAnswer;
        private Integer timeSpent;
    }
}
