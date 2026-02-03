package com.wolftalk.microservices.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wolftalk.microservices.ai.dto.WritingAnalysisResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class WritingService {

    private final AIProviderService aiProviderService;
    private final ObjectMapper objectMapper;

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
                
                IMPORTANT: Return ONLY valid JSON, no markdown formatting or explanations.
                
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
            log.info("Parsing AI response for writing analysis");
            
            // Extract JSON from response
            String jsonString = extractJsonFromResponse(aiResponse);
            
            // Parse JSON
            JsonNode rootNode = objectMapper.readTree(jsonString);
            
            Integer score = rootNode.has("score") ? rootNode.get("score").asInt() : 75;
            List<String> strengths = parseStringList(rootNode.get("strengths"));
            List<String> improvements = parseStringList(rootNode.get("improvements"));
            Map<String, List<String>> suggestions = parseSuggestions(rootNode.get("suggestions"));
            String overallFeedback = rootNode.has("overallFeedback") ? 
                    rootNode.get("overallFeedback").asText() : 
                    "Your writing shows good potential.";
            String correctedText = rootNode.has("correctedText") ? 
                    rootNode.get("correctedText").asText() : 
                    originalText;
            
            log.info("Successfully parsed writing analysis with score: {}", score);
            
            return WritingAnalysisResponse.builder()
                    .originalText(originalText)
                    .score(score)
                    .strengths(strengths)
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .overallFeedback(overallFeedback)
                    .correctedText(correctedText)
                    .build();
                    
        } catch (Exception e) {
            log.error("Failed to parse AI response for writing analysis: {}", e.getMessage());
            log.debug("AI Response snippet: {}", aiResponse.substring(0, Math.min(200, aiResponse.length())));
            return createFallbackResponse(originalText);
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
    
    private Map<String, List<String>> parseSuggestions(JsonNode node) {
        Map<String, List<String>> suggestions = new HashMap<>();
        
        if (node != null && node.isObject()) {
            if (node.has("vocabulary")) {
                suggestions.put("vocabulary", parseStringList(node.get("vocabulary")));
            }
            if (node.has("grammar")) {
                suggestions.put("grammar", parseStringList(node.get("grammar")));
            }
            if (node.has("structure")) {
                suggestions.put("structure", parseStringList(node.get("structure")));
            }
        }
        
        return suggestions;
    }

    private WritingAnalysisResponse createFallbackResponse(String originalText) {
        log.warn("Using fallback mock data for writing analysis");
        
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
