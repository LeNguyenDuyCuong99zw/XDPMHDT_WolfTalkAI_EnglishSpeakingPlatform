package com.wolftalk.backend.dto.learning;

import com.wolftalk.backend.dto.learning.content.ConversationDTO;
import com.wolftalk.backend.dto.learning.content.GrammarDTO;
import com.wolftalk.backend.dto.learning.content.VocabularyDTO;
import com.wolftalk.backend.dto.learning.content.PracticeExerciseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScenarioDetailDTO {
    private String scenarioName;
    private List<VocabularyDTO> vocabulary;
    private List<GrammarDTO> grammar;
    private List<ConversationDTO> conversation;
    private PracticeExerciseDTO practice;
}
