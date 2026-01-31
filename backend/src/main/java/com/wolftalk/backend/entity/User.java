package com.wolftalk.backend.entity;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)
    private String password;

    private String provider; // google, facebook, local

    private String providerId;

    private String firstName;

    private String lastName;

    private String roles; // comma separated roles

    private String avatar; // link ảnh đại diện

    private String learningLanguage; // en, ja, zh

    private Boolean hasCompletedPlacementTest = false;

    private Boolean isFirstLogin = true;

    private Boolean isEnabled = true; // Để quản lý bật/tắt tài khoản

    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    // Gamification
    private Integer streak = 0;

    private Integer longestStreak = 0; // Streak dài nhất từng đạt được

    private Instant lastActiveDate;

    private Integer points = 0;

    private Integer totalXp = 0; // Tổng XP kiếm được

    private Integer todayXp = 0; // XP hôm nay

    private Integer gems = 0; // Gems/đá quý (currency phụ)

    private Integer hearts = 5; // Hearts/mạng (Duolingo style)

    private Integer todayLearningMinutes = 0;

    private LocalDate lastLearningDate;

    @Column(name = "current_league")
    private String currentLeague = "BRONZE"; // BRONZE, SILVER, GOLD, SAPPHIRE, RUBY, EMERALD, AMETHYST, PEARL, OBSIDIAN, DIAMOND

    private Integer leagueRank = 0; // Rank trong league hiện tại

    /**
     * Cập nhật streak khi user học
     */
    public void updateStreak() {
        LocalDate today = LocalDate.now();
        if (lastLearningDate == null) {
            streak = 1;
        } else if (lastLearningDate.equals(today.minusDays(1))) {
            streak++;
        } else if (!lastLearningDate.equals(today)) {
            streak = 1; // Reset streak if not consecutive
        }
        
        lastLearningDate = today;
        lastActiveDate = Instant.now();
        
        // Update longest streak
        if (streak > longestStreak) {
            longestStreak = streak;
        }
    }

    /**
     * Reset daily XP (gọi lúc 0:00)
     */
    public void resetDailyStats() {
        todayXp = 0;
        todayLearningMinutes = 0;
    }

    /**
     * Thêm XP
     */
    public void addXp(int amount) {
        if (amount > 0) {
            totalXp = (totalXp != null ? totalXp : 0) + amount;
            todayXp = (todayXp != null ? todayXp : 0) + amount;
            points = (points != null ? points : 0) + amount;
        }
    }

    /**
     * Lấy league emoji
     */
    public String getLeagueEmoji() {
        if (currentLeague == null) return "🥉";
        return switch (currentLeague) {
            case "DIAMOND" -> "💎";
            case "OBSIDIAN" -> "⬛";
            case "PEARL" -> "⚪";
            case "AMETHYST" -> "💜";
            case "EMERALD" -> "💚";
            case "RUBY" -> "❤️";
            case "SAPPHIRE" -> "💙";
            case "GOLD" -> "🥇";
            case "SILVER" -> "🥈";
            default -> "🥉"; // BRONZE
        };
    }

}
