package com.wolftalk.microservices.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service to manage AI provider (Google Gemini only)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AIProviderService {
    
    private final GeminiService geminiService;
    
    public enum AIProvider {
        GEMINI,
        AUTO  // For backwards compatibility, always uses Gemini
    }
    
    /**
     * Generate pronunciation suggestions using Gemini
     */
    public List<String> generatePronunciationSuggestions(
            String transcript, String expectedText, AIProvider provider) {
        try {
            return geminiService.generatePronunciationSuggestions(transcript, expectedText);
        } catch (Exception e) {
            log.error("Gemini failed for pronunciation suggestions: {}", e.getMessage());
            return List.of("Unable to generate suggestions at this time.");
        }
    }
    
    /**
     * Generate pronunciation feedback using Gemini
     */
    public String generatePronunciationFeedback(
            String transcript, String expectedText, BigDecimal score, AIProvider provider) {
        try {
            return geminiService.generatePronunciationFeedback(transcript, expectedText, score);
        } catch (Exception e) {
            log.error("Gemini failed for pronunciation feedback: {}", e.getMessage());
            return "Great effort! Keep practicing.";
        }
    }
    
    /**
     * Correct grammar using Gemini
     */
    public String correctGrammar(String text, AIProvider provider) {
        try {
            return geminiService.correctGrammar(text);
        } catch (Exception e) {
            log.error("Gemini failed for grammar correction: {}", e.getMessage());
            return text;
        }
    }
    
    /**
     * Explain grammar errors using Gemini
     */
    public List<String> explainGrammarErrors(
            String originalText, String correctedText, AIProvider provider) {
        try {
            return geminiService.explainGrammarErrors(originalText, correctedText);
        } catch (Exception e) {
            log.error("Gemini failed for grammar explanation: {}", e.getMessage());
            return List.of("Unable to explain errors at this time.");
        }
    }
    
    /**
     * Suggest vocabulary using Gemini
     */
    public List<String> suggestVocabulary(String context, String level, AIProvider provider) {
        try {
            return geminiService.suggestVocabulary(context, level);
        } catch (Exception e) {
            log.error("Gemini failed for vocabulary suggestions: {}", e.getMessage());
            return List.of("Unable to suggest vocabulary at this time.");
        }
    }
    
    /**
     * Generate conversation response using Gemini
     */
    public String generateConversationResponse(
            String userMessage, String context, String difficulty, AIProvider provider) {
        try {
            return geminiService.generateConversationResponse(userMessage, context, difficulty);
        } catch (Exception e) {
            log.error("Gemini failed for conversation response: {}", e.getMessage());
            return "I'm sorry, I'm having trouble responding right now.";
        }
    }
    
    /**
     * Generate conversation suggestions using Gemini
     */
    public List<String> generateConversationSuggestions(
            String userMessage, String context, AIProvider provider) {
        try {
            return geminiService.generateConversationSuggestions(userMessage, context);
        } catch (Exception e) {
            log.error("Gemini failed for conversation suggestions: {}", e.getMessage());
            return List.of("Unable to generate suggestions at this time.");
        }
    }
    
    /**
     * Generate detailed feedback using Gemini
     */
    public String generateDetailedFeedback(
            String studentText, String topic, BigDecimal score, AIProvider provider) {
        try {
            return geminiService.generateDetailedFeedback(studentText, topic, score);
        } catch (Exception e) {
            log.error("Gemini failed for detailed feedback: {}", e.getMessage());
            return "Keep up the good work!";
        }
    }
    
    /**
     * Generic method to get AI response with a prompt using Gemini
     * Used for new features like Writing, Reading, Grammar Exercises
     */
    public String getResponse(String prompt, String providerStr) {
        try {
            return geminiService.getGenericResponse(prompt);
        } catch (Exception e) {
            log.error("Gemini failed for generic response: {}", e.getMessage());
            return "Unable to process request at this time.";
        }
    }
    
    /**
     * Parse provider string to enum (for backwards compatibility)
     */
    private AIProvider parseProvider(String providerStr) {
        // Always return GEMINI since we only support Gemini now
        return AIProvider.GEMINI;
    }
}
