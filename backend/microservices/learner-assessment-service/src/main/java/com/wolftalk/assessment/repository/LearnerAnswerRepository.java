package com.wolftalk.assessment.repository;

import com.wolftalk.assessment.entity.LearnerAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearnerAnswerRepository extends JpaRepository<LearnerAnswer, Long> {
    List<LearnerAnswer> findByLearnerAssessmentId(Long learnerAssessmentId);
    Optional<LearnerAnswer> findByLearnerAssessmentIdAndQuestionId(Long learnerAssessmentId, Long questionId);
}
