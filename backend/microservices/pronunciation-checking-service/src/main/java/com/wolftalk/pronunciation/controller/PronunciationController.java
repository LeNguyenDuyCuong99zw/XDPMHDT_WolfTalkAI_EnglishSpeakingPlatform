package com.wolftalk.pronunciation.controller;

import com.wolftalk.pronunciation.dto.PronunciationCheckResponse;
import com.wolftalk.pronunciation.entity.PronunciationAttempt;
import com.wolftalk.pronunciation.service.PronunciationAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pronunciation")
@RequiredArgsConstructor
@Slf4j
public class PronunciationController {
    
    private final PronunciationAnalysisService pronunciationService;
    
    /**
     * Check pronunciation from audio file
     */
    @PostMapping("/check")
    public ResponseEntity<PronunciationCheckResponse> checkPronunciation(
            @RequestParam("audio") MultipartFile audioFile,
            @RequestParam("expectedText") String expectedText) {
        
        try {
            // Get current user email from JWT
            String userEmail = getCurrentUserEmail();
            Long userId = getCurrentUserId();
            
            log.info("Pronunciation check request - User: {}, Email: {}, Expected: {}", userId, userEmail, expectedText);
            
            PronunciationCheckResponse response = pronunciationService.checkPronunciation(
                    userId, userEmail, audioFile, expectedText);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error checking pronunciation", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get pronunciation history for current user
     */
    @GetMapping("/history")
    public ResponseEntity<List<PronunciationAttempt>> getHistory() {
        try {
            Long userId = getCurrentUserId();
            List<PronunciationAttempt> history = pronunciationService.getUserHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching history", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Get pronunciation history for specific user
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<PronunciationAttempt>> getUserHistory(@PathVariable Long userId) {
        try {
            List<PronunciationAttempt> history = pronunciationService.getUserHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching user history", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Pronunciation service is running");
    }
    
    /**
     * Get current user ID from security context
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("No authenticated user found, using default userId");
            return 1L; // Default user for testing
        }
        
        // In production, extract userId from JWT token
        // For now, return dummy userId
        return 1L;
    }
    
    /**
     * Get current user email from JWT
     */
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("No authenticated user found");
            return null;
        }
        
        // Extract email from JWT principal (set by JwtAuthenticationFilter)
        Object principal = authentication.getPrincipal();
        if (principal instanceof String) {
            return (String) principal; // Email is stored as principal
        }
        
        return null;
    }
}
