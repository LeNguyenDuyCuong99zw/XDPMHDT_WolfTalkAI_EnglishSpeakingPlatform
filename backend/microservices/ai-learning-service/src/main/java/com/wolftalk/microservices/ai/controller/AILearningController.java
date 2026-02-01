package com.wolftalk.microservices.ai.controller;

import com.wolftalk.microservices.ai.dto.GrammarCheckResponse;
import com.wolftalk.microservices.ai.dto.PronunciationAssessmentResponse;
import com.wolftalk.microservices.ai.service.AIProviderService;
import com.wolftalk.microservices.ai.service.GrammarService;
import com.wolftalk.microservices.ai.service.PronunciationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Slf4j
public class AILearningController {
    
    private final PronunciationService pronunciationService;
    private final GrammarService grammarService;
    private final AIProviderService aiProviderService;
    
    private AIProviderService.AIProvider getProvider(String providerParam) {
        if (providerParam == null) {
            return AIProviderService.AIProvider.AUTO;
        }
        return switch (providerParam.toUpperCase()) {
            case "GEMINI" -> AIProviderService.AIProvider.GEMINI;
            default -> AIProviderService.AIProvider.AUTO;
        };
    }
    
    // Get current user email from SecurityContext (same pattern as legacy backend)
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("No authenticated user found");
            return null;
        }
        String email = authentication.getName(); // email from JWT subject
        log.info("Current user email: {}", email);
        return email;
    }
    
    @PostMapping("/pronunciation/assess")
    public ResponseEntity<PronunciationAssessmentResponse> assessPronunciation(
            @RequestParam("audio") MultipartFile audioFile,
            @RequestParam("expectedText") String expectedText) {
        
        String email = getCurrentUserEmail();
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        
        // Use dummy userId for now
        Long userId = 1L;
        try {
            PronunciationAssessmentResponse response = pronunciationService.assessPronunciation(
                    userId, audioFile, expectedText);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error assessing pronunciation: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/grammar/check")
    public ResponseEntity<GrammarCheckResponse> checkGrammar(
            @RequestBody Map<String, String> request) {
        
        String email = getCurrentUserEmail();
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        
        String text = request.get("text");
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Use dummy userId for now
        Long userId = 1L;
        try {
            GrammarCheckResponse response = grammarService.checkGrammar(userId, text);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error checking grammar: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/vocabulary/suggest")
    public ResponseEntity<List<String>> suggestVocabulary(
            @RequestParam(required = false) String provider,
            @RequestBody Map<String, String> request) {
        
        String context = request.get("context");
        String level = request.getOrDefault("level", "intermediate");
        
        try {
            List<String> suggestions = aiProviderService.suggestVocabulary(
                    context, level, getProvider(provider));
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            log.error("Error suggesting vocabulary: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/conversation/generate")
    public ResponseEntity<Map<String, String>> generateConversationResponse(
            @RequestParam(required = false) String provider,
            @RequestBody Map<String, String> request) {
        
        String userMessage = request.get("message");
        String context = request.getOrDefault("context", "general conversation");
        String difficulty = request.getOrDefault("difficulty", "intermediate");
        
        try {
            AIProviderService.AIProvider aiProvider = getProvider(provider);
            
            String response = aiProviderService.generateConversationResponse(
                    userMessage, context, difficulty, aiProvider);
            
            List<String> suggestions = aiProviderService.generateConversationSuggestions(
                    userMessage, context, aiProvider);
            
            return ResponseEntity.ok(Map.of(
                    "response", response,
                    "suggestions", String.join("\n", suggestions),
                    "provider", aiProvider.name()
            ));
        } catch (Exception e) {
            log.error("Error generating conversation: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/feedback/generate")
    public ResponseEntity<Map<String, String>> generateFeedback(
            @RequestBody Map<String, Object> request) {
        
        String text = (String) request.get("text");
        String topic = (String) request.getOrDefault("topic", "General English");
        Double score = ((Number) request.getOrDefault("score", 75.0)).doubleValue();
        
        try {
            String feedback = aiProviderService.generateDetailedFeedback(
                    text, topic, java.math.BigDecimal.valueOf(score), AIProviderService.AIProvider.AUTO);
            
            return ResponseEntity.ok(Map.of("feedback", feedback));
        } catch (Exception e) {
            log.error("Error generating feedback: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "AI Learning Service"
        ));
    }
}
