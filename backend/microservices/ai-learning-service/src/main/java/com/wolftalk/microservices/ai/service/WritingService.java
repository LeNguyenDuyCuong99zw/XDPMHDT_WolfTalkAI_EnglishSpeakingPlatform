package com.wolftalk.microservices.ai.service;

import com.wolftalk.microservices.ai.dto.WritingAnalysisResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WritingService {

    private final AIProviderService aiProviderService;

    public WritingAnalysisResponse analyzeWriting(String text, String type, String topic, String provider) {
        log.info("Analyzing {} writing (provider: {})", type, provider);

        String prompt = buildAnalysisPrompt(text, type, topic);
        String aiResponse = aiProviderService.getResponse(prompt, provider);

        return parseAnalysisResponse(text, aiResponse);
    }

    public String generatePrompt(String type, String topic, String level, String provider) {
        log.info("Generating {} prompt for topic: {}, level: {}", type, topic, level);

        String prompt = buildPromptGenerationRequest(type, topic, level);
        return aiProviderService.getResponse(prompt, provider);
    }

    private String buildAnalysisPrompt(String text, String type, String topic) {
        return String.format("""
                Analyze this %s writing about "%s" and provide detailed feedback in JSON format:
                
                Text: %s
                
                Provide your analysis in this exact JSON structure:
                {
                  "score": <0-100>,
                  "strengths": [list of 2-3 strengths],
                  "improvements": [list of 2-3 areas to improve],
                  "suggestions": {
                    "vocabulary": [list of vocabulary improvements],
                    "grammar": [list of grammar improvements],
                    "structure": [list of structure improvements]
                  },
                  "overallFeedback": "summary paragraph",
                  "correctedText": "corrected version of the text"
                }
                
                Be specific, constructive, and encouraging.
                """, type, topic, text);
    }

    private String buildPromptGenerationRequest(String type, String topic, String level) {
        String topicPart = (topic != null && !topic.isBlank()) ? topic : "any interesting topic";
        
        return String.format("""
                Generate a %s writing prompt suitable for %s level English learners.
                Topic area: %s
                
                The prompt should:
                - Be clear and specific
                - Include helpful context
                - Suggest a word count (150-300 words)
                - Be engaging and relevant
                
                Just return the prompt text, nothing else.
                """, type, level, topicPart);
    }

    private WritingAnalysisResponse parseAnalysisResponse(String originalText, String aiResponse) {
        try {
            // Try to extract JSON from AI response
            String jsonPart = extractJson(aiResponse);
            
            // For MVP, return a simple parsed response
            // TODO: Implement proper JSON parsing with ObjectMapper
            
            return WritingAnalysisResponse.builder()
                    .originalText(originalText)
                    .score(extractScore(aiResponse))
                    .strengths(extractList(aiResponse, "strengths"))
                    .improvements(extractList(aiResponse, "improvements"))
                    .suggestions(extractSuggestions(aiResponse))
                    .overallFeedback(extractOverallFeedback(aiResponse))
                    .correctedText(extractCorrectedText(aiResponse, originalText))
                    .build();
                    
        } catch (Exception e) {
            log.error("Error parsing analysis response", e);
            return createFallbackResponse(originalText);
        }
    }

    private String extractJson(String response) {
        int start = response.indexOf('{');
        int end = response.lastIndexOf('}');
        return (start >= 0 && end > start) ? response.substring(start, end + 1) : response;
    }

    private Integer extractScore(String response) {
        // Simple regex to find score: number between 0-100
        try {
            if (response.contains("\"score\"")) {
                String[] parts = response.split("\"score\"\\s*:\\s*");
                if (parts.length > 1) {
                    String numStr = parts[1].split("[,\\}]")[0].trim();
                    return Integer.parseInt(numStr);
                }
            }
        } catch (Exception e) {
            log.warn("Could not extract score", e);
        }
        return 75; // Default score
    }

    private List<String> extractList(String response, String key) {
        // TODO: Implement proper parsing
        return Arrays.asList(
                "Good use of vocabulary",
                "Clear structure",
                "Engaging content"
        );
    }

    private Map<String, List<String>> extractSuggestions(String response) {
        Map<String, List<String>> suggestions = new HashMap<>();
        suggestions.put("vocabulary", Arrays.asList("Consider using more advanced vocabulary"));
        suggestions.put("grammar", Arrays.asList("Check subject-verb agreement"));
        suggestions.put("structure", Arrays.asList("Add a stronger conclusion"));
        return suggestions;
    }

    private String extractOverallFeedback(String response) {
        // Try to find overall feedback in response
        if (response.contains("overallFeedback")) {
            int start = response.indexOf("\"overallFeedback\"");
            int valueStart = response.indexOf("\"", start + 17);
            int valueEnd = response.indexOf("\"", valueStart + 1);
            if (valueStart > 0 && valueEnd > valueStart) {
                return response.substring(valueStart + 1, valueEnd);
            }
        }
        return "Your writing shows good potential. Focus on the suggested improvements to enhance your skills.";
    }

    private String extractCorrectedText(String response, String original) {
        if (response.contains("correctedText")) {
            int start = response.indexOf("\"correctedText\"");
            int valueStart = response.indexOf("\"", start + 15);
            int valueEnd = response.indexOf("\"", valueStart + 1);
            if (valueStart > 0 && valueEnd > valueStart) {
                return response.substring(valueStart + 1, valueEnd);
            }
        }
        return original; // Return original if cannot extract
    }

    private WritingAnalysisResponse createFallbackResponse(String originalText) {
        Map<String, List<String>> suggestions = new HashMap<>();
        suggestions.put("vocabulary", Arrays.asList("Try using more varied vocabulary"));
        suggestions.put("grammar", Arrays.asList("Review basic grammar rules"));
        suggestions.put("structure", Arrays.asList("Organize your ideas more clearly"));

        return WritingAnalysisResponse.builder()
                .originalText(originalText)
                .score(70)
                .strengths(Arrays.asList("You completed the writing task"))
                .improvements(Arrays.asList("Focus on grammar and vocabulary"))
                .suggestions(suggestions)
                .overallFeedback("Keep practicing! Writing improves with regular practice.")
                .correctedText(originalText)
                .build();
    }
}
