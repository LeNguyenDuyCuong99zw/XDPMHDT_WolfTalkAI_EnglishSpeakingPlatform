package com.wolftalk.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.MonthlyChallenge;

@Repository
public interface MonthlyChallengeRepository extends JpaRepository<MonthlyChallenge, Long> {

    /**
     * Lấy challenge của tháng hiện tại
     */
    Optional<MonthlyChallenge> findByYearAndMonthAndIsActiveTrue(Integer year, Integer month);

    /**
     * Lấy tất cả challenge đang active
     */
    List<MonthlyChallenge> findByIsActiveTrue();

    /**
     * Lấy tất cả challenge của năm
     */
    List<MonthlyChallenge> findByYear(Integer year);

    /**
     * Lấy challenge hiện tại dựa trên ngày hôm nay
     */
    @Query("SELECT mc FROM MonthlyChallenge mc WHERE mc.isActive = true " +
           "AND CURRENT_TIMESTAMP BETWEEN mc.startDate AND mc.endDate")
    Optional<MonthlyChallenge> findCurrentChallenge();
}
