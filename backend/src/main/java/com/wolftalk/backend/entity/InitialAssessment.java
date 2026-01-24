package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "initial_assessments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitialAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Người dùng làm bài test
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Tổng số điểm
    private Integer totalScore = 0;

    // Số câu trả lời đúng
    private Integer correctAnswers = 0;

    // Tổng số câu
    private Integer totalQuestions = 0;

    // Level đánh giá: BEGINNER, ELEMENTARY, INTERMEDIATE, ADVANCED, EXPERT
    private String assessmentLevel;

    // Chi tiết điểm từng kỹ năng
    private Integer listeningScore = 0;
    private Integer speakingScore = 0;
    private Integer writingScore = 0;
    private Integer readingScore = 0;

    // Số câu đúng từng loại
    private Integer listeningCorrect = 0;
    private Integer speakingCorrect = 0;
    private Integer writingCorrect = 0;
    private Integer readingCorrect = 0;

    // Khuyến nghị bài học tiếp theo
    @Column(length = 1000)
    private String recommendation;

    // Điểm mạnh
    @Column(length = 500)
    private String strengths;

    // Điểm yếu
    @Column(length = 500)
    private String weaknesses;

    // Ngày tạo test
    private Instant createdAt = Instant.now();

    // Ngày hoàn thành
    private Instant completedAt;

    // Trạng thái: ACTIVE, COMPLETED
    private String status = "ACTIVE";
}
