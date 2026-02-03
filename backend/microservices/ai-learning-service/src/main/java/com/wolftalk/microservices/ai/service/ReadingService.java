package com.wolftalk.microservices.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wolftalk.microservices.ai.dto.ReadingPassageResponse;
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
public class ReadingService {

    private final AIProviderService aiProviderService;
    private final ObjectMapper objectMapper;

    public ReadingPassageResponse generatePassage(String topic, String level, String length, String provider) {
        log.info("Generating reading passage: topic={}, level={}, length={}", topic, level, length);

        String prompt = buildPassagePrompt(topic, level, length);
        String aiResponse = aiProviderService.getResponse(prompt, provider);

        return parsePassageResponse(aiResponse, topic, level);
    }

    private String buildPassagePrompt(String topic, String level, String length) {
        String topicPart = (topic != null && !topic.isBlank()) ? topic : "an interesting current event";
        
        int wordCount = switch (length.toLowerCase()) {
            case "short" -> 200;
            case "long" -> 400;
            default -> 300; // medium
        };

        return String.format("""
                Generate a reading comprehension passage for %s level English learners.
                
                Topic: %s
                Length: approximately %d words
                
                Also create:
                1. 4-5 comprehension questions (mix of multiple choice and open-ended)
                2. List 5-7 important vocabulary words with definitions
                
                IMPORTANT: Return ONLY valid JSON, no markdown formatting or explanations.
                
                Format your response as JSON:
                {
                  "passage": "the text passage",
                  "questions": [
                    {
                      "type": "multiple_choice",
                      "question": "question text",
                      "options": ["A", "B", "C", "D"],
                      "correctAnswer": "the correct option",
                      "explanation": "why this is correct"
                    }
                  ],
                  "vocabulary": [
                    {
                      "word": "word",
                      "definition": "definition",
                      "example": "example sentence"
                    }
                  ]
                }
                
                Make it engaging and educational!
                """, level, topicPart, wordCount);
    }

    private ReadingPassageResponse parsePassageResponse(String aiResponse, String topic, String level) {
        try {
            log.info("Parsing AI response for reading passage");
            
            // Extract JSON from response
            String jsonString = extractJsonFromResponse(aiResponse);
            
            // Parse JSON
            JsonNode rootNode = objectMapper.readTree(jsonString);
            
            String passage = rootNode.has("passage") ? rootNode.get("passage").asText() : "";
            
            List<ReadingPassageResponse.Question> questions = new ArrayList<>();
            if (rootNode.has("questions") && rootNode.get("questions").isArray()) {
                for (JsonNode qNode : rootNode.get("questions")) {
                    ReadingPassageResponse.Question question = ReadingPassageResponse.Question.builder()
                            .type(qNode.has("type") ? qNode.get("type").asText() : "open_ended")
                            .question(qNode.has("question") ? qNode.get("question").asText() : "")
                            .options(parseStringList(qNode.get("options")))
                            .correctAnswer(qNode.has("correctAnswer") ? qNode.get("correctAnswer").asText() : "")
                            .explanation(qNode.has("explanation") ? qNode.get("explanation").asText() : "")
                            .build();
                    questions.add(question);
                }
            }
            
            List<ReadingPassageResponse.VocabularyItem> vocabulary = new ArrayList<>();
            if (rootNode.has("vocabulary") && rootNode.get("vocabulary").isArray()) {
                for (JsonNode vNode : rootNode.get("vocabulary")) {
                    ReadingPassageResponse.VocabularyItem item = ReadingPassageResponse.VocabularyItem.builder()
                            .word(vNode.has("word") ? vNode.get("word").asText() : "")
                            .definition(vNode.has("definition") ? vNode.get("definition").asText() : "")
                            .example(vNode.has("example") ? vNode.get("example").asText() : "")
                            .build();
                    vocabulary.add(item);
                }
            }
            
            log.info("Successfully parsed reading passage with {} questions and {} vocabulary items", 
                    questions.size(), vocabulary.size());
            
            return ReadingPassageResponse.builder()
                    .passage(passage)
                    .questions(questions)
                    .vocabulary(vocabulary)
                    .topic(topic)
                    .level(level)
                    .build();
                    
        } catch (Exception e) {
            log.error("Failed to parse AI response for reading passage: {}", e.getMessage());
            log.debug("AI Response snippet: {}", aiResponse.substring(0, Math.min(200, aiResponse.length())));
            return createFallbackResponse(topic, level);
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
        
        return response.trim();
    }
    
    private List<String> parseStringList(JsonNode node) {
        List<String> result = new ArrayList<>();
        if (node != null && node.isArray()) {
            for (JsonNode item : node) {
                result.add(item.asText());
            }
        }
        return result;
    }
    
    private ReadingPassageResponse createFallbackResponse(String topic, String level) {
        log.warn("Using fallback mock data for reading passage");
        
        List<ReadingPassageResponse.Question> questions = Arrays.asList(
                ReadingPassageResponse.Question.builder()
                        .type("multiple_choice")
                        .question("What is the main idea of the passage?")
                        .options(Arrays.asList("Option A", "Option B", "Option C", "Option D"))
                        .correctAnswer("Option A")
                        .explanation("The passage primarily discusses...")
                        .build()
        );

        List<ReadingPassageResponse.VocabularyItem> vocabulary = Arrays.asList(
                ReadingPassageResponse.VocabularyItem.builder()
                        .word("example")
                        .definition("A thing characteristic of its kind")
                        .example("This is an example sentence.")
                        .build()
        );

        return ReadingPassageResponse.builder()
                .passage("This is a sample reading passage. The AI response could not be parsed correctly.")
                .questions(questions)
                .vocabulary(vocabulary)
                .topic(topic)
                .level(level)
                .build();
    }
}
