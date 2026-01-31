package com.wolftalk.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wolftalk.backend.dto.ChallengeDTO;
import com.wolftalk.backend.dto.ChallengeSubmissionDTO;
import com.wolftalk.backend.dto.ChallengeWeeklyProgressDTO;
import com.wolftalk.backend.entity.Challenge;
import com.wolftalk.backend.service.ChallengeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChallengeController {

    private final ChallengeService challengeService;

    /**
     * Get challenges by type
     * GET /api/challenges/type/{type}
     * Types: LISTENING, SPEAKING, READING, WRITING, VOCABULARY, GRAMMAR
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<?> getChallengesByType(@PathVariable String type) {
        try {
            Challenge.ChallengeType challengeType = Challenge.ChallengeType.valueOf(type.toUpperCase());
            List<ChallengeDTO> challenges = challengeService.getChallengesByType(challengeType);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("challenges", challenges);
            response.put("count", challenges.size());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid challenge type: " + type);
        }
    }

    /**
     * Get random challenges of a type
     * GET /api/challenges/random/{type}?limit=5
     */
    @GetMapping("/random/{type}")
    public ResponseEntity<?> getRandomChallenges(
            @PathVariable String type,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            Challenge.ChallengeType challengeType = Challenge.ChallengeType.valueOf(type.toUpperCase());
            List<ChallengeDTO> challenges = challengeService.getRandomChallenges(challengeType, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("challenges", challenges);
            response.put("count", challenges.size());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid challenge type: " + type);
        }
    }

    /**
     * Get challenges by type ordered by level (progressive difficulty)
     * GET /api/challenges/progressive/{type}?limit=5
     * Returns challenges from level 1 to higher levels
     */
    @GetMapping("/progressive/{type}")
    public ResponseEntity<?> getProgressiveChallenges(
            @PathVariable String type,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            Challenge.ChallengeType challengeType = Challenge.ChallengeType.valueOf(type.toUpperCase());
            List<ChallengeDTO> challenges = challengeService.getChallengesByLevel(challengeType, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("challenges", challenges);
            response.put("count", challenges.size());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid challenge type: " + type);
        }
    }
    
    /**
     * Get challenges by type and level range
     * GET /api/challenges/level-range/{type}?minLevel=1&maxLevel=3&limit=5
     */
    @GetMapping("/level-range/{type}")
    public ResponseEntity<?> getChallengesByLevelRange(
            @PathVariable String type,
            @RequestParam(defaultValue = "1") int minLevel,
            @RequestParam(defaultValue = "5") int maxLevel,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            Challenge.ChallengeType challengeType = Challenge.ChallengeType.valueOf(type.toUpperCase());
            List<ChallengeDTO> challenges = challengeService.getChallengesByLevelRange(challengeType, minLevel, maxLevel, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("challenges", challenges);
            response.put("count", challenges.size());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid challenge type: " + type);
        }
    }

    /**
     * Get challenge by ID
     * GET /api/challenges/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getChallengeById(@PathVariable Long id) {
        ChallengeDTO challenge = challengeService.getChallengeById(id);
        if (challenge == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(challenge);
    }

    /**
     * Submit challenge answer
     * POST /api/challenges/submit
     * Body: { "challengeId": 1, "userAnswer": "0", "timeSpent": 30 }
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitChallenge(
            @RequestBody ChallengeSubmissionDTO.Request request,
            Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            ChallengeSubmissionDTO submission = challengeService.submitChallengeByEmail(email, request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("submission", submission);
            response.put("message", "Challenge submitted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error submitting challenge", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /**
     * Get weekly progress for current week
     * GET /api/challenges/progress/weekly
     */
    @GetMapping("/progress/weekly")
    public ResponseEntity<?> getWeeklyProgress(Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            List<ChallengeWeeklyProgressDTO> progress = challengeService.getWeeklyProgressByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progress", progress);
            response.put("count", progress.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting weekly progress", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /**
     * Get all progress history
     * GET /api/challenges/progress/history
     */
    @GetMapping("/progress/history")
    public ResponseEntity<?> getAllProgress(Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            List<ChallengeWeeklyProgressDTO> progress = challengeService.getAllUserProgressByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progress", progress);
            response.put("count", progress.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting progress history", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // Extract email from authentication
    private String extractEmail(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof Jwt) {
            return ((Jwt) principal).getClaimAsString("email");
        }

        return null;
    }

    // Extract user ID from authentication
    private Long extractUserId(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof Jwt) {
            String userId = ((Jwt) principal).getClaimAsString("sub");
            try {
                return Long.parseLong(userId);
            } catch (NumberFormatException e) {
                return null;
            }
        }

        return null;
    }
}
