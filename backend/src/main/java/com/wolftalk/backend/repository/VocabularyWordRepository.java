package com.wolftalk.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.VocabularyWord;
import com.wolftalk.backend.entity.VocabularyWord.VocabularyTopic;

@Repository
public interface VocabularyWordRepository extends JpaRepository<VocabularyWord, Long> {
    
    List<VocabularyWord> findByLevel(Integer level);
    
    List<VocabularyWord> findByTopic(VocabularyTopic topic);
    
    List<VocabularyWord> findByTopicAndLevel(VocabularyTopic topic, Integer level);
    
    @Query("SELECT v FROM VocabularyWord v WHERE v.level <= :maxLevel ORDER BY v.level ASC, v.topic ASC")
    List<VocabularyWord> findByLevelLessThanEqual(@Param("maxLevel") Integer maxLevel);
    
    @Query("SELECT v FROM VocabularyWord v WHERE v.topic IN :topics AND v.level <= :maxLevel ORDER BY v.level ASC")
    List<VocabularyWord> findByTopicsAndMaxLevel(@Param("topics") List<VocabularyTopic> topics, @Param("maxLevel") Integer maxLevel);
    
    @Query(value = "SELECT * FROM vocabulary_words WHERE topic = :topic AND level <= :maxLevel ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<VocabularyWord> findRandomByTopicAndMaxLevel(@Param("topic") String topic, @Param("maxLevel") Integer maxLevel, @Param("limit") int limit);
    
    default List<VocabularyWord> findRandomByTopicAndMaxLevel(VocabularyTopic topic, Integer maxLevel, int limit) {
        return findRandomByTopicAndMaxLevel(topic.name(), maxLevel, limit);
    }
    
    @Query(value = "SELECT * FROM vocabulary_words WHERE level <= :maxLevel ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<VocabularyWord> findRandomByMaxLevel(@Param("maxLevel") Integer maxLevel, @Param("limit") int limit);
    
    @Query("SELECT DISTINCT v.topic FROM VocabularyWord v WHERE v.level <= :maxLevel")
    List<VocabularyTopic> findDistinctTopicsByMaxLevel(@Param("maxLevel") Integer maxLevel);
    
    @Query("SELECT COUNT(v) FROM VocabularyWord v WHERE v.topic = :topic AND v.level <= :maxLevel")
    Long countByTopicAndMaxLevel(@Param("topic") VocabularyTopic topic, @Param("maxLevel") Integer maxLevel);
    
    // Find words user hasn't learned yet
    @Query(value = """
        SELECT v.* FROM vocabulary_words v 
        WHERE v.level <= :maxLevel 
        AND v.id NOT IN (
            SELECT uvp.vocabulary_word_id FROM user_vocabulary_progress uvp 
            WHERE uvp.user_id = :userId AND uvp.status = 'MASTERED'
        )
        ORDER BY v.level ASC, RANDOM() 
        LIMIT :limit
        """, nativeQuery = true)
    List<VocabularyWord> findNewWordsForUser(@Param("userId") Long userId, @Param("maxLevel") Integer maxLevel, @Param("limit") int limit);
    
    // Find words user is learning (not mastered yet)
    @Query(value = """
        SELECT v.* FROM vocabulary_words v 
        INNER JOIN user_vocabulary_progress uvp ON v.id = uvp.vocabulary_word_id
        WHERE uvp.user_id = :userId AND uvp.status IN ('LEARNING', 'FAMILIAR')
        ORDER BY uvp.next_review_date ASC NULLS FIRST
        LIMIT :limit
        """, nativeQuery = true)
    List<VocabularyWord> findWordsToReviewForUser(@Param("userId") Long userId, @Param("limit") int limit);
    
    // Find random wrong answers for multiple choice options
    @Query(value = """
        SELECT v.* FROM vocabulary_words v 
        WHERE v.id != :correctWordId 
        AND v.topic = :topic
        AND v.level <= :maxLevel
        ORDER BY RANDOM() 
        LIMIT :limit
        """, nativeQuery = true)
    List<VocabularyWord> findRandomWrongAnswersByTopic(@Param("correctWordId") Long correctWordId, 
                                                        @Param("topic") String topic,
                                                        @Param("maxLevel") Integer maxLevel, 
                                                        @Param("limit") int limit);
    
    default List<VocabularyWord> findRandomWrongAnswers(Long correctWordId, VocabularyTopic topic, Integer maxLevel, int limit) {
        return findRandomWrongAnswersByTopic(correctWordId, topic.name(), maxLevel, limit);
    }
}
