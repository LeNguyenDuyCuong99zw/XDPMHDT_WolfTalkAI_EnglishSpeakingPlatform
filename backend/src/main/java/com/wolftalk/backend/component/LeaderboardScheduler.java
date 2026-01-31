package com.wolftalk.backend.component;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.wolftalk.backend.service.LeaderboardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Scheduled tasks cho Weekly Leaderboard
 * 
 * Tasks:
 * - resetWeeklyLeaderboard: Chạy mỗi Chủ Nhật lúc 23:59 để reset tuần mới
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class LeaderboardScheduler {

    private final LeaderboardService leaderboardService;

    /**
     * Reset weekly leaderboard mỗi Chủ Nhật lúc 23:59
     * Cron: 59 23 ? * SUN
     * 
     * Giải thích cron:
     * - 59: phút thứ 59
     * - 23: giờ thứ 23 (11 PM)
     * - ?: bất kỳ ngày nào
     * - *: bất kỳ tháng nào
     * - SUN: Chủ Nhật
     */
    @Scheduled(cron = "0 0 0 ? * MON")  // Chạy lúc 00:00 thứ Hai (sáng sớm)
    public void resetWeeklyLeaderboard() {
        try {
            log.info("===== Starting weekly leaderboard reset =====");
            leaderboardService.resetWeeklyLeaderboard();
            log.info("===== Weekly leaderboard reset completed successfully =====");
        } catch (Exception e) {
            log.error("Error resetting weekly leaderboard", e);
        }
    }

    // Optional: Scheduled task để log leaderboard stats hàng ngày (cho debugging)
    @Scheduled(cron = "0 0 12 * * ?")  // Hàng ngày lúc 12:00
    public void logLeaderboardStats() {
        log.info("===== Daily Leaderboard Stats =====");
        log.info("Leaderboard reset scheduled to run every Monday at 00:00 UTC");
    }
}
