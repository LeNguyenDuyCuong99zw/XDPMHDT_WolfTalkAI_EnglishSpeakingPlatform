package com.wolftalk.microservices.ai.service;

import com.wolftalk.microservices.ai.dto.GrammarExerciseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GrammarExerciseService {

    private final AIProviderService aiProviderService;

    public GrammarExerciseResponse generateExercises(String topic, String level, Integer count, String provider) {
        log.info("Generating {} exercises on {} for {} level", count, topic, level);

        String prompt = buildExercisePrompt(topic, level, count);
        String aiResponse = aiProviderService.getResponse(prompt, provider);

        return parseExerciseResponse(aiResponse, topic, level, count);
    }

    private String buildExercisePrompt(String topic, String level, Integer count) {
        return String.format("""
                Generate %d grammar exercises on the topic: %s
                Target level: %s
                
                Create a mix of:
                - Fill-in-the-blank questions
                - Multiple choice questions
                - Sentence correction exercises
                
                Format as JSON:
                {
                  "exercises": [
                    {
                      "id": 1,
                      "type": "fill_blank",
                      "question": "I ___ to the store yesterday.",
                      "correctAnswer": "went",
                      "explanation": "Past simple tense of 'go'",
                      "options": null
                    },
                    {
                      "id": 2,
                      "type": "multiple_choice",
                      "question": "Choose the correct form:",
                      "options": ["go", "goes", "went", "going"],
                      "correctAnswer": "went",
                      "explanation": "Past tense is needed"
                    }
                  ]
                }
                
                Make questions progressively challenging!
                """, count, topic, level);
    }

    private GrammarExerciseResponse parseExerciseResponse(String aiResponse, String topic, String level, Integer count) {
        // For MVP, return sample exercises
        // TODO: Implement proper JSON parsing
        
        List<GrammarExerciseResponse.Exercise> exercises = new ArrayList<>();
        
        for (int i = 1; i <= Math.min(count, 5); i++) {
            exercises.add(GrammarExerciseResponse.Exercise.builder()
                    .id(i)
                    .type(i % 2 == 0 ? "multiple_choice" : "fill_blank")
                    .question("Grammar question " + i + " about " + topic)
                    .correctAnswer("correct answer")
                    .explanation("Explanation for question " + i)
                    .options(i % 2 == 0 ? Arrays.asList("A", "B", "C", "D") : null)
                    .build());
        }

        return GrammarExerciseResponse.builder()
                .topic(topic)
                .level(level)
                .exercises(exercises)
                .build();
    }
}
