package com.wolftalk.backend.controller;

import com.wolftalk.backend.entity.LearningProgress;
import com.wolftalk.backend.repository.LearningProgressRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final LearningProgressRepository repo;

    public ProgressController(LearningProgressRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{learnerId}")
    public LearningProgress get(@PathVariable Long learnerId) {
        return repo.findById(learnerId).orElse(null);
    }
}
