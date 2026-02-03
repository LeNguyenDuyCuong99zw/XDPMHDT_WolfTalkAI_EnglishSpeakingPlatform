package com.wolftalk.assessment.repository;

import com.wolftalk.assessment.entity.LearnerAssessmentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearnerAssessmentAssignmentRepository extends JpaRepository<LearnerAssessmentAssignment, Long> {
    List<LearnerAssessmentAssignment> findByLearnerId(Long learnerId);
    List<LearnerAssessmentAssignment> findByAssignedBy(Long mentorId);
    Optional<LearnerAssessmentAssignment> findByLearnerIdAndAssessmentId(Long learnerId, Long assessmentId);
    List<LearnerAssessmentAssignment> findByStatus(String status);
}
