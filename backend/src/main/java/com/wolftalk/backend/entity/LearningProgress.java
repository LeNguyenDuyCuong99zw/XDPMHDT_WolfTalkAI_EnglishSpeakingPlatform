package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class LearningProgress {

    @Id
    private Long learnerId;

    private int totalSessions;
    private double averageScore;
    private int streakDays;
    private LocalDate lastPracticeDate;

    // ===== GETTER / SETTER =====
    public Long getLearnerId() { return learnerId; }
    public void setLearnerId(Long learnerId) { this.learnerId = learnerId; }

    public int getTotalSessions() { return totalSessions; }
    public void setTotalSessions(int totalSessions) {
        this.totalSessions = totalSessions;
    }

    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    public int getStreakDays() { return streakDays; }
    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public LocalDate getLastPracticeDate() { return lastPracticeDate; }
    public void setLastPracticeDate(LocalDate lastPracticeDate) {
        this.lastPracticeDate = lastPracticeDate;
    }
}
