package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.SyllabusLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusLessonRepository extends JpaRepository<SyllabusLesson, String> {
    List<SyllabusLesson> findByUnitIdOrderByOrderAsc(String unitId);
}
