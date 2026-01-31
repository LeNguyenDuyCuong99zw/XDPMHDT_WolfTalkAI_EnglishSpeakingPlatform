package com.wolftalk.backend.component;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Scheduler cho hệ thống Quest
 * 
 * - Reset daily stats lúc 0:00 mỗi ngày
 * - Check và expire các quests hết hạn
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class QuestScheduler {

    private final UserRepository userRepository;

    /**
     * Reset daily stats cho tất cả users lúc 0:00 mỗi ngày
     * Cron: second, minute, hour, day of month, month, day of week
     */
    @Scheduled(cron = "0 0 0 * * *") // 0:00 mỗi ngày
    @Transactional
    public void resetDailyStats() {
        log.info("Starting daily stats reset...");
        
        try {
            List<User> users = userRepository.findAll();
            int resetCount = 0;
            
            for (User user : users) {
                user.resetDailyStats();
                resetCount++;
            }
            
            userRepository.saveAll(users);
            log.info("Daily stats reset completed for {} users", resetCount);
            
        } catch (Exception e) {
            log.error("Error resetting daily stats", e);
        }
    }

    /**
     * Check streak và reset nếu user không học trong 1 ngày
     * Chạy lúc 1:00 sáng mỗi ngày (sau khi reset daily stats)
     */
    @Scheduled(cron = "0 0 1 * * *") // 1:00 mỗi ngày
    @Transactional
    public void checkAndResetStreaks() {
        log.info("Checking streaks...");
        
        try {
            LocalDate yesterday = LocalDate.now().minusDays(1);
            List<User> users = userRepository.findAll();
            int resetCount = 0;
            
            for (User user : users) {
                // Nếu user không học hôm qua và hôm nay, reset streak
                if (user.getLastLearningDate() != null && 
                    user.getLastLearningDate().isBefore(yesterday)) {
                    user.setStreak(0);
                    resetCount++;
                }
            }
            
            userRepository.saveAll(users);
            log.info("Streak check completed. Reset {} streaks", resetCount);
            
        } catch (Exception e) {
            log.error("Error checking streaks", e);
        }
    }

    /**
     * Log thống kê hàng ngày lúc 23:59
     */
    @Scheduled(cron = "0 59 23 * * *") // 23:59 mỗi ngày
    public void logDailyStats() {
        log.info("=== Daily Stats Summary ===");
        
        try {
            long totalUsers = userRepository.count();
            log.info("Total users: {}", totalUsers);
            
            // TODO: Add more stats like active users, completed quests, etc.
            
        } catch (Exception e) {
            log.error("Error logging daily stats", e);
        }
    }
}
