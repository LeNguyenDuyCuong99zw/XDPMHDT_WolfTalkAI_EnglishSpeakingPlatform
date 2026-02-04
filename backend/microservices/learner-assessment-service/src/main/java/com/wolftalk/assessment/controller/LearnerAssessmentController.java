package com.wolftalk.assessment.controller;

import com.wolftalk.assessment.dto.*;
import com.wolftalk.assessment.service.AssessmentService;
import com.wolftalk.assessment.service.LearnerAssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller cho các API của Learner liên quan đến Assessment
 */
@RestController
@RequestMapping("/api/learner/assessments")
@RequiredArgsConstructor
public class LearnerAssessmentController {

    private final LearnerAssessmentService learnerAssessmentService;
    private final AssessmentService assessmentService;

    /**
     * Lấy danh sách bài kiểm tra được gán cho learner
     * GET /api/learner/assessments
     */
    @GetMapping
    public ResponseEntity<List<LearnerAssessmentDTO>> getAssignedAssessments(
            @RequestHeader(value = "X-User-Id", required = false) Long learnerId) {
        
        // TODO: Get learnerId from JWT token
        if (learnerId == null) {
            learnerId = 2L; // Default for testing
        }

        List<LearnerAssessmentDTO> assessments = learnerAssessmentService.getAssignedAssessments(learnerId);
        return ResponseEntity.ok(assessments);
    }

    /**
     * Bắt đầu làm bài kiểm tra
     * POST /api/learner/assessments/{assessmentId}/start
     */
    @PostMapping("/{assessmentId}/start")
    public ResponseEntity<StartAssessmentResponse> startAssessment(
            @PathVariable Long assessmentId,
            @RequestHeader(value = "X-User-Id", required = false) Long learnerId) {
        
        if (learnerId == null) {
            learnerId = 2L; // Default for testing
        }

        StartAssessmentResponse response = learnerAssessmentService.startAssessment(assessmentId, learnerId);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy chi tiết bài kiểm tra với tất cả câu hỏi
     * GET /api/learner/assessments/{assessmentId}/questions
     */
    @GetMapping("/{assessmentId}/questions")
    public ResponseEntity<AssessmentDTO> getAssessmentQuestions(@PathVariable Long assessmentId) {
        AssessmentDTO assessment = assessmentService.getAssessmentById(assessmentId);
        return ResponseEntity.ok(assessment);
    }

    /**
     * Lưu câu trả lời
     * POST /api/learner/assessments/attempts/{attemptId}/answer
     */
    @PostMapping("/attempts/{attemptId}/answer")
    public ResponseEntity<String> submitAnswer(
            @PathVariable Long attemptId,
            @RequestBody SubmitAnswerRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long learnerId) {
        
        if (learnerId == null) {
            learnerId = 2L; // Default for testing
        }

        learnerAssessmentService.saveAnswer(attemptId, request, learnerId);
        return ResponseEntity.ok("Đã lưu câu trả lời");
    }

    /**
     * Upload file (video/audio)
     * POST /api/learner/assessments/attempts/{attemptId}/upload
     */
    @PostMapping("/attempts/{attemptId}/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @PathVariable Long attemptId,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("questionId") Long questionId,
            @RequestParam("fileType") String fileType,
            @RequestHeader(value = "X-User-Id", required = false) Long learnerId) {
        
        if (learnerId == null) {
            learnerId = 2L; // Default for testing
        }

        String fileUrl = learnerAssessmentService.uploadFile(attemptId, questionId, file, fileType, learnerId);
        
        return ResponseEntity.ok(new FileUploadResponse(
                "Upload thành công",
                fileUrl,
                questionId
        ));
    }

    /**
     * Nộp bài kiểm tra
     * POST /api/learner/assessments/attempts/{attemptId}/submit
     */
    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<SubmitAssessmentResponse> submitAssessment(
            @PathVariable Long attemptId,
            @RequestHeader(value = "X-User-Id", required = false) Long learnerId) {
        
        if (learnerId == null) {
            learnerId = 2L; // Default for testing
        }

        SubmitAssessmentResponse response = learnerAssessmentService.submitAssessment(attemptId, learnerId);
        return ResponseEntity.ok(response);
    }

    /**
     * Xem kết quả bài kiểm tra
     * GET /api/learner/assessments/attempts/{attemptId}/result
     */
    @GetMapping("/attempts/{attemptId}/result")
    public ResponseEntity<AssessmentResultDTO> getResult(
            @PathVariable Long attemptId,
            @RequestHeader(value = "X-User-Id", required = false) Long learnerId) {
        
        if (learnerId == null) {
            learnerId = 2L; // Default for testing
        }

        AssessmentResultDTO result = learnerAssessmentService.getResult(attemptId, learnerId);
        return ResponseEntity.ok(result);
    }
}
