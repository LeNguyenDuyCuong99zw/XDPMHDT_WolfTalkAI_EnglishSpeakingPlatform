package com.wolftalk.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.DailyQuest;

@Repository
public interface DailyQuestRepository extends JpaRepository<DailyQuest, Long> {

    /**
     * Lấy tất cả quest đang active
     */
    List<DailyQuest> findByIsActiveTrue();

    /**
     * Lấy quest theo type
     */
    List<DailyQuest> findByQuestTypeAndIsActiveTrue(DailyQuest.QuestType questType);

    /**
     * Lấy quest theo difficulty
     */
    List<DailyQuest> findByDifficultyAndIsActiveTrue(Integer difficulty);

    /**
     * Lấy quest ngẫu nhiên (mix các loại)
     */
    @Query(value = "SELECT * FROM daily_quests WHERE is_active = true ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<DailyQuest> findRandomActiveQuests(@Param("limit") int limit);

    /**
     * Lấy quest theo difficulty và số lượng
     */
    @Query(value = "SELECT * FROM daily_quests WHERE is_active = true AND difficulty = :difficulty ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<DailyQuest> findRandomQuestsByDifficulty(@Param("difficulty") int difficulty, @Param("limit") int limit);
}
