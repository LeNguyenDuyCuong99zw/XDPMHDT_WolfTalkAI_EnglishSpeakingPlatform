package com.wolftalk.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho thống kê leaderboard cá nhân
 * Trả về rank và thống kê tuần hiện tại của user
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLeaderboardStatsDTO {
    private Long userId;            // ID của user
    private String firstName;       // Họ
    private String lastName;        // Tên
    private String avatar;          // Ảnh đại diện
    private Integer weeklyXp;       // XP trong tuần hiện tại
    private Integer totalXp;        // Tổng XP all time
    private Integer rank;           // Xếp hạng hiện tại
    private String tier;            // Tier hiện tại
    private String tierEmoji;       // Emoji tier
    private String league;          // League hiện tại (BRONZE, SILVER, etc.)
    private String leagueEmoji;     // Emoji league
    private Integer streak;         // Streak hiện tại
    private Integer longestStreak;  // Streak dài nhất
    private LocalDateTime weekStart; // Ngày bắt đầu tuần
    private LocalDateTime weekEnd;   // Ngày kết thúc tuần
    
    // Constructor cũ để tương thích ngược
    public UserLeaderboardStatsDTO(Long userId, String firstName, String lastName, String avatar,
                                   Integer weeklyXp, Integer rank, String tier, String tierEmoji,
                                   LocalDateTime weekStart, LocalDateTime weekEnd) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatar = avatar;
        this.weeklyXp = weeklyXp;
        this.rank = rank;
        this.tier = tier;
        this.tierEmoji = tierEmoji;
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
    }
}
