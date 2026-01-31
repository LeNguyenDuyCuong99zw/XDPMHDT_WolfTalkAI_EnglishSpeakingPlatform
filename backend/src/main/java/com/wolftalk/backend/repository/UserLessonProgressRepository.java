package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.UserLessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {
    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, String lessonId);

    long countByUserIdAndIsCompletedTrue(Long userId);

    List<UserLessonProgress> findByUserId(Long userId);
}
