package com.wolftalk.microservices.ai.service;

import com.wolftalk.microservices.ai.dto.ReadingPassageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReadingService {

    private final AIProviderService aiProviderService;

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
        // For MVP, return sample data
        // TODO: Implement proper JSON parsing
        
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
                .passage(extractPassage(aiResponse))
                .questions(questions)
                .vocabulary(vocabulary)
                .topic(topic)
                .level(level)
                .build();
    }

    private String extractPassage(String response) {
        // Try to extract passage from JSON or return trimmed response
        if (response.contains("\"passage\"")) {
            int start = response.indexOf("\"passage\"");
            int valueStart = response.indexOf("\"", start + 10);
            int valueEnd = response.indexOf("\"", valueStart + 1);
            if (valueStart > 0 && valueEnd > valueStart) {
                return response.substring(valueStart + 1, valueEnd);
            }
        }
        // Fallback: return first 300 words or full response
        return response.length() > 500 ? response.substring(0, 500) + "..." : response;
    }
}
