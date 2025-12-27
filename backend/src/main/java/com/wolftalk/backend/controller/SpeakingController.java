package com.wolftalk.backend.controller;

import com.wolftalk.backend.entity.SpeakingSession;
import com.wolftalk.backend.entity.SpeakingResult;
import com.wolftalk.backend.repository.SpeakingSessionRepository;
import com.wolftalk.backend.repository.SpeakingResultRepository;
import com.wolftalk.backend.service.SpeakingService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/speaking")
public class SpeakingController {

    private final SpeakingSessionRepository sessionRepo;
    private final SpeakingResultRepository resultRepo;
    private final SpeakingService speakingService;

    public SpeakingController(SpeakingSessionRepository sessionRepo,
                              SpeakingResultRepository resultRepo,
                              SpeakingService speakingService) {
        this.sessionRepo = sessionRepo;
        this.resultRepo = resultRepo;
        this.speakingService = speakingService;
    }

    @PostMapping("/start")
    public SpeakingSession start(@RequestBody SpeakingSession session) {
        session.setCreatedAt(LocalDateTime.now());
        return sessionRepo.save(session);
    }

    @PostMapping("/finish/{sessionId}")
    public SpeakingResult finish(@PathVariable Long sessionId) {
        SpeakingResult result = speakingService.generateMockResult(sessionId);
        return resultRepo.save(result);
    }
}
