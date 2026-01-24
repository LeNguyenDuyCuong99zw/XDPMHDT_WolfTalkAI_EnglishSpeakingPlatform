package com.wolftalk.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class TestSubmissionDTO {
    private String testId;
    private List<AnswerDTO> answers;

    @Data
    public static class AnswerDTO {
        private String questionId;
        private Integer selectedOption;
    }
}
