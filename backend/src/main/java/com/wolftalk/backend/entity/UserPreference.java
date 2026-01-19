package com.wolftalk.backend.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ElementCollection
    @CollectionTable(name = "user_topics", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "topic")
    private List<String> interestedTopics; // Travel, Business, Technology, Health, etc.

    @ElementCollection
    @CollectionTable(name = "user_scenarios", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "scenario")
    private List<String> preferredScenarios; // Job Interview, Restaurant, Shopping, etc.

    @Column(name = "preferred_accent")
    private String preferredAccent; // American, British, Australian, etc.

    @Column(name = "difficulty_preference")
    private String difficultyPreference; // EASY, MEDIUM, HARD, ADAPTIVE

    @Column(name = "daily_practice_time")
    private Integer dailyPracticeTime; // in minutes

    @Column(name = "reminder_enabled")
    private Boolean reminderEnabled = true;

    @Column(name = "reminder_time")
    private String reminderTime; // HH:mm format

    @Column(name = "enable_ai_feedback")
    private Boolean enableAiFeedback = true;

    @Column(name = "enable_pronunciation_check")
    private Boolean enablePronunciationCheck = true;

    @Column(name = "enable_grammar_check")
    private Boolean enableGrammarCheck = true;

    @Column(name = "feedback_detail_level")
    private String feedbackDetailLevel = "MEDIUM"; // LOW, MEDIUM, HIGH

    @Column(name = "practice_with_mentor")
    private Boolean practiceWithMentor = false;

    @Column(name = "show_subtitles")
    private Boolean showSubtitles = true;

    @Column(name = "background_music_enabled")
    private Boolean backgroundMusicEnabled = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
