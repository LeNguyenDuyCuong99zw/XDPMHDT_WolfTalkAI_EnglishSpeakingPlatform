package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class VocabularyLearningDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WordDTO {
        private Long id;
        private String word;
        private String phonetic;
        private String meaning;
        private String example;
        private String usageNote;
        private String audioUrl;
        private String imageUrl;
        private String topic;
        private Integer level;
        private String wordType;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopicInfo {
        private String topic;
        private String topicDisplayName;
        private Integer totalWords;
        private Integer masteredWords;
        private Integer progress; // 0-100%
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningSession {
        private Long userId;
        private Integer currentLevel;
        private Integer totalWordsLearned;
        private Integer wordsToNextLevel;
        private WordDTO word;           // Single word for this session
        private List<String> options;   // 4 multiple choice options
        private String sessionType;     // LEARN, REVIEW, PRACTICE
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerRequest {
        private Long wordId;
        private String userAnswer;
        private Boolean isCorrect;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerResult {
        private Boolean correct;
        private Integer xpEarned;
        private Integer masteryScore;
        private String wordStatus;
        private Boolean justMastered;
        private Boolean leveledUp;
        private Integer newLevel;
        private Integer totalWordsLearned;
        private Integer wordsToNextLevel;
        private String correctAnswer;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStats {
        private Long userId;
        private Integer currentLevel;
        private Integer totalWordsLearned;
        private Integer wordsInProgress;
        private Integer totalXpEarned;
        private Integer wordsToNextLevel;
        private Integer wordsRequiredForNextLevel;
        private Integer levelProgress; // 0-100%
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LevelRequirements {
        private Integer level;
        private Integer wordsRequired;
        private String[] availableTopics;
    }
}
