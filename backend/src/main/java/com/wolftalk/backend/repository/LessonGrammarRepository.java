package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.LessonGrammar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonGrammarRepository extends JpaRepository<LessonGrammar, Long> {
    List<LessonGrammar> findByLessonId(String lessonId);
}
