package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.InitialAssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InitialAssessmentQuestionRepository extends JpaRepository<InitialAssessmentQuestion, Long> {
    
    // Lấy tất cả câu hỏi
    List<InitialAssessmentQuestion> findAll();
    
    // Lấy câu hỏi theo loại skill
    List<InitialAssessmentQuestion> findBySkillType(String skillType);
    
    // Lấy câu hỏi theo loại skill và định dạng trả lời
    List<InitialAssessmentQuestion> findBySkillTypeAndAnswerFormat(String skillType, String answerFormat);
    
    // Lấy câu hỏi theo mức độ khó
    List<InitialAssessmentQuestion> findByDifficulty(Integer difficulty);
    
    // Lấy ngẫu nhiên N câu hỏi
    @Query(value = "SELECT * FROM initial_assessment_questions ORDER BY RANDOM() LIMIT ?1", nativeQuery = true)
    List<InitialAssessmentQuestion> findRandomQuestions(Integer limit);
}
