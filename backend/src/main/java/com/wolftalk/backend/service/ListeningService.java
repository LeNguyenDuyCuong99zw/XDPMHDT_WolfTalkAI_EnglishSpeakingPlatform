package com.wolftalk.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.dto.LeaderboardEntryDTO;
import com.wolftalk.backend.dto.ListeningChallengeDTO;
import com.wolftalk.backend.dto.ListeningProgressDTO;
import com.wolftalk.backend.dto.ListeningSubmitDTO;
import com.wolftalk.backend.dto.ListeningTaskDTO;
import com.wolftalk.backend.entity.ListeningChallenge;
import com.wolftalk.backend.entity.ListeningChallengeProgress;
import com.wolftalk.backend.entity.ListeningTask;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.ListeningChallengeProgressRepository;
import com.wolftalk.backend.repository.ListeningChallengeRepository;
import com.wolftalk.backend.repository.ListeningTaskRepository;
import com.wolftalk.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ListeningService {

    private final ListeningChallengeRepository challengeRepository;
    private final ListeningChallengeProgressRepository progressRepository;
    private final ListeningTaskRepository taskRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;

    // Get all active challenges
    public List<ListeningChallengeDTO> getAllChallenges() {
        return challengeRepository.findByIsActiveTrueOrderByDifficultyLevelAsc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get challenges by difficulty level
    public List<ListeningChallengeDTO> getChallengesByDifficulty(Integer difficultyLevel) {
        return challengeRepository.findByDifficultyLevelAndIsActiveTrue(difficultyLevel)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get challenge details
    public ListeningChallengeDTO getChallengeById(Long challengeId) {
        return challengeRepository.findById(challengeId)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));
    }

    // Submit answer
    public ListeningProgressDTO submitAnswer(Long userId, ListeningSubmitDTO submitDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ListeningChallenge challenge = challengeRepository.findById(submitDTO.getChallengeId())
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        // Get or create progress record
        ListeningChallengeProgress progress = progressRepository
                .findByUserAndChallenge(user, challenge)
                .orElse(new ListeningChallengeProgress());

        if (progress.getId() == null) {
            progress.setUser(user);
            progress.setChallenge(challenge);
            progress.setCurrentStreak(0);
            progress.setMaxStreak(0);
        }

        // Check answer (case-insensitive, trimmed)
        String correctAnswer = challenge.getEnglishText().trim().toLowerCase();
        String userAnswer = submitDTO.getUserAnswer().trim().toLowerCase();
        
        boolean isCorrect = userAnswer.equalsIgnoreCase(correctAnswer);

        progress.setUserAnswer(submitDTO.getUserAnswer());
        progress.setAttempts(progress.getAttempts() + 1);

        if (isCorrect) {
            progress.setCorrectAttempts(progress.getCorrectAttempts() + 1);
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            
            // Calculate points with difficulty multiplier
            int points = challenge.getBasePoints() * challenge.getDifficultyLevel();
            
            // Time bonus (if completed quickly)
            if (submitDTO.getTimeTaken() < 15000) { // less than 15 seconds
                points = (int) (points * 1.2); // 20% bonus
            }
            
            progress.setPointsEarned(points);
            
            // Update streak
            LocalDate today = LocalDate.now();
            if (progress.getLastCompletedDate() == null || 
                progress.getLastCompletedDate().equals(today.minusDays(1))) {
                progress.setCurrentStreak(progress.getCurrentStreak() + 1);
                if (progress.getCurrentStreak() > progress.getMaxStreak()) {
                    progress.setMaxStreak(progress.getCurrentStreak());
                }
            } else if (!progress.getLastCompletedDate().equals(today)) {
                progress.setCurrentStreak(1);
            }
            progress.setLastCompletedDate(today);
            
            // ========== NEW: Calculate Weekly XP (Duolingo style) ==========
            // Tính accuracy dựa vào attempts
            int accuracy = 100; // Mặc định 100% nếu correct
            if (progress.getAttempts() > 1) {
                accuracy = (progress.getCorrectAttempts() * 100) / progress.getAttempts();
            }
            
            // Kiểm tra first try
            boolean isFirstTry = progress.getAttempts() == 1;
            
            // Tính XP dựa vào LeaderboardService
            int weeklyXP = leaderboardService.calculateXP(
                    challenge,
                    submitDTO.getTimeTaken(),
                    true, // isCorrect
                    isFirstTry,
                    accuracy
            );
            
            // Cập nhật Weekly XP cho user
            leaderboardService.updateWeeklyXP(user, weeklyXP);
            log.info("User {} earned {} weekly XP for challenge {}", 
                    user.getId(), weeklyXP, challenge.getId());
        }

        return toProgressDTO(progressRepository.save(progress));
    }

    // Get user progress
    public List<ListeningProgressDTO> getUserProgress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return progressRepository.findByUserOrderByCompletedAtDesc(user)
                .stream()
                .map(this::toProgressDTO)
                .collect(Collectors.toList());
    }

    // Get leaderboard
    public List<LeaderboardEntryDTO> getLeaderboard(int limit) {
        List<User> users = userRepository.findAll();
        
        List<LeaderboardEntryDTO> leaderboard = users.stream()
                .map(user -> {
                    // Calculate total points
                    Integer totalPoints = progressRepository.findByUserAndCompletedTrue(user)
                            .stream()
                            .mapToInt(ListeningChallengeProgress::getPointsEarned)
                            .sum();

                    // Get current streak
                    List<ListeningChallengeProgress> recent = progressRepository.findRecentCompleted(user);
                    int currentStreak = 0;
                    int maxStreak = 0;
                    if (!recent.isEmpty()) {
                        ListeningChallengeProgress progress = recent.get(0);
                        if (progress.getCurrentStreak() != null) {
                            currentStreak = progress.getCurrentStreak();
                        }
                        if (progress.getMaxStreak() != null) {
                            maxStreak = progress.getMaxStreak();
                        }
                    }

                    // Count completed challenges
                    Integer completedCount = progressRepository.findByUserAndCompletedTrue(user).size();

                    return new LeaderboardEntryDTO(
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getAvatar(),
                            totalPoints,
                            currentStreak,
                            maxStreak,
                            completedCount,
                            0 // Rank will be set later
                    );
                })
                .sorted(Comparator
                        .comparingInt(LeaderboardEntryDTO::getTotalPoints)
                        .thenComparingInt(LeaderboardEntryDTO::getCurrentStreak)
                        .reversed())
                .limit(limit)
                .collect(Collectors.toList());

        // Set ranks
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return leaderboard;
    }

    // Get daily tasks
    public List<ListeningTaskDTO> getDailyTasks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LocalDate today = LocalDate.now();
        List<ListeningTask> tasks = taskRepository.findDailyTasks(user, "daily", today);
        
        // If no tasks exist, create default ones
        if (tasks.isEmpty()) {
            tasks = createDailyTasks(user, today);
        }

        return tasks.stream()
                .map(this::toTaskDTO)
                .collect(Collectors.toList());
    }

    // Create daily tasks
    private List<ListeningTask> createDailyTasks(User user, LocalDate date) {
        List<ListeningTask> dailyTasks = new ArrayList<>();

        // Task 1: Complete 5 challenges
        ListeningTask task1 = new ListeningTask();
        task1.setUser(user);
        task1.setTitle("Hoàn thành 5 thử thách");
        task1.setDescription("Nghe và dịch 5 câu tiếng Anh");
        task1.setTargetPoints(5);
        task1.setRewardPoints(50);
        task1.setRewardDescription("50 điểm thưởng");
        task1.setTaskType("daily");
        task1.setDueDate(date);

        // Task 2: Complete 10 challenges
        ListeningTask task2 = new ListeningTask();
        task2.setUser(user);
        task2.setTitle("Hoàn thành 10 thử thách");
        task2.setDescription("Nghe và dịch 10 câu tiếng Anh");
        task2.setTargetPoints(10);
        task2.setRewardPoints(100);
        task2.setRewardDescription("100 điểm thưởng");
        task2.setTaskType("daily");
        task2.setDueDate(date);

        // Task 3: Maintain streak
        ListeningTask task3 = new ListeningTask();
        task3.setUser(user);
        task3.setTitle("Duy trì chuỗi học");
        task3.setDescription("Hoàn thành ít nhất 1 thử thách hôm nay");
        task3.setTargetPoints(1);
        task3.setRewardPoints(30);
        task3.setRewardDescription("30 điểm + Streak +1");
        task3.setTaskType("daily");
        task3.setDueDate(date);

        return taskRepository.saveAll(dailyTasks);
    }

    // Update task completion
    public ListeningTaskDTO completeTask(Long taskId) {
        ListeningTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setCompleted(true);
        task.setCompletedAt(LocalDateTime.now());
        
        return toTaskDTO(taskRepository.save(task));
    }

    // Helper methods
    private ListeningChallengeDTO toDTO(ListeningChallenge challenge) {
        return new ListeningChallengeDTO(
                challenge.getId(),
                challenge.getTitle(),
                challenge.getDescription(),
                challenge.getDifficultyLevel(),
                challenge.getAudioUrl(),
                challenge.getEnglishText(),
                challenge.getVietnameseText(),
                challenge.getBasePoints(),
                challenge.getCategory(),
                challenge.getDurationSeconds(),
                challenge.getIsActive(),
                challenge.getCreatedAt()
        );
    }

    private ListeningProgressDTO toProgressDTO(ListeningChallengeProgress progress) {
        return new ListeningProgressDTO(
                progress.getId(),
                progress.getChallenge().getId(),
                progress.getChallenge().getTitle(),
                progress.getCompleted(),
                progress.getAttempts(),
                progress.getCorrectAttempts(),
                progress.getPointsEarned(),
                progress.getCurrentStreak(),
                progress.getMaxStreak(),
                progress.getLastCompletedDate(),
                progress.getUserAnswer(),
                progress.getStartedAt(),
                progress.getCompletedAt()
        );
    }

    private ListeningTaskDTO toTaskDTO(ListeningTask task) {
        return new ListeningTaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getTargetPoints(),
                task.getRewardPoints(),
                task.getRewardDescription(),
                task.getCompleted(),
                task.getDueDate(),
                task.getTaskType()
        );
    }
}
