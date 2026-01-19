package com.wolftalk.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.LearningGoal;

@Repository
public interface LearningGoalRepository extends JpaRepository<LearningGoal, Long> {
    List<LearningGoal> findByUserId(Long userId);
    
    List<LearningGoal> findByUserIdAndStatus(Long userId, String status);
    
    List<LearningGoal> findByUserIdAndIsCompleted(Long userId, Boolean isCompleted);
    
    List<LearningGoal> findByUserIdAndGoalType(Long userId, String goalType);
    
    @Query("SELECT g FROM LearningGoal g WHERE g.user.id = :userId AND g.status = 'ACTIVE' ORDER BY g.priority DESC, g.createdAt DESC")
    List<LearningGoal> findActiveGoalsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(g) FROM LearningGoal g WHERE g.user.id = :userId AND g.isCompleted = true")
    Long countCompletedGoalsByUserId(@Param("userId") Long userId);
}
