package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.ListeningTask;
import com.wolftalk.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ListeningTaskRepository extends JpaRepository<ListeningTask, Long> {
    
    List<ListeningTask> findByUserOrderByDueDateAsc(User user);
    
    List<ListeningTask> findByUserAndCompletedFalseOrderByDueDateAsc(User user);
    
    List<ListeningTask> findByUserAndCompletedTrueOrderByCompletedAtDesc(User user);
    
    List<ListeningTask> findByUserAndDueDateAndTaskType(User user, LocalDate dueDate, String taskType);
    
    @Query("SELECT lt FROM ListeningTask lt WHERE lt.user = ?1 AND lt.taskType = ?2 AND lt.dueDate = ?3 ORDER BY lt.createdAt ASC")
    List<ListeningTask> findDailyTasks(User user, String taskType, LocalDate today);
}
