package com.wolftalk.microservices.ai.repository;

import com.wolftalk.microservices.ai.entity.PronunciationAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PronunciationAssessmentRepository extends JpaRepository<PronunciationAssessment, Long> {
    List<PronunciationAssessment> findByUserIdOrderByCreatedAtDesc(Long userId);
}
