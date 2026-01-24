package com.wolftalk.backend.dto.learning.content;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PracticeExerciseDTO {
    private String scenarioId;
    private List<PracticeQuestionDTO> questions;
}
