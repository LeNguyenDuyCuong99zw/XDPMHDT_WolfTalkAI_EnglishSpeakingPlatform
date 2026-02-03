package com.wolftalk.microservices.ai.controller;

import com.wolftalk.microservices.ai.dto.GrammarExerciseResponse;
import com.wolftalk.microservices.ai.service.GrammarExerciseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/ai/exercises")
@RequiredArgsConstructor
public class GrammarExerciseController {

    private final GrammarExerciseService exerciseService;

    @PostMapping("/generate")
    public ResponseEntity<GrammarExerciseResponse> generateExercises(
            @RequestParam String topic,
            @RequestParam(defaultValue = "intermediate") String level,
            @RequestParam(defaultValue = "10") Integer count,
            @RequestParam(defaultValue = "auto") String provider) {
        
        String email = getCurrentUserEmail();
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        log.info("Generate exercises: topic={}, level={}, count={}", topic, level, count);

        try {
            GrammarExerciseResponse response = exerciseService.generateExercises(topic, level, count, provider);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating exercises", e);
            return ResponseEntity.status(500).build();
        }
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : null;
    }
}
