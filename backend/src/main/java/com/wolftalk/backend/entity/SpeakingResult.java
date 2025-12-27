package com.wolftalk.backend.entity;

import jakarta.persistence.*;

@Entity
public class SpeakingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sessionId;
    private int pronunciationScore;
    private int grammarScore;
    private int vocabularyScore;
    private int fluencyScore;
    private int overallScore;

    private String feedback;

    // ===== GETTER / SETTER =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public int getPronunciationScore() { return pronunciationScore; }
    public void setPronunciationScore(int pronunciationScore) {
        this.pronunciationScore = pronunciationScore;
    }

    public int getGrammarScore() { return grammarScore; }
    public void setGrammarScore(int grammarScore) {
        this.grammarScore = grammarScore;
    }

    public int getVocabularyScore() { return vocabularyScore; }
    public void setVocabularyScore(int vocabularyScore) {
        this.vocabularyScore = vocabularyScore;
    }

    public int getFluencyScore() { return fluencyScore; }
    public void setFluencyScore(int fluencyScore) {
        this.fluencyScore = fluencyScore;
    }

    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
