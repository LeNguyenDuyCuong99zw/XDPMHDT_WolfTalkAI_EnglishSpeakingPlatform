package com.wolftalk.assessment.controller;

import com.wolftalk.assessment.dto.*;
import com.wolftalk.assessment.service.MentorAssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller cho các API của Mentor liên quan đến Assessment
 */
@RestController
@RequestMapping("/api/mentor/assessments")
@RequiredArgsConstructor
public class MentorAssessmentController {

    private final MentorAssessmentService mentorAssessmentService;

    /**
     * Gán bài kiểm tra cho học viên
     * POST /api/mentor/assessments/assign
     * 
     * Body: {
     *   "assessmentId": 1,
     *   "learnerIds": [2, 3, 4],
     *   "dueDate": "2024-01-10T23:59:59"
     * }
     */
    @PostMapping("/assign")
    public ResponseEntity<AssignAssessmentResponse> assignAssessment(
            @RequestBody AssignAssessmentRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long mentorId) {
        
        // TODO: Get mentorId from JWT token instead of header
        if (mentorId == null) {
            mentorId = 1L; // Default for testing
        }

        AssignAssessmentResponse response = mentorAssessmentService.assignAssessment(request, mentorId);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách bài đã nộp
     * GET /api/mentor/assessments/submissions?status=SUBMITTED
     */
    @GetMapping("/submissions")
    public ResponseEntity<List<SubmissionDTO>> getSubmissions(
            @RequestParam(defaultValue = "SUBMITTED") String status) {
        
        List<SubmissionDTO> submissions = mentorAssessmentService.getSubmissions(status);
        return ResponseEntity.ok(submissions);
    }

    /**
     * Lấy chi tiết bài nộp
     * GET /api/mentor/assessments/submissions/{attemptId}
     */
    @GetMapping("/submissions/{attemptId}")
    public ResponseEntity<SubmissionDetailDTO> getSubmissionDetail(@PathVariable Long attemptId) {
        SubmissionDetailDTO detail = mentorAssessmentService.getSubmissionDetail(attemptId);
        return ResponseEntity.ok(detail);
    }

    /**
     * Chấm điểm bài làm
     * POST /api/mentor/assessments/submissions/{attemptId}/grade
     */
    @PostMapping("/submissions/{attemptId}/grade")
    public ResponseEntity<String> gradeSubmission(
            @PathVariable Long attemptId,
            @RequestBody GradeSubmissionRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long mentorId) {
        
        if (mentorId == null) {
            mentorId = 1L; // Default for testing
        }

        mentorAssessmentService.gradeSubmission(attemptId, request, mentorId);
        return ResponseEntity.ok("Chấm điểm thành công");
    }
}
