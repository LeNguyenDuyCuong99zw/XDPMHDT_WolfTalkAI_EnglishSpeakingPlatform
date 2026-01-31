package com.wolftalk.backend.entity;

import java.time.Instant;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "leaderboard_entries",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "year", "week_number"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer weekNumber; // Week số mấy trong năm (1-53)

    @Column(nullable = false)
    private Integer year; // Năm (e.g., 2026)

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer weeklyXp = 0; // XP trong tuần hiện tại

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer rank = 0; // Xếp hạng trong tuần

    @Column(nullable = false)
    private LocalDateTime weekStart; // Ngày bắt đầu tuần (Thứ 2)

    @Column(nullable = false)
    private LocalDateTime weekEnd; // Ngày kết thúc tuần (Chủ Nhật)

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    /**
     * Lấy tier dựa vào weekly XP
     * ⬜ Bronze (0-100)
     * 🥈 Silver (100-300)
     * 🥇 Gold (300-500)
     * 💎 Diamond (500+)
     */
    public String getTier() {
        if (weeklyXp >= 500) {
            return "DIAMOND";
        } else if (weeklyXp >= 300) {
            return "GOLD";
        } else if (weeklyXp >= 100) {
            return "SILVER";
        } else {
            return "BRONZE";
        }
    }

    public String getTierEmoji() {
        switch (getTier()) {
            case "DIAMOND":
                return "💎";
            case "GOLD":
                return "🥇";
            case "SILVER":
                return "🥈";
            case "BRONZE":
            default:
                return "⬜";
        }
    }

}
