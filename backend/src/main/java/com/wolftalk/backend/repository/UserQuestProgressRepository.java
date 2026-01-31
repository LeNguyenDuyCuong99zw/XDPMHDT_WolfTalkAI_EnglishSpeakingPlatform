package com.wolftalk.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.DailyQuest;
import com.wolftalk.backend.entity.MonthlyChallenge;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.entity.UserQuestProgress;

@Repository
public interface UserQuestProgressRepository extends JpaRepository<UserQuestProgress, Long> {

    /**
     * Lấy progress của user cho daily quest hôm nay
     */
    Optional<UserQuestProgress> findByUserAndDailyQuestAndQuestDate(
            User user, DailyQuest dailyQuest, LocalDate questDate);

    /**
     * Lấy progress của user cho một daily quest theo ID
     */
    @Query("SELECT uqp FROM UserQuestProgress uqp WHERE uqp.user.id = :userId " +
           "AND uqp.dailyQuest.id = :questId AND uqp.questDate = :questDate")
    Optional<UserQuestProgress> findByUserIdAndDailyQuestIdAndDate(
            @Param("userId") Long userId, 
            @Param("questId") Long questId, 
            @Param("questDate") LocalDate questDate);

    /**
     * Lấy tất cả daily quest progress của user hôm nay
     */
    @Query("SELECT uqp FROM UserQuestProgress uqp WHERE uqp.user.id = :userId " +
           "AND uqp.questDate = :questDate AND uqp.dailyQuest IS NOT NULL")
    List<UserQuestProgress> findDailyProgressByUserAndDate(
            @Param("userId") Long userId, 
            @Param("questDate") LocalDate questDate);

    /**
     * Lấy progress của user cho monthly challenge
     */
    Optional<UserQuestProgress> findByUserAndMonthlyChallenge(User user, MonthlyChallenge monthlyChallenge);

    /**
     * Lấy monthly challenge progress theo user ID
     */
    @Query("SELECT uqp FROM UserQuestProgress uqp WHERE uqp.user.id = :userId " +
           "AND uqp.monthlyChallenge.id = :challengeId")
    Optional<UserQuestProgress> findByUserIdAndMonthlyChallengeId(
            @Param("userId") Long userId, 
            @Param("challengeId") Long challengeId);

    /**
     * Lấy tất cả quest đã hoàn thành của user trong tháng (cho monthly challenge)
     */
    @Query("SELECT COUNT(uqp) FROM UserQuestProgress uqp WHERE uqp.user.id = :userId " +
           "AND uqp.dailyQuest IS NOT NULL " +
           "AND uqp.status = 'COMPLETED' " +
           "AND MONTH(uqp.questDate) = :month AND YEAR(uqp.questDate) = :year")
    Long countCompletedDailyQuestsInMonth(
            @Param("userId") Long userId, 
            @Param("year") int year, 
            @Param("month") int month);

    /**
     * Lấy các quest chưa nhận thưởng
     */
    @Query("SELECT uqp FROM UserQuestProgress uqp WHERE uqp.user.id = :userId " +
           "AND uqp.status = 'COMPLETED' AND uqp.rewardClaimed = false")
    List<UserQuestProgress> findUnclaimedRewards(@Param("userId") Long userId);

    /**
     * Đếm số streak days liên tiếp hoàn thành ít nhất 1 quest
     * Sử dụng JPQL thay vì native query để tương thích với nhiều DB
     */
    @Query("SELECT COUNT(DISTINCT uqp.questDate) FROM UserQuestProgress uqp " +
           "WHERE uqp.user.id = :userId AND uqp.status = 'COMPLETED' " +
           "AND uqp.questDate >= :startDate")
    Long countStreakDays(@Param("userId") Long userId, @Param("startDate") java.time.LocalDate startDate);

    /**
     * Lấy lịch sử quest của user
     */
    @Query("SELECT uqp FROM UserQuestProgress uqp WHERE uqp.user.id = :userId " +
           "ORDER BY uqp.questDate DESC, uqp.createdAt DESC")
    List<UserQuestProgress> findUserQuestHistory(@Param("userId") Long userId);
}
