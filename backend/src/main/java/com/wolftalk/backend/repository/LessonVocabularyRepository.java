package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.LessonVocabulary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonVocabularyRepository extends JpaRepository<LessonVocabulary, Long> {
    List<LessonVocabulary> findByLessonId(String lessonId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(v) FROM LessonVocabulary v JOIN v.lesson l WHERE l.id IN (SELECT p.lessonId FROM UserLessonProgress p WHERE p.userId = :userId AND p.isCompleted = true)")
    long countLearnedWordsByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
