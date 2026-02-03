package com.wolftalk.assessment.service;

import com.wolftalk.assessment.dto.AssessmentDTO;
import com.wolftalk.assessment.dto.OptionDTO;
import com.wolftalk.assessment.dto.QuestionDTO;
import com.wolftalk.assessment.entity.Assessment;
import com.wolftalk.assessment.entity.AssessmentOption;
import com.wolftalk.assessment.entity.AssessmentQuestion;
import com.wolftalk.assessment.repository.AssessmentOptionRepository;
import com.wolftalk.assessment.repository.AssessmentQuestionRepository;
import com.wolftalk.assessment.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentOptionRepository optionRepository;

    public List<AssessmentDTO> getAllActiveAssessments() {
        return assessmentRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AssessmentDTO getAssessmentById(Long id) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        return convertToDetailDTO(assessment);
    }

    private AssessmentDTO convertToDTO(Assessment assessment) {
        AssessmentDTO dto = new AssessmentDTO();
        dto.setId(assessment.getId());
        dto.setTitle(assessment.getTitle());
        dto.setDescription(assessment.getDescription());
        dto.setLevel(assessment.getLevel());
        dto.setDurationMinutes(assessment.getDurationMinutes());
        dto.setPassingScore(assessment.getPassingScore());
        dto.setIsActive(assessment.getIsActive());
        
        List<AssessmentQuestion> questions = questionRepository.findByAssessmentIdOrderByOrderIndexAsc(assessment.getId());
        dto.setTotalQuestions(questions.size());
        
        return dto;
    }

    private AssessmentDTO convertToDetailDTO(Assessment assessment) {
        AssessmentDTO dto = convertToDTO(assessment);
        
        List<AssessmentQuestion> questions = questionRepository.findByAssessmentIdOrderByOrderIndexAsc(assessment.getId());
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(this::convertQuestionToDTO)
                .collect(Collectors.toList());
        
        dto.setQuestions(questionDTOs);
        return dto;
    }

    private QuestionDTO convertQuestionToDTO(AssessmentQuestion question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setSection(question.getSection());
        dto.setQuestionType(question.getQuestionType());
        dto.setQuestionText(question.getQuestionText());
        dto.setReadingPassage(question.getReadingPassage());
        dto.setPoints(question.getPoints());
        dto.setOrderIndex(question.getOrderIndex());
        
        List<AssessmentOption> options = optionRepository.findByQuestionIdOrderByOrderIndexAsc(question.getId());
        List<OptionDTO> optionDTOs = options.stream()
                .map(this::convertOptionToDTO)
                .collect(Collectors.toList());
        
        dto.setOptions(optionDTOs);
        return dto;
    }

    private OptionDTO convertOptionToDTO(AssessmentOption option) {
        OptionDTO dto = new OptionDTO();
        dto.setId(option.getId());
        dto.setOptionText(option.getOptionText());
        dto.setIsCorrect(option.getIsCorrect());
        dto.setOrderIndex(option.getOrderIndex());
        return dto;
    }
}
