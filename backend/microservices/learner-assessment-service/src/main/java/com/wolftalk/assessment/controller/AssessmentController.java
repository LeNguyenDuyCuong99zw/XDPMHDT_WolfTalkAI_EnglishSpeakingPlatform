package com.wolftalk.assessment.controller;

import com.wolftalk.assessment.dto.AssessmentDTO;
import com.wolftalk.assessment.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    /**
     * Lấy danh sách tất cả bài kiểm tra đang active
     * GET /api/assessments
     */
    @GetMapping
    public ResponseEntity<List<AssessmentDTO>> getAllAssessments() {
        List<AssessmentDTO> assessments = assessmentService.getAllActiveAssessments();
        return ResponseEntity.ok(assessments);
    }

    /**
     * Lấy chi tiết bài kiểm tra (bao gồm tất cả câu hỏi)
     * GET /api/assessments/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AssessmentDTO> getAssessmentById(@PathVariable Long id) {
        AssessmentDTO assessment = assessmentService.getAssessmentById(id);
        return ResponseEntity.ok(assessment);
    }
}
