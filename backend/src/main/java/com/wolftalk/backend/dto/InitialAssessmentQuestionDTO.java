package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitialAssessmentQuestionDTO {
    private Long id;
    private String questionType; // LISTENING, SPEAKING, WRITING, READING
    private String answerFormat; // MULTIPLE_CHOICE, SPEAKING_RECORD
    private String questionText;
    private String audioUrl;
    private String imageUrl;
    private String[] options;
    private Integer difficulty;
    private String skillType;
    private String explanation;
}
