package com.wolftalk.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vocabulary_words")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String word;

    private String phonetic;  // IPA pronunciation
    
    @Column(nullable = false)
    private String meaning;   // Vietnamese meaning
    
    private String example;   // Example sentence
    
    @Column(columnDefinition = "TEXT")
    private String usageNote; // Usage notes
    
    private String audioUrl;  // Pronunciation audio
    private String imageUrl;  // Illustration image

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VocabularyTopic topic;

    @Column(nullable = false)
    private Integer level;    // 1-5 (difficulty level)

    @Enumerated(EnumType.STRING)
    private WordType wordType; // NOUN, VERB, ADJECTIVE, etc.

    private LocalDateTime createdAt;
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

    public enum VocabularyTopic {
        GREETINGS,      // Chào hỏi
        FAMILY,         // Gia đình
        FOOD,           // Thức ăn
        NUMBERS,        // Số đếm
        COLORS,         // Màu sắc
        ANIMALS,        // Động vật
        WEATHER,        // Thời tiết
        BODY_PARTS,     // Bộ phận cơ thể
        CLOTHES,        // Quần áo
        TRANSPORTATION, // Phương tiện
        HOUSE,          // Nhà cửa
        SCHOOL,         // Trường học
        WORK,           // Công việc
        TRAVEL,         // Du lịch
        HEALTH,         // Sức khỏe
        SPORTS,         // Thể thao
        TECHNOLOGY,     // Công nghệ
        NATURE,         // Thiên nhiên
        EMOTIONS,       // Cảm xúc
        TIME,           // Thời gian
        SHOPPING,       // Mua sắm
        HOBBIES,        // Sở thích
        BUSINESS,       // Kinh doanh
        SCIENCE,        // Khoa học
        CULTURE         // Văn hóa
    }

    public enum WordType {
        NOUN,
        VERB,
        ADJECTIVE,
        ADVERB,
        PRONOUN,
        PREPOSITION,
        CONJUNCTION,
        INTERJECTION,
        PHRASE
    }
}
