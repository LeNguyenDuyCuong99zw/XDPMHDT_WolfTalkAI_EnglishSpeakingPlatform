package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.ChallengeWeeklyProgress;
import com.wolftalk.backend.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeWeeklyProgressRepository extends JpaRepository<ChallengeWeeklyProgress, Long> {
    Optional<ChallengeWeeklyProgress> findByUserIdAndChallengeTypeAndYearAndWeekNumber(
            Long userId, Challenge.ChallengeType type, Integer year, Integer week);

    List<ChallengeWeeklyProgress> findByUserId(Long userId);

    List<ChallengeWeeklyProgress> findByUserIdAndChallengeType(Long userId, Challenge.ChallengeType type);

    @Query("SELECT cwp FROM ChallengeWeeklyProgress cwp WHERE cwp.user.id = :userId AND cwp.year = :year AND cwp.weekNumber = :week")
    List<ChallengeWeeklyProgress> findByUserAndWeek(@Param("userId") Long userId, @Param("year") Integer year, @Param("week") Integer week);
}
