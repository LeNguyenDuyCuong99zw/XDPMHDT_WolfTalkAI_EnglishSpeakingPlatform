package com.wolftalk.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_vocabulary_level", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVocabularyLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Integer currentLevel = 1;  // 1-5

    @Column(nullable = false)
    private Integer totalWordsLearned = 0;  // Tổng số từ đã học (MASTERED)

    @Column(nullable = false)
    private Integer wordsInProgress = 0;   // Số từ đang học

    @Column(nullable = false)
    private Integer totalXpEarned = 0;     // Tổng XP từ vocabulary

    private LocalDateTime lastLevelUp;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentLevel == null) currentLevel = 1;
        if (totalWordsLearned == null) totalWordsLearned = 0;
        if (wordsInProgress == null) wordsInProgress = 0;
        if (totalXpEarned == null) totalXpEarned = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Check if user can level up based on words learned
     * Level 1 -> 2: 30 words
     * Level 2 -> 3: 60 words (total 90)
     * Level 3 -> 4: 100 words (total 190)
     * Level 4 -> 5: 150 words (total 340)
     */
    public boolean canLevelUp() {
        return totalWordsLearned >= getWordsRequiredForNextLevel();
    }

    public int getWordsRequiredForNextLevel() {
        return switch (currentLevel) {
            case 1 -> 30;   // Need 30 words for level 2
            case 2 -> 90;   // Need 90 total words for level 3
            case 3 -> 190;  // Need 190 total words for level 4
            case 4 -> 340;  // Need 340 total words for level 5
            default -> Integer.MAX_VALUE; // Already max level
        };
    }

    public int getWordsToNextLevel() {
        return Math.max(0, getWordsRequiredForNextLevel() - totalWordsLearned);
    }

    public void levelUp() {
        if (currentLevel < 5 && canLevelUp()) {
            currentLevel++;
            lastLevelUp = LocalDateTime.now();
        }
    }

    public void addWordsLearned(int count) {
        this.totalWordsLearned += count;
        // Auto level up if requirements met
        while (canLevelUp() && currentLevel < 5) {
            levelUp();
        }
    }

    public void addXp(int xp) {
        this.totalXpEarned += xp;
    }

    /**
     * Get vocabulary topics available for current level
     */
    public VocabularyWord.VocabularyTopic[] getAvailableTopics() {
        return switch (currentLevel) {
            case 1 -> new VocabularyWord.VocabularyTopic[]{
                VocabularyWord.VocabularyTopic.GREETINGS,
                VocabularyWord.VocabularyTopic.FAMILY,
                VocabularyWord.VocabularyTopic.NUMBERS,
                VocabularyWord.VocabularyTopic.COLORS
            };
            case 2 -> new VocabularyWord.VocabularyTopic[]{
                VocabularyWord.VocabularyTopic.GREETINGS,
                VocabularyWord.VocabularyTopic.FAMILY,
                VocabularyWord.VocabularyTopic.NUMBERS,
                VocabularyWord.VocabularyTopic.COLORS,
                VocabularyWord.VocabularyTopic.FOOD,
                VocabularyWord.VocabularyTopic.ANIMALS,
                VocabularyWord.VocabularyTopic.BODY_PARTS
            };
            case 3 -> new VocabularyWord.VocabularyTopic[]{
                VocabularyWord.VocabularyTopic.GREETINGS,
                VocabularyWord.VocabularyTopic.FAMILY,
                VocabularyWord.VocabularyTopic.NUMBERS,
                VocabularyWord.VocabularyTopic.COLORS,
                VocabularyWord.VocabularyTopic.FOOD,
                VocabularyWord.VocabularyTopic.ANIMALS,
                VocabularyWord.VocabularyTopic.BODY_PARTS,
                VocabularyWord.VocabularyTopic.WEATHER,
                VocabularyWord.VocabularyTopic.CLOTHES,
                VocabularyWord.VocabularyTopic.TRANSPORTATION,
                VocabularyWord.VocabularyTopic.HOUSE
            };
            case 4 -> new VocabularyWord.VocabularyTopic[]{
                VocabularyWord.VocabularyTopic.GREETINGS,
                VocabularyWord.VocabularyTopic.FAMILY,
                VocabularyWord.VocabularyTopic.NUMBERS,
                VocabularyWord.VocabularyTopic.COLORS,
                VocabularyWord.VocabularyTopic.FOOD,
                VocabularyWord.VocabularyTopic.ANIMALS,
                VocabularyWord.VocabularyTopic.BODY_PARTS,
                VocabularyWord.VocabularyTopic.WEATHER,
                VocabularyWord.VocabularyTopic.CLOTHES,
                VocabularyWord.VocabularyTopic.TRANSPORTATION,
                VocabularyWord.VocabularyTopic.HOUSE,
                VocabularyWord.VocabularyTopic.SCHOOL,
                VocabularyWord.VocabularyTopic.WORK,
                VocabularyWord.VocabularyTopic.TRAVEL,
                VocabularyWord.VocabularyTopic.HEALTH,
                VocabularyWord.VocabularyTopic.SPORTS
            };
            case 5 -> VocabularyWord.VocabularyTopic.values(); // All topics
            default -> new VocabularyWord.VocabularyTopic[]{
                VocabularyWord.VocabularyTopic.GREETINGS
            };
        };
    }
}
