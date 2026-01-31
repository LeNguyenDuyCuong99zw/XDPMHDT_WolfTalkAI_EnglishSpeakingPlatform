package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitialAssessmentAnswerRequest {
    private Long questionId;
    private String answer; // Câu trả lời của người dùng
    private String audioUrl; // Nếu là câu hỏi speaking, đây là URL audio ghi âm
    private Long assessmentId; // ID của bài test
}
