package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.LessonConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonConversationRepository extends JpaRepository<LessonConversation, Long> {
    List<LessonConversation> findByLessonIdOrderByOrderAsc(String lessonId);
}
