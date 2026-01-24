package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.LessonPracticeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonPracticeQuestionRepository extends JpaRepository<LessonPracticeQuestion, Long> {
    List<LessonPracticeQuestion> findByLessonId(String lessonId);
}
