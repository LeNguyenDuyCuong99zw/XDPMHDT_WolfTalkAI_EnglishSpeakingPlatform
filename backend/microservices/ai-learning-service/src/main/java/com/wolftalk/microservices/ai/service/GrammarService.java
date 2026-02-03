package com.wolftalk.microservices.ai.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wolftalk.microservices.ai.dto.GrammarCheckResponse;
import com.wolftalk.microservices.ai.entity.GrammarCheck;
import com.wolftalk.microservices.ai.repository.GrammarCheckRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GrammarService {
    
    private final GrammarCheckRepository grammarCheckRepository;
    private final AIProviderService aiProviderService;
    private final ObjectMapper objectMapper;
    
    public GrammarCheckResponse checkGrammar(Long userId, String text) {
        log.info("Checking grammar for user: {}", userId);
        
        // Step 1: Get corrected text using AUTO provider
        String correctedText = aiProviderService.correctGrammar(text, AIProviderService.AIProvider.AUTO);
        
        // Step 2: Get error explanations
        List<String> errorExplanations = aiProviderService.explainGrammarErrors(
                text, correctedText, AIProviderService.AIProvider.AUTO);
        
        // Step 3: Parse errors into structured format
        List<GrammarCheckResponse.GrammarError> errors = parseGrammarErrors(errorExplanations, text, correctedText);
        
        // Step 4: Generate suggestions
        List<String> suggestions = generateSuggestions(errors);
        
        // Step 5: Generate overall feedback
        String overallFeedback = aiProviderService.generateDetailedFeedback(
                text, 
                "Grammar and Writing", 
                calculateGrammarScore(text, correctedText),
                AIProviderService.AIProvider.AUTO
        );
        
        // Step 6: Save to database
        try {
            GrammarCheck grammarCheck = GrammarCheck.builder()
                    .userId(userId)
                    .originalText(text)
                    .correctedText(correctedText)
                    .errors(objectMapper.writeValueAsString(errors))
                    .suggestions(objectMapper.writeValueAsString(suggestions))
                    .build();
            
            grammarCheck = grammarCheckRepository.save(grammarCheck);
            
            // Calculate similarity score
            double similarity = calculateSimilarity(text, correctedText);
            double similarityScore = similarity * 100.0;
            
            // Step 7: Build response
            return GrammarCheckResponse.builder()
                    .checkId(grammarCheck.getId())
                    .originalText(text)
                    .correctedText(correctedText)
                    .errors(errors)
                    .suggestions(suggestions)
                    .errorCount(errors.size())
                    .overallFeedback(overallFeedback)
                    .similarityScore(similarityScore)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error saving grammar check: {}", e.getMessage(), e);
            
            // Calculate similarity score for error response too
            double similarity = calculateSimilarity(text, correctedText);
            double similarityScore = similarity * 100.0;
            
            return GrammarCheckResponse.builder()
                    .originalText(text)
                    .correctedText(correctedText)
                    .errors(errors)
                    .suggestions(suggestions)
                    .errorCount(errors.size())
                    .overallFeedback(overallFeedback)
                    .similarityScore(similarityScore)
                    .build();
        }
    }
    
    private List<GrammarCheckResponse.GrammarError> parseGrammarErrors(
            List<String> explanations, String original, String corrected) {
        
        List<GrammarCheckResponse.GrammarError> errors = new ArrayList<>();
        
        for (String explanation : explanations) {
            if (explanation.trim().isEmpty()) continue;
            
            try {
                // Try to parse JSON format from Gemini
                if (explanation.trim().startsWith("{")) {
                    var errorNode = objectMapper.readTree(explanation);
                    
                    String incorrectText = errorNode.has("incorrectText") 
                            ? errorNode.get("incorrectText").asText() 
                            : "";
                    String correctText = errorNode.has("correctText") 
                            ? errorNode.get("correctText").asText() 
                            : "";
                    String explanationText = errorNode.has("explanation") 
                            ? errorNode.get("explanation").asText() 
                            : explanation;
                    
                    // Find position of the error in original text
                    int position = original.toLowerCase().indexOf(incorrectText.toLowerCase());
                    
                    GrammarCheckResponse.GrammarError error = GrammarCheckResponse.GrammarError.builder()
                            .type("grammar")
                            .message(explanationText)
                            .incorrectText(incorrectText)
                            .correctText(correctText)
                            .position(position >= 0 ? position : 0)
                            .explanation(explanationText)
                            .build();
                    
                    errors.add(error);
                } else {
                    // Fallback for non-JSON format
                    GrammarCheckResponse.GrammarError error = GrammarCheckResponse.GrammarError.builder()
                            .type("grammar")
                            .message(explanation)
                            .incorrectText(original)
                            .correctText(corrected)
                            .position(0)
                            .explanation(explanation)
                            .build();
                    
                    errors.add(error);
                }
            } catch (Exception e) {
                log.warn("Failed to parse error explanation: {}", explanation, e);
                // Add as plain text error
                GrammarCheckResponse.GrammarError error = GrammarCheckResponse.GrammarError.builder()
                        .type("grammar")
                        .message(explanation)
                        .incorrectText(original)
                        .correctText(corrected)
                        .position(0)
                        .explanation(explanation)
                        .build();
                
                errors.add(error);
            }
        }
        
        return errors;
    }
    
    private List<String> generateSuggestions(List<GrammarCheckResponse.GrammarError> errors) {
        List<String> suggestions = new ArrayList<>();
        
        if (errors.isEmpty()) {
            suggestions.add("Great job! Your grammar is excellent.");
        } else {
            suggestions.add("Review the corrections and try to understand the patterns.");
            suggestions.add("Practice writing similar sentences with correct grammar.");
            suggestions.add("Read the explanations carefully to avoid similar mistakes.");
        }
        
        return suggestions;
    }
    
    private java.math.BigDecimal calculateGrammarScore(String original, String corrected) {
        // Simple similarity score
        double similarity = calculateSimilarity(original, corrected);
        return java.math.BigDecimal.valueOf(similarity * 100)
                .setScale(2, java.math.RoundingMode.HALF_UP);
    }
    
    private double calculateSimilarity(String s1, String s2) {
        int maxLength = Math.max(s1.length(), s2.length());
        if (maxLength == 0) return 1.0;
        
        int distance = levenshteinDistance(s1, s2);
        return 1.0 - ((double) distance / maxLength);
    }
    
    private int levenshteinDistance(String s1, String s2) {
        int[][] dp = new int[s1.length() + 1][s2.length() + 1];
        
        for (int i = 0; i <= s1.length(); i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= s2.length(); j++) {
            dp[0][j] = j;
        }
        
        for (int i = 1; i <= s1.length(); i++) {
            for (int j = 1; j <= s2.length(); j++) {
                int cost = s1.charAt(i - 1) == s2.charAt(j - 1) ? 0 : 1;
                dp[i][j] = Math.min(Math.min(
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1),
                        dp[i - 1][j - 1] + cost
                );
            }
        }
        
        return dp[s1.length()][s2.length()];
    }
}
