package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO cho Weekly Leaderboard Entry
 * Chứa đầy đủ thông tin để hiển thị bảng xếp hạng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyLeaderboardEntryDTO {
    private Integer rank;           // Xếp hạng (1, 2, 3, ...)
    private Long userId;            // ID của user
    private String firstName;       // Họ
    private String lastName;        // Tên
    private String avatar;          // Ảnh đại diện
    private Integer weeklyXp;       // XP trong tuần hiện tại
    private String tier;            // Tier (BRONZE, SILVER, GOLD, DIAMOND)
    private String tierEmoji;       // Emoji tier (⬜, 🥈, 🥇, 💎)
    private LocalDateTime weekStart; // Ngày bắt đầu tuần
    private LocalDateTime weekEnd;   // Ngày kết thúc tuần
}
