package com.wolftalk.backend.service;

import com.wolftalk.backend.entity.LearningProgress;
import com.wolftalk.backend.repository.LearningProgressRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ProgressService {

    private final LearningProgressRepository repo;

    public ProgressService(LearningProgressRepository repo) {
        this.repo = repo;
    }

    public LearningProgress updateProgress(Long learnerId, int score) {
        LearningProgress p = repo.findById(learnerId)
                .orElse(new LearningProgress());

        p.setLearnerId(learnerId);
        p.setTotalSessions(p.getTotalSessions() + 1);
        p.setAverageScore(
                (p.getAverageScore() + score) / p.getTotalSessions()
        );
        p.setLastPracticeDate(LocalDate.now());
        p.setStreakDays(p.getStreakDays() + 1);

        return repo.save(p);
    }
}
