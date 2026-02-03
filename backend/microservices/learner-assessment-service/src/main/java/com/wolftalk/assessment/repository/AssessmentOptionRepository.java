package com.wolftalk.assessment.repository;

import com.wolftalk.assessment.entity.AssessmentOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentOptionRepository extends JpaRepository<AssessmentOption, Long> {
    List<AssessmentOption> findByQuestionIdOrderByOrderIndexAsc(Long questionId);
}
