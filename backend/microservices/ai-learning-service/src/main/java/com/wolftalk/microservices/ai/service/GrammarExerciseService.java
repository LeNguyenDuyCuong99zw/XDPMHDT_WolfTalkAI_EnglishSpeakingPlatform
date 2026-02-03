package com.wolftalk.microservices.ai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wolftalk.microservices.ai.dto.GrammarExerciseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class GrammarExerciseService {

    private final AIProviderService aiProviderService;
    private final ObjectMapper objectMapper;

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
                - Fill-in-the-blank questions (must have a clear context)
                - Multiple choice questions (must have 4 distinct options)
                - Sentence correction exercises
                
                IMPORTANT RULES:
                1. Return ONLY valid JSON.
                2. Do not using markdown code blocks (```json).
                3. The "question" field MUST contain the full question text, never leave it empty.
                4. Ensure explanations are helpful.
                
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
        try {
            log.info("Parsing AI response for grammar exercises");
            
            // Extract JSON from response (handles markdown code blocks)
            String jsonString = extractJsonFromResponse(aiResponse);
            
            // Parse JSON
            JsonNode rootNode = objectMapper.readTree(jsonString);
            JsonNode exercisesNode = rootNode.get("exercises");
            
            if (exercisesNode != null && exercisesNode.isArray()) {
                List<GrammarExerciseResponse.Exercise> exercises = objectMapper.convertValue(
                    exercisesNode,
                    new TypeReference<List<GrammarExerciseResponse.Exercise>>() {}
                );
                
                log.info("Successfully parsed {} exercises from AI response", exercises.size());
                
                return GrammarExerciseResponse.builder()
                        .topic(topic)
                        .level(level)
                        .exercises(exercises)
                        .build();
            } else {
                log.warn("No exercises array found in AI response, using fallback");
                return createFallbackResponse(topic, level, count);
            }
            
        } catch (Exception e) {
            log.error("Failed to parse AI response for grammar exercises: {}", e.getMessage());
            log.debug("AI Response snippet: {}", aiResponse.substring(0, Math.min(200, aiResponse.length())));
            return createFallbackResponse(topic, level, count);
        }
    }
    
    private String extractJsonFromResponse(String response) {
        // Try to extract JSON from markdown code blocks
        Pattern pattern = Pattern.compile("```(?:json)?\\s*\\n?([\\s\\S]*?)```", Pattern.MULTILINE);
        Matcher matcher = pattern.matcher(response);
        
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        
        // Try to find JSON object boundaries
        int startIndex = response.indexOf("{");
        int endIndex = response.lastIndexOf("}");
        
        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            return response.substring(startIndex, endIndex + 1).trim();
        }
        
        // Return as-is if no patterns found
        return response.trim();
    }
    
    private GrammarExerciseResponse createFallbackResponse(String topic, String level, Integer count) {
        log.warn("Using fallback mock data for grammar exercises");
        
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
