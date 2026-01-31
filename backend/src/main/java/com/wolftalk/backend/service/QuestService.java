package com.wolftalk.backend.service;

import com.wolftalk.backend.dto.DailyQuestProgressDTO;
import com.wolftalk.backend.dto.MonthlyChallengeProgressDTO;
import com.wolftalk.backend.dto.QuestDashboardDTO;
import com.wolftalk.backend.entity.*;
import com.wolftalk.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service quản lý Daily Quests và Monthly Challenges
 * 
 * Features:
 * - Lấy và tạo daily quests cho user mỗi ngày
 * - Tracking progress các quest
 * - Monthly challenge với badge rewards
 * - Tự động cập nhật progress khi user làm bài
 * - Claim rewards
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class QuestService {

    private final DailyQuestRepository dailyQuestRepository;
    private final MonthlyChallengeRepository monthlyChallengeRepository;
    private final UserQuestProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;

    private static final int DAILY_QUESTS_COUNT = 3; // Số quest hằng ngày
    private static final int RESET_HOUR = 0; // Reset lúc 0:00

    // ==================== DAILY QUESTS ====================

    /**
     * Lấy daily quests của user hôm nay
     * Nếu chưa có thì tạo mới
     */
    public List<DailyQuestProgressDTO> getDailyQuests(Long userId) {
        LocalDate today = LocalDate.now();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy progress hiện có
        List<UserQuestProgress> existingProgress = progressRepository
                .findDailyProgressByUserAndDate(userId, today);

        // Nếu đã có quests cho hôm nay, trả về
        if (!existingProgress.isEmpty()) {
            return existingProgress.stream()
                    .map(p -> DailyQuestProgressDTO.fromEntities(p.getDailyQuest(), p))
                    .collect(Collectors.toList());
        }

        // Tạo quests mới cho hôm nay
        return createDailyQuestsForUser(user, today);
    }

    /**
     * Lấy daily quests by email
     */
    public List<DailyQuestProgressDTO> getDailyQuestsByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getDailyQuests(user.getId());
    }

    /**
     * Tạo daily quests cho user
     */
    private List<DailyQuestProgressDTO> createDailyQuestsForUser(User user, LocalDate date) {
        // Lấy quests ngẫu nhiên (mix các loại)
        List<DailyQuest> randomQuests = dailyQuestRepository.findRandomActiveQuests(DAILY_QUESTS_COUNT);

        // Nếu không đủ quests trong DB, tạo default quests
        if (randomQuests.isEmpty()) {
            randomQuests = createDefaultDailyQuests();
        }

        List<DailyQuestProgressDTO> result = new ArrayList<>();
        LocalDateTime expiresAt = date.plusDays(1).atStartOfDay(); // Hết hạn 0:00 ngày mai

        for (DailyQuest quest : randomQuests) {
            UserQuestProgress progress = new UserQuestProgress();
            progress.setUser(user);
            progress.setDailyQuest(quest);
            progress.setQuestDate(date);
            progress.setTargetValue(quest.getTargetValue());
            progress.setCurrentProgress(0);
            progress.setStatus(UserQuestProgress.QuestStatus.IN_PROGRESS);
            progress.setExpiresAt(expiresAt);
            progress.setRewardClaimed(false);

            UserQuestProgress saved = progressRepository.save(progress);
            result.add(DailyQuestProgressDTO.fromEntities(quest, saved));
        }

        log.info("Created {} daily quests for user {}", result.size(), user.getId());
        return result;
    }

    /**
     * Tạo default quests nếu DB trống
     */
    private List<DailyQuest> createDefaultDailyQuests() {
        List<DailyQuest> defaults = new ArrayList<>();

        // Quest 1: Kiếm XP
        DailyQuest earnXp = new DailyQuest();
        earnXp.setQuestType(DailyQuest.QuestType.EARN_XP);
        earnXp.setTitle("Kiếm 10 KN");
        earnXp.setDescription("Hoàn thành bài học để kiếm kinh nghiệm");
        earnXp.setTargetValue(10);
        earnXp.setXpReward(5);
        earnXp.setGemsReward(0);
        earnXp.setDifficulty(1);
        earnXp.setIsActive(true);
        defaults.add(dailyQuestRepository.save(earnXp));

        // Quest 2: Hoàn thành bài học
        DailyQuest completeLessons = new DailyQuest();
        completeLessons.setQuestType(DailyQuest.QuestType.COMPLETE_LESSONS);
        completeLessons.setTitle("Hoàn thành 2 bài học với độ chính xác từ 80% trở lên");
        completeLessons.setDescription("Hoàn thành bài học với độ chính xác cao");
        completeLessons.setTargetValue(2);
        completeLessons.setMinAccuracy(80);
        completeLessons.setXpReward(10);
        completeLessons.setGemsReward(0);
        completeLessons.setDifficulty(2);
        completeLessons.setIsActive(true);
        defaults.add(dailyQuestRepository.save(completeLessons));

        // Quest 3: Combo XP
        DailyQuest comboXp = new DailyQuest();
        comboXp.setQuestType(DailyQuest.QuestType.COMBO_XP);
        comboXp.setTitle("Đạt 15 KN thưởng combo");
        comboXp.setDescription("Trả lời đúng liên tiếp để nhận thưởng combo");
        comboXp.setTargetValue(15);
        comboXp.setXpReward(15);
        comboXp.setGemsReward(1);
        comboXp.setDifficulty(3);
        comboXp.setIsActive(true);
        defaults.add(dailyQuestRepository.save(comboXp));

        return defaults;
    }

    // ==================== MONTHLY CHALLENGE ====================

    /**
     * Lấy monthly challenge hiện tại của user
     */
    public MonthlyChallengeProgressDTO getCurrentMonthlyChallenge(Long userId) {
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonthValue();

        // Lấy hoặc tạo challenge cho tháng hiện tại
        MonthlyChallenge challenge = monthlyChallengeRepository
                .findByYearAndMonthAndIsActiveTrue(year, month)
                .orElseGet(() -> createMonthlyChallenge(year, month));

        // Đếm số quests đã hoàn thành trong tháng
        Long completedQuests = progressRepository
                .countCompletedDailyQuestsInMonth(userId, year, month);

        // Lấy progress của user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<UserQuestProgress> progress = progressRepository
                .findByUserAndMonthlyChallenge(user, challenge);

        return MonthlyChallengeProgressDTO.fromEntities(challenge, progress.orElse(null), completedQuests);
    }

    /**
     * Lấy monthly challenge by email
     */
    public MonthlyChallengeProgressDTO getCurrentMonthlyChallengeByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getCurrentMonthlyChallenge(user.getId());
    }

    /**
     * Tạo monthly challenge nếu chưa có
     */
    private MonthlyChallenge createMonthlyChallenge(int year, int month) {
        MonthlyChallenge challenge = new MonthlyChallenge();
        challenge.setYear(year);
        challenge.setMonth(month);
        challenge.setTitle("Nhiệm vụ " + challenge.getMonthNameVi());
        challenge.setDescription("Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo");
        challenge.setTotalQuestsRequired(30); // 30 quests/tháng
        challenge.setBadgeName("Huy hiệu " + challenge.getMonthNameVi());
        challenge.setBadgeIcon("🏆");
        challenge.setXpReward(100);
        challenge.setGemsReward(10);
        challenge.setIsActive(true);

        // Set dates
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.with(TemporalAdjusters.lastDayOfMonth());
        challenge.setStartDate(firstDay.atStartOfDay());
        challenge.setEndDate(lastDay.atTime(23, 59, 59));

        return monthlyChallengeRepository.save(challenge);
    }

    // ==================== PROGRESS UPDATE ====================

    /**
     * Cập nhật progress khi user kiếm được XP
     * Gọi từ LeaderboardService hoặc ChallengeService
     */
    public void onXpEarned(Long userId, int xpAmount) {
        LocalDate today = LocalDate.now();
        List<UserQuestProgress> progresses = progressRepository
                .findDailyProgressByUserAndDate(userId, today);

        for (UserQuestProgress progress : progresses) {
            if (progress.getDailyQuest() == null) continue;
            
            DailyQuest.QuestType type = progress.getDailyQuest().getQuestType();
            if (type == DailyQuest.QuestType.EARN_XP) {
                progress.addProgress(xpAmount);
                progressRepository.save(progress);
                log.debug("Updated EARN_XP quest progress: {} / {}", 
                    progress.getCurrentProgress(), progress.getTargetValue());
            }
        }
    }

    /**
     * Cập nhật progress khi user hoàn thành bài học
     */
    public void onLessonCompleted(Long userId, int accuracy) {
        LocalDate today = LocalDate.now();
        List<UserQuestProgress> progresses = progressRepository
                .findDailyProgressByUserAndDate(userId, today);

        for (UserQuestProgress progress : progresses) {
            if (progress.getDailyQuest() == null) continue;

            DailyQuest quest = progress.getDailyQuest();
            DailyQuest.QuestType type = quest.getQuestType();

            if (type == DailyQuest.QuestType.COMPLETE_LESSONS) {
                Integer minAccuracy = quest.getMinAccuracy();
                if (minAccuracy == null || accuracy >= minAccuracy) {
                    progress.addProgress(1);
                    progressRepository.save(progress);
                    log.debug("Updated COMPLETE_LESSONS quest progress: {} / {}",
                        progress.getCurrentProgress(), progress.getTargetValue());
                }
            } else if (type == DailyQuest.QuestType.PERFECT_LESSONS && accuracy == 100) {
                progress.addProgress(1);
                progressRepository.save(progress);
            }
        }
    }

    /**
     * Cập nhật progress khi user nhận combo XP
     */
    public void onComboXpEarned(Long userId, int comboXp) {
        LocalDate today = LocalDate.now();
        List<UserQuestProgress> progresses = progressRepository
                .findDailyProgressByUserAndDate(userId, today);

        for (UserQuestProgress progress : progresses) {
            if (progress.getDailyQuest() == null) continue;

            if (progress.getDailyQuest().getQuestType() == DailyQuest.QuestType.COMBO_XP) {
                progress.addProgress(comboXp);
                progressRepository.save(progress);
            }
        }
    }

    /**
     * Cập nhật progress khi user hoàn thành challenge
     */
    public void onChallengeCompleted(Long userId, Challenge.ChallengeType challengeType, int accuracy) {
        LocalDate today = LocalDate.now();
        List<UserQuestProgress> progresses = progressRepository
                .findDailyProgressByUserAndDate(userId, today);

        for (UserQuestProgress progress : progresses) {
            if (progress.getDailyQuest() == null) continue;

            DailyQuest quest = progress.getDailyQuest();
            if (quest.getQuestType() == DailyQuest.QuestType.CHALLENGE_TYPE) {
                // Check if it matches the target challenge type
                if (quest.getTargetChallengeType() == null || 
                    quest.getTargetChallengeType() == challengeType) {
                    progress.addProgress(1);
                    progressRepository.save(progress);
                }
            }
        }

        // Also update lesson completion
        onLessonCompleted(userId, accuracy);
    }

    // ==================== CLAIM REWARDS ====================

    /**
     * Claim reward cho quest đã hoàn thành
     */
    public QuestDashboardDTO.ClaimRewardResponse claimReward(Long userId, Long progressId) {
        UserQuestProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new RuntimeException("Quest progress not found"));

        // Validate ownership
        if (!progress.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to claim this reward");
        }

        // Check if completed
        if (!progress.isCompleted()) {
            return new QuestDashboardDTO.ClaimRewardResponse(
                false, "Quest chưa hoàn thành", 0, 0, 0, 0);
        }

        // Check if already claimed
        if (progress.getRewardClaimed()) {
            return new QuestDashboardDTO.ClaimRewardResponse(
                false, "Phần thưởng đã được nhận", 0, 0, 0, 0);
        }

        // Get rewards
        int xpReward = 0;
        int gemsReward = 0;

        if (progress.getDailyQuest() != null) {
            xpReward = progress.getDailyQuest().getXpReward();
            gemsReward = progress.getDailyQuest().getGemsReward() != null 
                ? progress.getDailyQuest().getGemsReward() : 0;
        } else if (progress.getMonthlyChallenge() != null) {
            xpReward = progress.getMonthlyChallenge().getXpReward();
            gemsReward = progress.getMonthlyChallenge().getGemsReward() != null
                ? progress.getMonthlyChallenge().getGemsReward() : 0;
        }

        // Update progress
        progress.setRewardClaimed(true);
        progress.setRewardClaimedAt(LocalDateTime.now());
        progress.setStatus(UserQuestProgress.QuestStatus.CLAIMED);
        progressRepository.save(progress);

        // Update user XP via leaderboard service
        if (xpReward > 0) {
            leaderboardService.updateWeeklyXP(progress.getUser(), xpReward);
        }

        // Update user points
        User user = progress.getUser();
        user.setPoints(user.getPoints() + xpReward);
        userRepository.save(user);

        log.info("User {} claimed reward: {} XP, {} gems", userId, xpReward, gemsReward);

        return new QuestDashboardDTO.ClaimRewardResponse(
            true, "Đã nhận phần thưởng!",
            xpReward, gemsReward,
            user.getPoints(),
            user.getStreak()
        );
    }

    /**
     * Claim reward by email
     */
    public QuestDashboardDTO.ClaimRewardResponse claimRewardByEmail(String email, Long progressId) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return claimReward(user.getId(), progressId);
    }

    // ==================== QUEST DASHBOARD ====================

    /**
     * Lấy toàn bộ Quest Dashboard cho user
     */
    public QuestDashboardDTO getQuestDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        QuestDashboardDTO dashboard = new QuestDashboardDTO();

        // Daily quests
        List<DailyQuestProgressDTO> dailyQuests = getDailyQuests(userId);
        dashboard.setDailyQuests(dailyQuests);
        dashboard.setDailyQuestsTotal(dailyQuests.size());
        dashboard.setDailyQuestsCompleted((int) dailyQuests.stream()
                .filter(q -> q.getStatus() == UserQuestProgress.QuestStatus.COMPLETED ||
                             q.getStatus() == UserQuestProgress.QuestStatus.CLAIMED)
                .count());

        // Time until reset
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nextReset = now.toLocalDate().plusDays(1).atStartOfDay();
        long hoursRemaining = Duration.between(now, nextReset).toHours();
        dashboard.setRemainingTimeHours(hoursRemaining);

        // Monthly challenge
        dashboard.setMonthlyChallenge(getCurrentMonthlyChallenge(userId));

        // User stats
        dashboard.setCurrentStreak(user.getStreak() != null ? user.getStreak() : 0);
        dashboard.setTotalXpToday(user.getTodayLearningMinutes() != null ? user.getTodayLearningMinutes() : 0); // TODO: actual XP tracking
        
        // Unclaimed rewards
        List<UserQuestProgress> unclaimed = progressRepository.findUnclaimedRewards(userId);
        dashboard.setUnclaimedRewardsCount(unclaimed.size());
        
        int pendingXp = unclaimed.stream()
                .mapToInt(p -> {
                    if (p.getDailyQuest() != null) return p.getDailyQuest().getXpReward();
                    if (p.getMonthlyChallenge() != null) return p.getMonthlyChallenge().getXpReward();
                    return 0;
                })
                .sum();
        dashboard.setPendingXpReward(pendingXp);
        
        int pendingGems = unclaimed.stream()
                .mapToInt(p -> {
                    if (p.getDailyQuest() != null) {
                        return p.getDailyQuest().getGemsReward() != null ? p.getDailyQuest().getGemsReward() : 0;
                    }
                    if (p.getMonthlyChallenge() != null) {
                        return p.getMonthlyChallenge().getGemsReward() != null ? p.getMonthlyChallenge().getGemsReward() : 0;
                    }
                    return 0;
                })
                .sum();
        dashboard.setPendingGemsReward(pendingGems);

        return dashboard;
    }

    /**
     * Lấy quest dashboard by email
     */
    public QuestDashboardDTO getQuestDashboardByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getQuestDashboard(user.getId());
    }
}
