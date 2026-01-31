package com.wolftalk.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.UserVocabularyProgress;
import com.wolftalk.backend.entity.UserVocabularyProgress.LearningStatus;

@Repository
public interface UserVocabularyProgressRepository extends JpaRepository<UserVocabularyProgress, Long> {
    
    List<UserVocabularyProgress> findByUserId(Long userId);
    
    Optional<UserVocabularyProgress> findByUserIdAndVocabularyWordId(Long userId, Long vocabularyWordId);
    
    List<UserVocabularyProgress> findByUserIdAndStatus(Long userId, LearningStatus status);
    
    @Query("SELECT COUNT(uvp) FROM UserVocabularyProgress uvp WHERE uvp.user.id = :userId AND uvp.status = :status")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") LearningStatus status);
    
    @Query("SELECT COUNT(uvp) FROM UserVocabularyProgress uvp WHERE uvp.user.id = :userId AND uvp.status = 'MASTERED'")
    Long countMasteredByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(uvp) FROM UserVocabularyProgress uvp WHERE uvp.user.id = :userId AND uvp.status IN ('LEARNING', 'FAMILIAR')")
    Long countInProgressByUserId(@Param("userId") Long userId);
    
    // Get words that need review (next_review_date <= now)
    @Query("SELECT uvp FROM UserVocabularyProgress uvp WHERE uvp.user.id = :userId AND uvp.nextReviewDate <= :now AND uvp.status IN ('LEARNING', 'FAMILIAR') ORDER BY uvp.nextReviewDate ASC")
    List<UserVocabularyProgress> findWordsNeedingReview(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    // Get user's progress by topic
    @Query("""
        SELECT uvp FROM UserVocabularyProgress uvp 
        WHERE uvp.user.id = :userId AND uvp.vocabularyWord.topic = :topic
        """)
    List<UserVocabularyProgress> findByUserIdAndTopic(@Param("userId") Long userId, @Param("topic") com.wolftalk.backend.entity.VocabularyWord.VocabularyTopic topic);
    
    @Query("""
        SELECT COUNT(uvp) FROM UserVocabularyProgress uvp 
        WHERE uvp.user.id = :userId AND uvp.vocabularyWord.topic = :topic AND uvp.status = 'MASTERED'
        """)
    Long countMasteredByUserIdAndTopic(@Param("userId") Long userId, @Param("topic") com.wolftalk.backend.entity.VocabularyWord.VocabularyTopic topic);
}
