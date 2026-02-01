package com.wolftalk.backend.service;

import com.wolftalk.backend.dto.DashboardStatsDTO;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.LessonVocabularyRepository;
import com.wolftalk.backend.repository.UserUnitProgressRepository;
import com.wolftalk.backend.repository.UserRepository;
import com.wolftalk.backend.repository.UserVocabularyProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final LessonVocabularyRepository vocabRepository;
    private final UserUnitProgressRepository unitProgressRepository;
    private final UserVocabularyProgressRepository progressRepository;

    private static final ZoneOffset VIETNAM_ZONE = ZoneOffset.ofHours(7);

    @Transactional
    public DashboardStatsDTO getStats(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setStreak(user.getStreak() != null ? user.getStreak() : 0);
        stats.setPoints(user.getPoints() != null ? user.getPoints() : 0);

        // --- Handle Daily Reset for Learning Time ---
        LocalDate today = LocalDate.now(VIETNAM_ZONE);
        if (user.getLastLearningDate() == null || !user.getLastLearningDate().equals(today)) {
            user.setTodayLearningMinutes(0);
            user.setLastLearningDate(today);
            userRepository.save(user);
        }
        stats.setTodayLearningMinutes(user.getTodayLearningMinutes() != null ? user.getTodayLearningMinutes() : 0);

        // --- Units Completed (Trophy Icon) ---
        long units = unitProgressRepository.countByUserIdAndStatus(user.getId(), "completed");
        stats.setUnitsCompleted(units);

        // --- Words Learned (Combined from both sources) ---
        // 1. Words from completed lessons
        long lessonWords = vocabRepository.countLearnedWordsByUserId(user.getId());
        // 2. Words mastered from vocabulary learning system
        long masteredWords = progressRepository.countMasteredByUserId(user.getId());
        // 3. Total words = lesson words + mastered vocabulary words
        long totalWords = lessonWords + masteredWords;
        stats.setWordsLearned(totalWords);

        System.out.println("DEBUG Dashboard: Stats for " + email + ": Units=" + units + ", Minutes="
                + stats.getTodayLearningMinutes() + ", LessonWords=" + lessonWords 
                + ", MasteredWords=" + masteredWords + ", TotalWords=" + totalWords);

        return stats;
    }

    @Transactional
    public void markActivity(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Instant now = Instant.now();
        Instant last = user.getLastActiveDate();

        // Use UTC+7 (Vietnam) for day boundary consistency as per user's location
        ZoneOffset userZone = ZoneOffset.ofHours(7);
        LocalDate today = LocalDate.now(userZone);
        LocalDate lastDate = last != null ? last.atOffset(userZone).toLocalDate() : null;

        if (lastDate == null) {
            // First activity ever
            user.setStreak(1);
        } else if (lastDate.isBefore(today)) {
            if (lastDate.equals(today.minusDays(1))) {
                // Active yesterday, increment streak
                user.setStreak((user.getStreak() != null ? user.getStreak() : 0) + 1);
            } else if (lastDate.isBefore(today.minusDays(1))) {
                // Missed more than a day, reset streak
                user.setStreak(1);
            }
            // If lastDate.equals(today), streak stays same
        }

        user.setLastActiveDate(now);
        userRepository.save(user);
    }

    @Transactional
    public void incrementLearningTime(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        LocalDate today = LocalDate.now(VIETNAM_ZONE);

        if (user.getLastLearningDate() == null || !user.getLastLearningDate().equals(today)) {
            user.setTodayLearningMinutes(1);
            user.setLastLearningDate(today);
        } else {
            user.setTodayLearningMinutes(
                    (user.getTodayLearningMinutes() != null ? user.getTodayLearningMinutes() : 0) + 1);
        }

        userRepository.save(user);
        System.out.println("DEBUG: Incremented time for " + email + " to " + user.getTodayLearningMinutes() + " mins.");
    }
}
