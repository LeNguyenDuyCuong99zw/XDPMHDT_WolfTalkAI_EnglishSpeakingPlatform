package com.wolftalk.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.ListeningChallenge;

@Repository
public interface ListeningChallengeRepository extends JpaRepository<ListeningChallenge, Long> {
    
    List<ListeningChallenge> findByIsActiveTrueOrderByDifficultyLevelAsc();
    
    List<ListeningChallenge> findByDifficultyLevelAndIsActiveTrue(Integer difficultyLevel);
    
    List<ListeningChallenge> findByCategoryAndIsActiveTrueOrderByCreatedAtDesc(String category);
    
    @Query("SELECT lc FROM ListeningChallenge lc WHERE lc.isActive = true ORDER BY lc.difficultyLevel ASC LIMIT ?1")
    List<ListeningChallenge> findRandomChallenges(int limit);
}
