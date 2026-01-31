package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "initial_assessment_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitialAssessmentQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Loại câu hỏi: LISTENING, SPEAKING, WRITING, READING
    @Column(nullable = false)
    private String questionType;

    // Loại format: MULTIPLE_CHOICE, SPEAKING_RECORD
    @Column(nullable = false)
    private String answerFormat;

    // Nội dung câu hỏi
    @Column(nullable = false, length = 500)
    private String questionText;

    // URL audio cho câu hỏi nghe
    @Column(length = 1000)
    private String audioUrl;

    // URL hình ảnh nếu có
    @Column(length = 1000)
    private String imageUrl;

    // Đáp án đúng
    @Column(nullable = false, length = 200)
    private String correctAnswer;

    // Các lựa chọn (phân cách bằng |)
    @Column(length = 500)
    private String options; // "option1|option2|option3|option4"

    // Mức độ khó: 1-3 (Easy-Medium-Hard)
    @Column(nullable = false)
    private Integer difficulty = 1;

    // Skill được kiểm tra
    @Column(nullable = false)
    private String skillType; // LISTENING, SPEAKING, WRITING, READING

    // Giải thích đáp án
    @Column(length = 500)
    private String explanation;

    // Thời gian tạo
    private Instant createdAt = Instant.now();
}
