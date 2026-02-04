package com.wolftalk.assessment.service;

import com.wolftalk.assessment.dto.LearnerAssessmentDTO;
import com.wolftalk.assessment.dto.StartAssessmentResponse;
import com.wolftalk.assessment.dto.SubmitAnswerRequest;
import com.wolftalk.assessment.dto.SubmitAssessmentResponse;
import com.wolftalk.assessment.dto.AssessmentResultDTO;
import com.wolftalk.assessment.entity.*;
import com.wolftalk.assessment.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LearnerAssessmentService {

    private final LearnerAssessmentAssignmentRepository assignmentRepository;
    private final AssessmentRepository assessmentRepository;
    private final LearnerAssessmentRepository learnerAssessmentRepository;
    private final LearnerAnswerRepository learnerAnswerRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final FileStorageService fileStorageService;

    /**
     * Lấy danh sách bài kiểm tra được gán cho learner
     */
    public List<LearnerAssessmentDTO> getAssignedAssessments(Long learnerId) {
        List<LearnerAssessmentAssignment> assignments = assignmentRepository.findByLearnerId(learnerId);

        return assignments.stream()
                .map(assignment -> {
                    Assessment assessment = assessmentRepository.findById(assignment.getAssessmentId())
                            .orElse(null);
                    
                    if (assessment == null) {
                        return null;
                    }

                    LearnerAssessmentDTO dto = new LearnerAssessmentDTO();
                    dto.setAssignmentId(assignment.getId());
                    dto.setAssessmentId(assessment.getId());
                    dto.setTitle(assessment.getTitle());
                    dto.setDescription(assessment.getDescription());
                    dto.setLevel(assessment.getLevel());
                    dto.setDurationMinutes(assessment.getDurationMinutes());
                    
                    // Count questions
                    int questionCount = questionRepository.findByAssessmentIdOrderByOrderIndexAsc(assessment.getId()).size();
                    dto.setTotalQuestions(questionCount);
                    
                    dto.setStatus(assignment.getStatus());
                    dto.setAssignedAt(assignment.getAssignedAt().format(DateTimeFormatter.ISO_DATE_TIME));
                    
                    if (assignment.getDueDate() != null) {
                        dto.setDueDate(assignment.getDueDate().format(DateTimeFormatter.ISO_DATE_TIME));
                    }

                    // Check if learner has started
                    var attempt = learnerAssessmentRepository
                            .findByLearnerIdAndAssessmentIdAndStatus(learnerId, assessment.getId(), "IN_PROGRESS")
                            .orElse(null);
                    
                    if (attempt != null) {
                        dto.setAttemptId(attempt.getId());
                    }

                    return dto;
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    /**
     * Bắt đầu làm bài kiểm tra
     */
    @Transactional
    public StartAssessmentResponse startAssessment(Long assessmentId, Long learnerId) {
        // Validate assignment exists
        var assignment = assignmentRepository.findByLearnerIdAndAssessmentId(learnerId, assessmentId)
                .orElseThrow(() -> new RuntimeException("Bài kiểm tra chưa được gán cho bạn"));

        // Check if already in progress
        var existingAttempt = learnerAssessmentRepository
                .findByLearnerIdAndAssessmentIdAndStatus(learnerId, assessmentId, "IN_PROGRESS")
                .orElse(null);

        if (existingAttempt != null) {
            return new StartAssessmentResponse(
                    existingAttempt.getId(),
                    assessmentId,
                    existingAttempt.getStartedAt().format(DateTimeFormatter.ISO_DATE_TIME),
                    null,
                    "Bạn đã bắt đầu bài kiểm tra này rồi. Tiếp tục làm bài."
            );
        }

        // Get assessment
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Bài kiểm tra không tồn tại"));

        // Create new attempt
        LearnerAssessment attempt = new LearnerAssessment();
        attempt.setLearnerId(learnerId);
        attempt.setAssessmentId(assessmentId);
        attempt.setStatus("IN_PROGRESS");
        attempt = learnerAssessmentRepository.save(attempt);

        // Update assignment status
        assignment.setStatus("IN_PROGRESS");
        assignmentRepository.save(assignment);

        log.info("Learner {} started assessment {}, attempt ID: {}", learnerId, assessmentId, attempt.getId());

        return new StartAssessmentResponse(
                attempt.getId(),
                assessmentId,
                attempt.getStartedAt().format(DateTimeFormatter.ISO_DATE_TIME),
                assessment.getDurationMinutes(),
                "Bắt đầu làm bài thành công. Chúc bạn làm bài tốt!"
        );
    }

    /**
     * Lưu câu trả lời
     */
    @Transactional
    public void saveAnswer(Long attemptId, SubmitAnswerRequest request, Long learnerId) {
        // Validate attempt belongs to learner
        LearnerAssessment attempt = learnerAssessmentRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Bài làm không tồn tại"));

        if (!attempt.getLearnerId().equals(learnerId)) {
            throw new RuntimeException("Bạn không có quyền truy cập bài làm này");
        }

        if (!"IN_PROGRESS".equals(attempt.getStatus())) {
            throw new RuntimeException("Bài làm đã được nộp hoặc đã chấm điểm");
        }

        // Check if answer already exists
        var existingAnswer = learnerAnswerRepository
                .findByLearnerAssessmentIdAndQuestionId(attemptId, request.getQuestionId())
                .orElse(null);

        if (existingAnswer != null) {
            // Update existing answer
            existingAnswer.setAnswerText(request.getAnswerText());
            learnerAnswerRepository.save(existingAnswer);
        } else {
            // Create new answer
            LearnerAnswer answer = new LearnerAnswer();
            answer.setLearnerAssessmentId(attemptId);
            answer.setQuestionId(request.getQuestionId());
            answer.setAnswerText(request.getAnswerText());
            learnerAnswerRepository.save(answer);
        }

        log.info("Saved answer for attempt {}, question {}", attemptId, request.getQuestionId());
    }

    /**
     * Upload file (video/audio)
     */
    @Transactional
    public String uploadFile(Long attemptId, Long questionId, org.springframework.web.multipart.MultipartFile file, 
                            String fileType, Long learnerId) {
        // Validate attempt
        LearnerAssessment attempt = learnerAssessmentRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Bài làm không tồn tại"));

        if (!attempt.getLearnerId().equals(learnerId)) {
            throw new RuntimeException("Bạn không có quyền truy cập bài làm này");
        }

        if (!"IN_PROGRESS".equals(attempt.getStatus())) {
            throw new RuntimeException("Bài làm đã được nộp hoặc đã chấm điểm");
        }

        // Store file
        String fileUrl = fileStorageService.storeFile(file, attemptId, questionId, fileType);

        // Save file URL to answer
        var existingAnswer = learnerAnswerRepository
                .findByLearnerAssessmentIdAndQuestionId(attemptId, questionId)
                .orElse(null);

        if (existingAnswer != null) {
            // Update existing answer
            if ("video".equals(fileType)) {
                existingAnswer.setVideoUrl(fileUrl);
            } else {
                existingAnswer.setAudioUrl(fileUrl);
            }
            learnerAnswerRepository.save(existingAnswer);
        } else {
            // Create new answer
            LearnerAnswer answer = new LearnerAnswer();
            answer.setLearnerAssessmentId(attemptId);
            answer.setQuestionId(questionId);
            if ("video".equals(fileType)) {
                answer.setVideoUrl(fileUrl);
            } else {
                answer.setAudioUrl(fileUrl);
            }
            learnerAnswerRepository.save(answer);
        }

        log.info("Uploaded {} for attempt {}, question {}", fileType, attemptId, questionId);
        return fileUrl;
    }

    /**
     * Nộp bài kiểm tra
     */
    @Transactional
    public SubmitAssessmentResponse submitAssessment(Long attemptId, Long learnerId) {
        // Validate attempt
        LearnerAssessment attempt = learnerAssessmentRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Bài làm không tồn tại"));

        if (!attempt.getLearnerId().equals(learnerId)) {
            throw new RuntimeException("Bạn không có quyền truy cập bài làm này");
        }

        if (!"IN_PROGRESS".equals(attempt.getStatus())) {
            throw new RuntimeException("Bài làm đã được nộp rồi");
        }

        // Count answered questions
        int totalAnswered = learnerAnswerRepository.findByLearnerAssessmentId(attemptId).size();
        
        // Get total questions
        int totalQuestions = questionRepository
                .findByAssessmentIdOrderByOrderIndexAsc(attempt.getAssessmentId()).size();

        // Update attempt status
        attempt.setStatus("SUBMITTED");
        attempt.setSubmittedAt(LocalDateTime.now());
        
        // Calculate time spent
        long minutesSpent = java.time.Duration.between(attempt.getStartedAt(), LocalDateTime.now()).toMinutes();
        attempt.setTimeSpentMinutes((int) minutesSpent);
        
        learnerAssessmentRepository.save(attempt);

        // Update assignment status
        var assignment = assignmentRepository
                .findByLearnerIdAndAssessmentId(learnerId, attempt.getAssessmentId())
                .orElse(null);
        if (assignment != null) {
            assignment.setStatus("SUBMITTED");
            assignmentRepository.save(assignment);
        }

        log.info("Learner {} submitted assessment attempt {}", learnerId, attemptId);

        return new SubmitAssessmentResponse(
                "Nộp bài thành công! Mentor sẽ chấm điểm và bạn sẽ nhận được kết quả sớm.",
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                totalAnswered,
                totalQuestions
        );
    }

    /**
     * Lấy kết quả bài kiểm tra
     */
    public AssessmentResultDTO getResult(Long attemptId, Long learnerId) {
        LearnerAssessment attempt = learnerAssessmentRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Bài làm không tồn tại"));

        if (!attempt.getLearnerId().equals(learnerId)) {
            throw new RuntimeException("Bạn không có quyền xem kết quả này");
        }

        if (!"GRADED".equals(attempt.getStatus())) {
            throw new RuntimeException("Bài làm chưa được chấm điểm");
        }

        Assessment assessment = assessmentRepository.findById(attempt.getAssessmentId())
                .orElseThrow(() -> new RuntimeException("Bài kiểm tra không tồn tại"));

        AssessmentResultDTO result = new AssessmentResultDTO();
        result.setAttemptId(attemptId);
        result.setAssessmentTitle(assessment.getTitle());
        result.setStatus(attempt.getStatus());
        result.setSubmittedAt(attempt.getSubmittedAt() != null ? 
                attempt.getSubmittedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null);
        result.setTimeSpentMinutes(attempt.getTimeSpentMinutes());
        result.setTotalScore(attempt.getTotalScore() != null ? attempt.getTotalScore().doubleValue() : null);
        result.setLevelResult(attempt.getLevelResult());

        // TODO: Calculate breakdown by section
        result.setBreakdown(new java.util.HashMap<>());

        return result;
    }
}
