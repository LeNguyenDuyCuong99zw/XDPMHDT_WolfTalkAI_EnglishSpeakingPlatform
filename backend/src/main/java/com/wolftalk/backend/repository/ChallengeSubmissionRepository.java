package com.wolftalk.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.ChallengeSubmission;

@Repository
public interface ChallengeSubmissionRepository extends JpaRepository<ChallengeSubmission, Long> {
    List<ChallengeSubmission> findByUserId(Long userId);

    List<ChallengeSubmission> findByChallengeId(Long challengeId);

    List<ChallengeSubmission> findByUserIdAndChallengeId(Long userId, Long challengeId);

    @Query("SELECT cs FROM ChallengeSubmission cs WHERE cs.user.id = :userId AND cs.submittedAt >= :startDate AND cs.submittedAt <= :endDate")
    List<ChallengeSubmission> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(cs) FROM ChallengeSubmission cs WHERE cs.user.id = :userId AND cs.challenge.type = :type AND cs.submittedAt >= :startDate")
    Integer countByUserAndTypeAndDateAfter(@Param("userId") Long userId, @Param("type") com.wolftalk.backend.entity.Challenge.ChallengeType type, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT SUM(cs.xpEarned) FROM ChallengeSubmission cs WHERE cs.user.id = :userId AND cs.challenge.type = :type AND cs.submittedAt >= :startDate")
    Integer sumXPByUserAndTypeAndDateAfter(@Param("userId") Long userId, @Param("type") com.wolftalk.backend.entity.Challenge.ChallengeType type, @Param("startDate") LocalDateTime startDate);
}
