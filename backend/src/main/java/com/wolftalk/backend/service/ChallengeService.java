package com.wolftalk.backend.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.dto.ChallengeDTO;
import com.wolftalk.backend.dto.ChallengeSubmissionDTO;
import com.wolftalk.backend.dto.ChallengeWeeklyProgressDTO;
import com.wolftalk.backend.entity.Challenge;
import com.wolftalk.backend.entity.ChallengeSubmission;
import com.wolftalk.backend.entity.ChallengeWeeklyProgress;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.ChallengeRepository;
import com.wolftalk.backend.repository.ChallengeSubmissionRepository;
import com.wolftalk.backend.repository.ChallengeWeeklyProgressRepository;
import com.wolftalk.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final ChallengeSubmissionRepository submissionRepository;
    private final ChallengeWeeklyProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;
    
    @Lazy
    private QuestService questService;
    
    // Setter for circular dependency
    @org.springframework.beans.factory.annotation.Autowired
    public void setQuestService(@Lazy QuestService questService) {
        this.questService = questService;
    }

    // Get challenges by type
    public List<ChallengeDTO> getChallengesByType(Challenge.ChallengeType type) {
        return challengeRepository.findByType(type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get random challenges
    public List<ChallengeDTO> getRandomChallenges(Challenge.ChallengeType type, int limit) {
        return challengeRepository.findRandomByType(type, limit)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get challenges ordered by level (progressive difficulty)
    public List<ChallengeDTO> getChallengesByLevel(Challenge.ChallengeType type, int limit) {
        return challengeRepository.findByTypeOrderByLevelAsc(type, limit)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get challenges by level range (for progressive learning)
    public List<ChallengeDTO> getChallengesByLevelRange(Challenge.ChallengeType type, int minLevel, int maxLevel, int limit) {
        return challengeRepository.findByTypeAndLevelRangeOrderByLevel(type, minLevel, maxLevel, limit)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get challenge by ID
    public ChallengeDTO getChallengeById(Long id) {
        return challengeRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    // Submit challenge answer by email
    @Transactional
    public ChallengeSubmissionDTO submitChallengeByEmail(String email, ChallengeSubmissionDTO.Request request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return submitChallenge(user.getId(), request);
    }

    // Submit challenge answer
    @Transactional
    public ChallengeSubmissionDTO submitChallenge(Long userId, ChallengeSubmissionDTO.Request request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Challenge challenge = challengeRepository.findById(request.getChallengeId())
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        // Evaluate answer
        ChallengeSubmission submission = new ChallengeSubmission();
        submission.setUser(user);
        submission.setChallenge(challenge);
        submission.setUserAnswer(request.getUserAnswer());
        submission.setTimeSpent(request.getTimeSpent());

        // Check if correct
        boolean isCorrect = evaluateAnswer(challenge, request.getUserAnswer());
        submission.setIsCorrect(isCorrect);

        // Calculate accuracy
        int accuracy = isCorrect ? 100 : 0;
        submission.setAccuracy(accuracy);

        // Check if first attempt
        long previousAttempts = submissionRepository.findByUserIdAndChallengeId(userId, challenge.getId())
                .size();
        submission.setFirstAttempt(previousAttempts == 0);

        // Calculate XP
        submission.calculateXP();

        // Save submission
        ChallengeSubmission saved = submissionRepository.save(submission);

        // Update weekly progress
        updateWeeklyProgress(user, challenge, submission);

        // Update leaderboard if XP earned
        if (saved.getXpEarned() > 0) {
            leaderboardService.updateWeeklyXP(user, saved.getXpEarned());
            
            // Update user's XP
            user.addXp(saved.getXpEarned());
            user.updateStreak();
            userRepository.save(user);
            
            // Update quest progress
            if (questService != null) {
                try {
                    questService.onXpEarned(userId, saved.getXpEarned());
                    questService.onChallengeCompleted(userId, challenge.getType(), accuracy);
                } catch (Exception e) {
                    log.warn("Failed to update quest progress: {}", e.getMessage());
                }
            }
        }

        return convertSubmissionToDTO(saved);
    }

    // Update weekly progress
    @Transactional
    private void updateWeeklyProgress(User user, Challenge challenge, ChallengeSubmission submission) {
        LocalDateTime now = LocalDateTime.now();
        int year = now.getYear();
        int weekNumber = now.get(WeekFields.of(DayOfWeek.MONDAY, 1).weekOfYear());

        Optional<ChallengeWeeklyProgress> existingProgress = progressRepository
                .findByUserIdAndChallengeTypeAndYearAndWeekNumber(
                        user.getId(), challenge.getType(), year, weekNumber);

        ChallengeWeeklyProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.setTotalAttempts(progress.getTotalAttempts() + 1);
            if (submission.getIsCorrect()) {
                progress.setCorrectAttempts(progress.getCorrectAttempts() + 1);
            }
            progress.setTotalXP(progress.getTotalXP() + (submission.getXpEarned() != null ? submission.getXpEarned() : 0));
            progress.setTotalTime(progress.getTotalTime() + (submission.getTimeSpent() != null ? submission.getTimeSpent() : 0));
        } else {
            progress = new ChallengeWeeklyProgress();
            progress.setUser(user);
            progress.setChallengeType(challenge.getType());
            progress.setYear(year);
            progress.setWeekNumber(weekNumber);
            progress.setTotalAttempts(1);
            progress.setCorrectAttempts(submission.getIsCorrect() ? 1 : 0);
            progress.setTotalXP(submission.getXpEarned() != null ? submission.getXpEarned() : 0);
            progress.setTotalTime(submission.getTimeSpent() != null ? submission.getTimeSpent() : 0);
        }

        progressRepository.save(progress);
    }

    // Get weekly progress for user by email
    public List<ChallengeWeeklyProgressDTO> getWeeklyProgressByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return getWeeklyProgress(user.getId());
    }

    // Get weekly progress for user
    public List<ChallengeWeeklyProgressDTO> getWeeklyProgress(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        int year = now.getYear();
        int weekNumber = now.get(WeekFields.of(DayOfWeek.MONDAY, 1).weekOfYear());

        return progressRepository.findByUserAndWeek(userId, year, weekNumber)
                .stream()
                .map(this::convertProgressToDTO)
                .collect(Collectors.toList());
    }

    // Get all progress for user by email
    public List<ChallengeWeeklyProgressDTO> getAllUserProgressByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return getAllUserProgress(user.getId());
    }

    // Get all progress for user
    public List<ChallengeWeeklyProgressDTO> getAllUserProgress(Long userId) {
        return progressRepository.findByUserId(userId)
                .stream()
                .map(this::convertProgressToDTO)
                .collect(Collectors.toList());
    }

    // Helper: Evaluate answer correctness
    private boolean evaluateAnswer(Challenge challenge, String userAnswer) {
        try {
            int selectedIndex = Integer.parseInt(userAnswer);
            return selectedIndex == challenge.getCorrectOptionIndex();
        } catch (NumberFormatException e) {
            // For non-multiple-choice, check if text matches (case-insensitive)
            return userAnswer.equalsIgnoreCase(challenge.getContent());
        }
    }

    // Converters
    private ChallengeDTO convertToDTO(Challenge challenge) {
        ChallengeDTO dto = new ChallengeDTO();
        dto.setId(challenge.getId());
        dto.setType(challenge.getType());
        dto.setTitle(challenge.getTitle());
        dto.setDescription(challenge.getDescription());
        dto.setContent(challenge.getContent());
        dto.setAudioUrl(challenge.getAudioUrl());
        dto.setImageUrl(challenge.getImageUrl());
        dto.setLevel(challenge.getLevel());
        dto.setLevelName(challenge.getChallengeLevel().name());
        dto.setOptions(challenge.getOptions());
        dto.setCorrectOptionIndex(challenge.getCorrectOptionIndex());
        dto.setTimeLimit(challenge.getTimeLimit());
        return dto;
    }

    private ChallengeSubmissionDTO convertSubmissionToDTO(ChallengeSubmission submission) {
        return new ChallengeSubmissionDTO(
                submission.getId(),
                submission.getChallenge().getId(),
                submission.getUserAnswer(),
                submission.getIsCorrect(),
                submission.getTimeSpent(),
                submission.getXpEarned(),
                submission.getAccuracy(),
                submission.getFirstAttempt()
        );
    }

    private ChallengeWeeklyProgressDTO convertProgressToDTO(ChallengeWeeklyProgress progress) {
        return new ChallengeWeeklyProgressDTO(
                progress.getId(),
                progress.getChallengeType(),
                progress.getYear(),
                progress.getWeekNumber(),
                progress.getTotalAttempts(),
                progress.getCorrectAttempts(),
                progress.getTotalXP(),
                progress.getTotalTime(),
                progress.getAccuracyPercentage(),
                progress.getAverageXPPerAttempt()
        );
    }
}
