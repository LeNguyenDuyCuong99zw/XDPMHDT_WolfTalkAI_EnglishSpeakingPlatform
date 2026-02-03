package com.wolftalk.microservices.ai.controller;

import com.wolftalk.microservices.ai.dto.WritingAnalysisRequest;
import com.wolftalk.microservices.ai.dto.WritingAnalysisResponse;
import com.wolftalk.microservices.ai.service.WritingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/ai/writing")
@RequiredArgsConstructor
public class WritingController {

    private final WritingService writingService;

    @PostMapping("/analyze")
    public ResponseEntity<WritingAnalysisResponse> analyzeWriting(
            @RequestBody WritingAnalysisRequest request,
            @RequestParam(defaultValue = "auto") String provider) {
        
        String email = getCurrentUserEmail();
        if (email == null) {
            log.warn("Unauthorized writing analysis attempt");
            return ResponseEntity.status(401).build();
        }

        log.info("Writing analysis request from {}, type: {}, provider: {}", 
                email, request.getType(), provider);

        try {
            WritingAnalysisResponse response = writingService.analyzeWriting(
                    request.getText(),
                    request.getType(),
                    request.getTopic(),
                    provider
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error analyzing writing", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/generate-prompt")
    public ResponseEntity<String> generatePrompt(
            @RequestParam String type,
            @RequestParam(required = false) String topic,
            @RequestParam(defaultValue = "intermediate") String level,
            @RequestParam(defaultValue = "auto") String provider) {
        
        String email = getCurrentUserEmail();
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        log.info("Generate prompt request: type={}, topic={}, level={}", type, topic, level);

        try {
            String prompt = writingService.generatePrompt(type, topic, level, provider);
            return ResponseEntity.ok(prompt);
        } catch (Exception e) {
            log.error("Error generating prompt", e);
            return ResponseEntity.status(500).build();
        }
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : null;
    }
}
