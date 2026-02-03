package com.wolftalk.assessment.repository;

import com.wolftalk.assessment.entity.LearnerAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearnerAssessmentRepository extends JpaRepository<LearnerAssessment, Long> {
    List<LearnerAssessment> findByLearnerId(Long learnerId);
    Optional<LearnerAssessment> findByLearnerIdAndAssessmentIdAndStatus(Long learnerId, Long assessmentId, String status);
}
