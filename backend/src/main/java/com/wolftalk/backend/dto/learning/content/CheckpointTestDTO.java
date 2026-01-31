package com.wolftalk.backend.dto.learning.content;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckpointTestDTO {
    private String id;
    private String levelId;
    private String title;
    private String description;
    private int durationMinutes;
    private int passingScore;
    private List<CheckpointQuestionDTO> questions;
}
