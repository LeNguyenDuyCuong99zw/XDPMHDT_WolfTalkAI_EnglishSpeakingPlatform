package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Long id;
    private String section;
    private String questionType;
    private String questionText;
    private String readingPassage;
    private Integer points;
    private Integer orderIndex;
    private List<OptionDTO> options;
}
