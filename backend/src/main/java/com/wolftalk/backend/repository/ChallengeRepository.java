package com.wolftalk.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.Challenge;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByType(Challenge.ChallengeType type);

    List<Challenge> findByLevel(Integer level);

    List<Challenge> findByTypeAndLevel(Challenge.ChallengeType type, Integer level);

    @Query(value = "SELECT * FROM challenges WHERE type = :type ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Challenge> findRandomByType(@Param("type") String type, @Param("limit") int limit);
    
    // Overload for enum type
    default List<Challenge> findRandomByType(Challenge.ChallengeType type, int limit) {
        return findRandomByType(type.name(), limit);
    }
    
    // Get challenges by type ordered by level ascending (level 1, 2, 3...)
    @Query(value = "SELECT * FROM challenges WHERE type = :type ORDER BY level ASC LIMIT :limit", nativeQuery = true)
    List<Challenge> findByTypeOrderByLevelAsc(@Param("type") String type, @Param("limit") int limit);
    
    // Overload for enum type
    default List<Challenge> findByTypeOrderByLevelAsc(Challenge.ChallengeType type, int limit) {
        return findByTypeOrderByLevelAsc(type.name(), limit);
    }
    
    // Get challenges by type and level range, ordered by level
    @Query(value = "SELECT * FROM challenges WHERE type = :type AND level BETWEEN :minLevel AND :maxLevel ORDER BY level ASC, RANDOM() LIMIT :limit", nativeQuery = true)
    List<Challenge> findByTypeAndLevelRangeOrderByLevel(
        @Param("type") String type, 
        @Param("minLevel") int minLevel, 
        @Param("maxLevel") int maxLevel, 
        @Param("limit") int limit
    );
    
    default List<Challenge> findByTypeAndLevelRangeOrderByLevel(Challenge.ChallengeType type, int minLevel, int maxLevel, int limit) {
        return findByTypeAndLevelRangeOrderByLevel(type.name(), minLevel, maxLevel, limit);
    }
}
