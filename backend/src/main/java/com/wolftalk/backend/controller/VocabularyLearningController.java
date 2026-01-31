package com.wolftalk.backend.controller;

import com.wolftalk.backend.dto.VocabularyLearningDTO;
import com.wolftalk.backend.repository.UserRepository;
import com.wolftalk.backend.service.VocabularyLearningService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vocabulary")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class VocabularyLearningController {

    private final VocabularyLearningService vocabularyService;
    private final UserRepository userRepository;

    /**
     * Get user's vocabulary level and stats
     * GET /api/vocabulary/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Long userId = getUserIdFromEmail(email);
            VocabularyLearningDTO.UserStats stats = vocabularyService.getUserStats(userId);
            
            // Return stats directly for frontend
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting vocabulary stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get available topics for user's level
     * GET /api/vocabulary/topics
     */
    @GetMapping("/topics")
    public ResponseEntity<?> getAvailableTopics(Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Long userId = getUserIdFromEmail(email);
            List<VocabularyLearningDTO.TopicInfo> topics = vocabularyService.getAvailableTopics(userId);
            
            // Return topics array directly
            return ResponseEntity.ok(topics);
        } catch (Exception e) {
            log.error("Error getting topics: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Start a learning session
     * GET /api/vocabulary/session?topic=GREETINGS&wordCount=10
     */
    @GetMapping("/session")
    public ResponseEntity<?> startLearningSession(
            @RequestParam(required = false) String topic,
            @RequestParam(defaultValue = "10") int wordCount,
            Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Long userId = getUserIdFromEmail(email);
            VocabularyLearningDTO.LearningSession session = vocabularyService.startLearningSession(userId, topic, wordCount);
            
            // Return session directly - frontend expects: { word, options, sessionType, ... }
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            log.error("Error starting learning session: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Submit answer for a vocabulary word
     * POST /api/vocabulary/answer
     * Body: { "wordId": 1, "answer": "user's selected answer" }
     */
    @PostMapping("/answer")
    public ResponseEntity<?> submitAnswer(
            @RequestBody VocabularyLearningDTO.AnswerRequest request,
            Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            
            Long userId = getUserIdFromEmail(email);
            VocabularyLearningDTO.AnswerResult result = vocabularyService.submitAnswerWithCheck(
                userId, 
                request.getWordId(), 
                request.getUserAnswer()
            );
            
            // Return result directly for frontend
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error submitting answer: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get level requirements information
     * GET /api/vocabulary/levels
     */
    @GetMapping("/levels")
    public ResponseEntity<?> getLevelRequirements() {
        Map<String, Object> levels = new HashMap<>();
        
        Map<String, Object> level1 = new HashMap<>();
        level1.put("level", 1);
        level1.put("wordsRequired", 0);
        level1.put("wordsToNextLevel", 30);
        level1.put("topics", new String[]{"GREETINGS", "FAMILY", "NUMBERS", "COLORS"});
        level1.put("description", "Cơ bản - Học 30 từ để lên level 2");
        
        Map<String, Object> level2 = new HashMap<>();
        level2.put("level", 2);
        level2.put("wordsRequired", 30);
        level2.put("wordsToNextLevel", 60);
        level2.put("topics", new String[]{"GREETINGS", "FAMILY", "NUMBERS", "COLORS", "FOOD", "ANIMALS", "BODY_PARTS"});
        level2.put("description", "Sơ cấp - Học 60 từ thêm để lên level 3");
        
        Map<String, Object> level3 = new HashMap<>();
        level3.put("level", 3);
        level3.put("wordsRequired", 90);
        level3.put("wordsToNextLevel", 100);
        level3.put("topics", new String[]{"GREETINGS", "FAMILY", "NUMBERS", "COLORS", "FOOD", "ANIMALS", "BODY_PARTS", "WEATHER", "CLOTHES", "TRANSPORTATION", "HOUSE"});
        level3.put("description", "Trung cấp - Học 100 từ thêm để lên level 4");
        
        Map<String, Object> level4 = new HashMap<>();
        level4.put("level", 4);
        level4.put("wordsRequired", 190);
        level4.put("wordsToNextLevel", 150);
        level4.put("topics", new String[]{"GREETINGS", "FAMILY", "NUMBERS", "COLORS", "FOOD", "ANIMALS", "BODY_PARTS", "WEATHER", "CLOTHES", "TRANSPORTATION", "HOUSE", "SCHOOL", "WORK", "TRAVEL", "HEALTH", "SPORTS"});
        level4.put("description", "Nâng cao - Học 150 từ thêm để lên level 5");
        
        Map<String, Object> level5 = new HashMap<>();
        level5.put("level", 5);
        level5.put("wordsRequired", 340);
        level5.put("wordsToNextLevel", 0);
        level5.put("topics", new String[]{"ALL"});
        level5.put("description", "Chuyên gia - Tất cả chủ đề");
        
        levels.put("1", level1);
        levels.put("2", level2);
        levels.put("3", level3);
        levels.put("4", level4);
        levels.put("5", level5);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("levels", levels);
        
        return ResponseEntity.ok(response);
    }

    private String extractEmail(Authentication auth) {
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        if (principal instanceof Jwt jwt) {
            return jwt.getClaimAsString("email");
        }
        return null;
    }

    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new RuntimeException("User not found"))
            .getId();
    }
}
