package com.wolftalk.microservices.ai.controller;

import com.wolftalk.microservices.ai.dto.ReadingPassageResponse;
import com.wolftalk.microservices.ai.service.ReadingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/reading")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReadingController {

    private final ReadingService readingService;

    @PostMapping("/generate")
    public ResponseEntity<ReadingPassageResponse> generatePassage(
            @RequestParam(required = false) String topic,
            @RequestParam(defaultValue = "intermediate") String level,
            @RequestParam(defaultValue = "medium") String length,
            @RequestParam(defaultValue = "auto") String provider) {
        
        String email = getCurrentUserEmail();
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        log.info("Generate reading passage: topic={}, level={}, length={}", topic, level, length);

        try {
            ReadingPassageResponse response = readingService.generatePassage(topic, level, length, provider);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating passage", e);
            return ResponseEntity.status(500).build();
        }
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : null;
    }
}
