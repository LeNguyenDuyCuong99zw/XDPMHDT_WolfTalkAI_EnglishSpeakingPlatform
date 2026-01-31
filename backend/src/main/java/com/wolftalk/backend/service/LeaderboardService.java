package com.wolftalk.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.dto.UserLeaderboardStatsDTO;
import com.wolftalk.backend.dto.WeeklyLeaderboardEntryDTO;
import com.wolftalk.backend.entity.LeaderboardEntry;
import com.wolftalk.backend.entity.ListeningChallenge;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.LeaderboardRepository;
import com.wolftalk.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service quản lý Weekly Leaderboard (Duolingo style)
 * 
 * Features:
 * - Tính toán XP theo difficulty, speed bonus, accuracy bonus
 * - Quản lý weekly entries (reset mỗi tuần)
 * - Ranking tự động
 * - Tier system (Bronze, Silver, Gold, Diamond)
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;

    /**
     * Lấy hoặc tạo weekly entry cho user trong tuần hiện tại
     */
    public LeaderboardEntry getOrCreateWeeklyEntry(User user) {
        LocalDate today = LocalDate.now();
        return getOrCreateWeeklyEntry(user, today);
    }

    /**
     * Lấy hoặc tạo weekly entry cho user trong tuần được chỉ định
     */
    public LeaderboardEntry getOrCreateWeeklyEntry(User user, LocalDate date) {
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        int weekNumber = date.get(weekFields.weekOfWeekBasedYear());
        int year = date.get(IsoFields.WEEK_BASED_YEAR);

        return leaderboardRepository.findByUserAndYearAndWeekNumber(user, year, weekNumber)
                .orElseGet(() -> {
                    LeaderboardEntry entry = new LeaderboardEntry();
                    entry.setUser(user);
                    entry.setYear(year);
                    entry.setWeekNumber(weekNumber);
                    entry.setWeeklyXp(0);
                    entry.setWeekStart(getWeekStart(date));
                    entry.setWeekEnd(getWeekEnd(date));
                    return leaderboardRepository.save(entry);
                });
    }

    /**
     * Tính toán XP dựa vào:
     * - Difficulty level (1-5)
     * - Thời gian hoàn thành (speed bonus)
     * - Độ chính xác (accuracy bonus)
     * - First try bonus
     *
     * Base XP:
     * Level 1: 10 XP
     * Level 2: 15 XP
     * Level 3: 20 XP
     * Level 4: 25 XP
     * Level 5: 30 XP
     */
    public int calculateXP(
            ListeningChallenge challenge,
            long timeTakenMs,
            boolean isCorrect,
            boolean isFirstTry,
            int accuracy) {

        if (!isCorrect) {
            return 0; // Không có XP nếu sai
        }

        // Base XP dựa vào difficulty
        int baseXP = getBaseXPForDifficulty(challenge.getDifficultyLevel());

        // Speed bonus: hoàn thành < 15s = +5 XP
        if (timeTakenMs < 15000) {
            baseXP += 5;
        }

        // Accuracy bonus: > 90% = +10 XP
        if (accuracy >= 90) {
            baseXP += 10;
        }

        // First try bonus: +5 XP
        if (isFirstTry) {
            baseXP += 5;
        }

        log.info("XP calculation - difficulty: {}, time: {}ms, accuracy: {}%, " +
                "firstTry: {}, totalXP: {}",
                challenge.getDifficultyLevel(), timeTakenMs, accuracy, isFirstTry, baseXP);

        return baseXP;
    }

    /**
     * Lấy base XP dựa vào difficulty level (1-5)
     */
    private int getBaseXPForDifficulty(Integer difficultyLevel) {
        if (difficultyLevel == null) difficultyLevel = 1;
        
        return switch (difficultyLevel) {
            case 1 -> 10;
            case 2 -> 15;
            case 3 -> 20;
            case 4 -> 25;
            case 5 -> 30;
            default -> 10;
        };
    }

    /**
     * Cập nhật weekly XP cho user by email
     */
    public LeaderboardEntry updateWeeklyXPByEmail(String email, int xpEarned) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return updateWeeklyXP(user, xpEarned);
    }

    /**
     * Cập nhật weekly XP cho user
     */
    public LeaderboardEntry updateWeeklyXP(User user, int xpEarned) {
        LeaderboardEntry entry = getOrCreateWeeklyEntry(user);
        entry.setWeeklyXp(entry.getWeeklyXp() + xpEarned);
        return leaderboardRepository.save(entry);
    }

    /**
     * Lấy top weekly leaderboard (default top 100)
     */
    public List<WeeklyLeaderboardEntryDTO> getWeeklyLeaderboard(int limit) {
        LocalDate today = LocalDate.now();
        return getWeeklyLeaderboard(today, limit);
    }

    /**
     * Lấy top weekly leaderboard cho một ngày cụ thể
     */
    public List<WeeklyLeaderboardEntryDTO> getWeeklyLeaderboard(LocalDate date, int limit) {
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        int weekNumber = date.get(weekFields.weekOfWeekBasedYear());
        int year = date.get(IsoFields.WEEK_BASED_YEAR);

        List<LeaderboardEntry> entries = leaderboardRepository
                .findWeeklyTop(year, weekNumber, limit);

        // Calculate ranks
        int rank = 1;
        int prevXP = -1;
        int sameRankCount = 0;

        List<WeeklyLeaderboardEntryDTO> result = new java.util.ArrayList<>();

        for (LeaderboardEntry entry : entries) {
            // Handle ties (nếu cùng XP thì cùng rank)
            if (entry.getWeeklyXp() != prevXP) {
                rank = rank + sameRankCount;
                sameRankCount = 0;
            } else {
                sameRankCount++;
            }

            User user = entry.getUser();
            result.add(new WeeklyLeaderboardEntryDTO(
                    rank,
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getAvatar(),
                    entry.getWeeklyXp(),
                    entry.getTier(),
                    entry.getTierEmoji(),
                    entry.getWeekStart(),
                    entry.getWeekEnd()
            ));

            prevXP = entry.getWeeklyXp();
        }

        return result;
    }

    /**
     * Lấy thống kê leaderboard cá nhân by email (rank của user trong tuần)
     */
    public UserLeaderboardStatsDTO getMyWeeklyStatsByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return getMyWeeklyStats(user.getId());
    }

    /**
     * Lấy thống kê leaderboard cá nhân (rank của user trong tuần)
     */
    public UserLeaderboardStatsDTO getMyWeeklyStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        LeaderboardEntry entry = getOrCreateWeeklyEntry(user, today);

        // Tính xếp hạng
        int rank = calculateUserRank(entry);

        UserLeaderboardStatsDTO stats = new UserLeaderboardStatsDTO(
                userId,
                user.getFirstName(),
                user.getLastName(),
                user.getAvatar(),
                entry.getWeeklyXp(),
                rank,
                entry.getTier(),
                entry.getTierEmoji(),
                entry.getWeekStart(),
                entry.getWeekEnd()
        );
        
        // Add extended stats
        stats.setTotalXp(user.getTotalXp() != null ? user.getTotalXp() : 0);
        stats.setStreak(user.getStreak() != null ? user.getStreak() : 0);
        stats.setLongestStreak(user.getLongestStreak() != null ? user.getLongestStreak() : 0);
        stats.setLeague(user.getCurrentLeague() != null ? user.getCurrentLeague() : "BRONZE");
        stats.setLeagueEmoji(user.getLeagueEmoji());
        
        return stats;
    }

    /**
     * Tính xếp hạng của user dựa vào entry hiện tại
     */
    private int calculateUserRank(LeaderboardEntry entry) {
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        LocalDate today = LocalDate.now();
        int weekNumber = today.get(weekFields.weekOfWeekBasedYear());
        int year = today.get(IsoFields.WEEK_BASED_YEAR);

        List<LeaderboardEntry> topEntries = leaderboardRepository
                .findByYearAndWeekNumberOrderByWeeklyXpDesc(year, weekNumber);

        for (int i = 0; i < topEntries.size(); i++) {
            if (topEntries.get(i).getId().equals(entry.getId())) {
                return i + 1;
            }
        }
        return topEntries.size() + 1;
    }

    /**
     * Lấy lịch sử ranking của user by email (tất cả các tuần trước đó)
     */
    public List<WeeklyLeaderboardEntryDTO> getUserLeaderboardHistoryByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return getUserLeaderboardHistory(user.getId());
    }

    /**
     * Lấy lịch sử ranking của user (tất cả các tuần trước đó)
     */
    public List<WeeklyLeaderboardEntryDTO> getUserLeaderboardHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return leaderboardRepository.findByUserOrderByYearDescWeekNumberDesc(user)
                .stream()
                .map(entry -> {
                    int rank = calculateUserRank(entry);
                    return new WeeklyLeaderboardEntryDTO(
                            rank,
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getAvatar(),
                            entry.getWeeklyXp(),
                            entry.getTier(),
                            entry.getTierEmoji(),
                            entry.getWeekStart(),
                            entry.getWeekEnd()
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * Reset leaderboard (scheduled task chạy mỗi Chủ Nhật)
     * Ghi lại history trước khi reset
     */
    @Transactional
    public void resetWeeklyLeaderboard() {
        log.info("Starting weekly leaderboard reset...");
        LocalDate today = LocalDate.now();
        
        // Lấy tất cả users
        List<User> users = userRepository.findAll();
        
        // Tạo entry cho tuần mới
        for (User user : users) {
            getOrCreateWeeklyEntry(user, today.plusDays(1)); // Tuần tới
        }
        
        log.info("Weekly leaderboard reset completed");
    }

    /**
     * Lấy ngày bắt đầu tuần (Thứ Hai)
     */
    private LocalDateTime getWeekStart(LocalDate date) {
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        LocalDate weekStart = date.with(weekFields.dayOfWeek(), 1); // Thứ Hai
        return weekStart.atStartOfDay();
    }

    /**
     * Lấy ngày kết thúc tuần (Chủ Nhật)
     */
    private LocalDateTime getWeekEnd(LocalDate date) {
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        LocalDate weekEnd = date.with(weekFields.dayOfWeek(), 7); // Chủ Nhật
        return weekEnd.atTime(23, 59, 59);
    }

}
