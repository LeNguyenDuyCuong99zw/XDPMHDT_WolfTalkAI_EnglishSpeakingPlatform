package com.wolftalk.assessment.service;

import com.wolftalk.assessment.dto.AssignAssessmentRequest;
import com.wolftalk.assessment.dto.AssignAssessmentResponse;
import com.wolftalk.assessment.entity.Assessment;
import com.wolftalk.assessment.entity.LearnerAssessmentAssignment;
import com.wolftalk.assessment.repository.AssessmentRepository;
import com.wolftalk.assessment.repository.LearnerAssessmentAssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorAssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final LearnerAssessmentAssignmentRepository assignmentRepository;

    /**
     * Gán bài kiểm tra cho nhiều học viên
     */
    @Transactional
    public AssignAssessmentResponse assignAssessment(AssignAssessmentRequest request, Long mentorId) {
        // Validate assessment exists
        Assessment assessment = assessmentRepository.findById(request.getAssessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        if (!assessment.getIsActive()) {
            throw new RuntimeException("Assessment is not active");
        }

        // Parse due date
        LocalDateTime dueDate = null;
        if (request.getDueDate() != null && !request.getDueDate().isEmpty()) {
            try {
                dueDate = LocalDateTime.parse(request.getDueDate(), DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception e) {
                log.warn("Invalid due date format: {}", request.getDueDate());
            }
        }

        // Assign to each learner
        int assignedCount = 0;
        for (Long learnerId : request.getLearnerIds()) {
            // Check if already assigned
            var existing = assignmentRepository.findByLearnerIdAndAssessmentId(learnerId, request.getAssessmentId());
            if (existing.isPresent()) {
                log.info("Assessment {} already assigned to learner {}", request.getAssessmentId(), learnerId);
                continue;
            }

            // Create new assignment
            LearnerAssessmentAssignment assignment = new LearnerAssessmentAssignment();
            assignment.setLearnerId(learnerId);
            assignment.setAssessmentId(request.getAssessmentId());
            assignment.setAssignedBy(mentorId);
            assignment.setDueDate(dueDate);
            assignment.setStatus("ASSIGNED");

            assignmentRepository.save(assignment);
            assignedCount++;
        }

        log.info("Assigned assessment {} to {} learners by mentor {}", 
                request.getAssessmentId(), assignedCount, mentorId);

        return new AssignAssessmentResponse(
                "Đã gán bài kiểm tra thành công cho " + assignedCount + " học viên",
                assignedCount
        );
    }

    /**
     * Lấy danh sách bài đã gán bởi mentor
     */
    public List<LearnerAssessmentAssignment> getAssignmentsByMentor(Long mentorId) {
        return assignmentRepository.findByAssignedBy(mentorId);
    }

    /**
     * Lấy danh sách bài đã nộp cần chấm
     */
    public List<SubmissionDTO> getSubmissions(String status) {
        List<LearnerAssessment> submissions;
        
        if ("ALL".equalsIgnoreCase(status)) {
            submissions = learnerAssessmentRepository.findAll().stream()
                    .filter(a -> "SUBMITTED".equals(a.getStatus()) || "GRADED".equals(a.getStatus()))
                    .collect(java.util.stream.Collectors.toList());
        } else {
            submissions = learnerAssessmentRepository.findAll().stream()
                    .filter(a -> status.equalsIgnoreCase(a.getStatus()))
                    .collect(java.util.stream.Collectors.toList());
        }

        return submissions.stream()
                .map(this::convertToSubmissionDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    private SubmissionDTO convertToSubmissionDTO(LearnerAssessment attempt) {
        Assessment assessment = assessmentRepository.findById(attempt.getAssessmentId()).orElse(null);
        int totalAnswered = learnerAnswerRepository.findByLearnerAssessmentId(attempt.getId()).size();
        int totalQuestions = questionRepository.findByAssessmentIdOrderByOrderIndexAsc(attempt.getAssessmentId()).size();

        SubmissionDTO dto = new SubmissionDTO();
        dto.setAttemptId(attempt.getId());
        dto.setLearnerId(attempt.getLearnerId());
        dto.setLearnerName("User " + attempt.getLearnerId()); // TODO: Get from user service
        dto.setLearnerEmail("user" + attempt.getLearnerId() + "@example.com");
        dto.setAssessmentId(attempt.getAssessmentId());
        dto.setAssessmentTitle(assessment != null ? assessment.getTitle() : "Unknown");
        dto.setStatus(attempt.getStatus());
        dto.setSubmittedAt(attempt.getSubmittedAt() != null ? 
                attempt.getSubmittedAt().format(java.time.format.DateTimeFormatter.ISO_DATE_TIME) : null);
        dto.setTimeSpentMinutes(attempt.getTimeSpentMinutes());
        dto.setTotalAnswered(totalAnswered);
        dto.setTotalQuestions(totalQuestions);
        
        return dto;
    }

    /**
     * Lấy chi tiết bài nộp
     */
    public SubmissionDetailDTO getSubmissionDetail(Long attemptId) {
        LearnerAssessment attempt = learnerAssessmentRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Bài làm không tồn tại"));

        Assessment assessment = assessmentRepository.findById(attempt.getAssessmentId())
                .orElseThrow(() -> new RuntimeException("Bài kiểm tra không tồn tại"));

        List<LearnerAnswer> answers = learnerAnswerRepository.findByLearnerAssessmentId(attemptId);
        List<AssessmentQuestion> questions = questionRepository.findByAssessmentIdOrderByOrderIndexAsc(assessment.getId());

        SubmissionDetailDTO dto = new SubmissionDetailDTO();
        dto.setAttemptId(attemptId);
        
        // Learner info
        dto.setLearner(new SubmissionDetailDTO.LearnerInfo(
                attempt.getLearnerId(),
                "User " + attempt.getLearnerId(),
                "user" + attempt.getLearnerId() + "@example.com"
        ));

        // Assessment info
        dto.setAssessment(new SubmissionDetailDTO.AssessmentInfo(
                assessment.getId(),
                assessment.getTitle(),
                assessment.getLevel()
        ));

        dto.setSubmittedAt(attempt.getSubmittedAt() != null ? 
                attempt.getSubmittedAt().format(java.time.format.DateTimeFormatter.ISO_DATE_TIME) : null);
        dto.setTimeSpentMinutes(attempt.getTimeSpentMinutes());

        // Build answer details
        List<SubmissionDetailDTO.AnswerDetail> answerDetails = questions.stream()
                .map(question -> {
                    LearnerAnswer answer = answers.stream()
                            .filter(a -> a.getQuestionId().equals(question.getId()))
                            .findFirst()
                            .orElse(null);

                    SubmissionDetailDTO.AnswerDetail detail = new SubmissionDetailDTO.AnswerDetail();
                    detail.setAnswerId(answer != null ? answer.getId() : null);
                    detail.setQuestionId(question.getId());
                    detail.setQuestionText(question.getQuestionText());
                    detail.setSection(question.getSection());
                    detail.setQuestionType(question.getQuestionType());

                    if (answer != null) {
                        detail.setAnswerText(answer.getAnswerText());
                        detail.setVideoUrl(answer.getVideoUrl());
                        detail.setAudioUrl(answer.getAudioUrl());
                        detail.setScore(answer.getScore() != null ? answer.getScore().doubleValue() : null);
                        detail.setFeedback(answer.getFeedback());
                    }

                    detail.setCorrectAnswer(question.getCorrectAnswer());
                    
                    return detail;
                })
                .collect(java.util.stream.Collectors.toList());

        dto.setAnswers(answerDetails);
        return dto;
    }

    /**
     * Chấm điểm bài làm
     */
    @org.springframework.transaction.annotation.Transactional
    public void gradeSubmission(Long attemptId, GradeSubmissionRequest request, Long mentorId) {
        LearnerAssessment attempt = learnerAssessmentRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Bài làm không tồn tại"));

        if (!"SUBMITTED".equals(attempt.getStatus())) {
            throw new RuntimeException("Bài làm chưa được nộp hoặc đã chấm rồi");
        }

        // Update individual answer scores
        for (GradeSubmissionRequest.AnswerGrade grade : request.getAnswers()) {
            LearnerAnswer answer = learnerAnswerRepository.findById(grade.getAnswerId())
                    .orElseThrow(() -> new RuntimeException("Câu trả lời không tồn tại"));
            
            answer.setScore(java.math.BigDecimal.valueOf(grade.getScore()));
            answer.setFeedback(grade.getFeedback());
            learnerAnswerRepository.save(answer);
        }

        // Update attempt
        attempt.setStatus("GRADED");
        attempt.setTotalScore(java.math.BigDecimal.valueOf(request.getTotalScore()));
        attempt.setLevelResult(request.getLevelResult());
        learnerAssessmentRepository.save(attempt);

        // Update assignment status
        var assignment = assignmentRepository
                .findByLearnerIdAndAssessmentId(attempt.getLearnerId(), attempt.getAssessmentId())
                .orElse(null);
        if (assignment != null) {
            assignment.setStatus("GRADED");
            assignmentRepository.save(assignment);
        }

        log.info("Mentor {} graded attempt {}, score: {}", mentorId, attemptId, request.getTotalScore());
    }
}
