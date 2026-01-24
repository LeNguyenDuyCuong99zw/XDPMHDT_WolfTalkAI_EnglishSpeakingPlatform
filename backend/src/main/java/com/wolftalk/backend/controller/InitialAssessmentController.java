package com.wolftalk.backend.controller;

import com.wolftalk.backend.dto.InitialAssessmentAnswerRequest;
import com.wolftalk.backend.dto.InitialAssessmentDTO;
import com.wolftalk.backend.dto.InitialAssessmentQuestionDTO;
import com.wolftalk.backend.service.InitialAssessmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/initial-assessment")
@Slf4j
public class InitialAssessmentController {
    
    @Autowired
    private InitialAssessmentService assessmentService;
    
    // Bắt đầu bài test đánh giá ban đầu
    @PostMapping("/start")
    public ResponseEntity<?> startTest(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        }
        
        try {
            InitialAssessmentDTO assessment = assessmentService.startTest(principal.getName());
            log.info("Assessment started for user: {}", principal.getName());
            return ResponseEntity.ok(assessment);
        } catch (Exception e) {
            log.error("Error starting assessment", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Lấy 20 câu hỏi ngẫu nhiên
    @GetMapping("/{assessmentId}/questions")
    public ResponseEntity<?> getQuestions(@PathVariable Long assessmentId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        }
        
        try {
            List<InitialAssessmentQuestionDTO> questions = assessmentService.getRandomQuestions(assessmentId);
            log.info("Questions retrieved for assessment: {}", assessmentId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            log.error("Error retrieving questions", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Xử lý câu trả lời
    @PostMapping("/answer")
    public ResponseEntity<?> submitAnswer(@RequestBody InitialAssessmentAnswerRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        }
        
        try {
            assessmentService.submitAnswer(request);
            log.info("Answer submitted for assessment: {}", request.getAssessmentId());
            return ResponseEntity.ok(Map.of("message", "Answer recorded"));
        } catch (Exception e) {
            log.error("Error submitting answer", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Hoàn thành bài test
    @PostMapping("/{assessmentId}/complete")
    public ResponseEntity<?> completeTest(@PathVariable Long assessmentId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        }
        
        try {
            InitialAssessmentDTO result = assessmentService.completeTest(assessmentId);
            log.info("Assessment completed: {}", assessmentId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error completing assessment", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Lấy kết quả test hiện tại
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentTest(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        }
        
        try {
            InitialAssessmentDTO assessment = assessmentService.getCurrentTest(principal.getName());
            return ResponseEntity.ok(assessment);
        } catch (Exception e) {
            log.error("Error getting current assessment", e);
            return ResponseEntity.status(404).body(Map.of("error", "No assessment found"));
        }
    }
    
    // Kiểm tra xem user đã hoàn thành test chưa
    @GetMapping("/has-completed")
    public ResponseEntity<?> hasCompletedTest(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        }
        
        try {
            boolean hasCompleted = assessmentService.hasCompletedTest(principal.getName());
            return ResponseEntity.ok(Map.of("hasCompleted", hasCompleted));
        } catch (Exception e) {
            log.error("Error checking test completion", e);
            return ResponseEntity.ok(Map.of("hasCompleted", false));
        }
    }
}
