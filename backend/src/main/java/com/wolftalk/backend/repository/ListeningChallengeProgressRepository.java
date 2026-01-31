package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.ListeningChallengeProgress;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.entity.ListeningChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ListeningChallengeProgressRepository extends JpaRepository<ListeningChallengeProgress, Long> {
    
    Optional<ListeningChallengeProgress> findByUserAndChallenge(User user, ListeningChallenge challenge);
    
    List<ListeningChallengeProgress> findByUserOrderByCompletedAtDesc(User user);
    
    List<ListeningChallengeProgress> findByUserAndCompletedTrue(User user);
    
    @Query("SELECT lcp FROM ListeningChallengeProgress lcp WHERE lcp.user = ?1 AND lcp.completedAt IS NOT NULL ORDER BY lcp.completedAt DESC LIMIT 5")
    List<ListeningChallengeProgress> findRecentCompleted(User user);
    
    @Query("SELECT lcp FROM ListeningChallengeProgress lcp WHERE lcp.user = ?1 AND lcp.lastCompletedDate = ?2")
    List<ListeningChallengeProgress> findCompletedToday(User user, LocalDate today);
}
