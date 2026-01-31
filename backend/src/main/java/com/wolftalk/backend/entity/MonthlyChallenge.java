package com.wolftalk.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Monthly Challenge - Thử thách hàng tháng (như trong ảnh: "Nhiệm vụ tháng Một")
 * 
 * Người dùng cần hoàn thành X nhiệm vụ trong tháng để nhận badge/huy hiệu đặc biệt
 */
@Entity
@Table(name = "monthly_challenges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // "Nhiệm vụ tháng Một"

    private String description; // "Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo"

    @Column(nullable = false)
    private Integer year; // 2026

    @Column(nullable = false)
    private Integer month; // 1-12

    @Column(nullable = false)
    private Integer totalQuestsRequired; // 30 quests

    private String badgeName; // "Huy hiệu tháng Một"

    private String badgeIcon; // Icon/emoji cho huy hiệu

    private String badgeImageUrl; // URL ảnh huy hiệu

    @Column(nullable = false)
    private Integer xpReward = 0; // XP thưởng khi hoàn thành tháng

    private Integer gemsReward = 0; // Gems thưởng

    @Column(nullable = false)
    private LocalDateTime startDate; // Ngày 1 của tháng

    @Column(nullable = false)
    private LocalDateTime endDate; // Ngày cuối của tháng

    @Column(nullable = false)
    private Boolean isActive = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Lấy tên tháng tiếng Việt
     */
    public String getMonthNameVi() {
        return switch (month) {
            case 1 -> "Tháng Một";
            case 2 -> "Tháng Hai";
            case 3 -> "Tháng Ba";
            case 4 -> "Tháng Tư";
            case 5 -> "Tháng Năm";
            case 6 -> "Tháng Sáu";
            case 7 -> "Tháng Bảy";
            case 8 -> "Tháng Tám";
            case 9 -> "Tháng Chín";
            case 10 -> "Tháng Mười";
            case 11 -> "Tháng Mười Một";
            case 12 -> "Tháng Mười Hai";
            default -> "Tháng " + month;
        };
    }

    /**
     * Lấy tên tháng tiếng Anh
     */
    public String getMonthNameEn() {
        return switch (month) {
            case 1 -> "January";
            case 2 -> "February";
            case 3 -> "March";
            case 4 -> "April";
            case 5 -> "May";
            case 6 -> "June";
            case 7 -> "July";
            case 8 -> "August";
            case 9 -> "September";
            case 10 -> "October";
            case 11 -> "November";
            case 12 -> "December";
            default -> "Month " + month;
        };
    }
}
