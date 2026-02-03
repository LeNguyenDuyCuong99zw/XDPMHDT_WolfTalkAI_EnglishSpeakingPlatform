package com.wolftalk.backend.controller;

import com.wolftalk.backend.dto.MentorLearnerDTO;
import com.wolftalk.backend.service.MentorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller cho các API liên quan đến Mentor
 */
@RestController
@RequestMapping("/api/mentor")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MentorController {

    @Autowired
    private MentorService mentorService;

    /**
     * Lấy danh sách learners được gán cho mentor
     * GET /api/mentor/learners?packageFilter=PROFESSIONAL
     * 
     * @param packageFilter - "PROFESSIONAL", "PREMIUM", hoặc "ALL" (default: "ALL")
     * @return List<MentorLearnerDTO>
     */
    @GetMapping("/learners")
    public ResponseEntity<List<MentorLearnerDTO>> getMentorLearners(
            @RequestParam(defaultValue = "ALL") String packageFilter) {
        List<MentorLearnerDTO> learners = mentorService.getMentorLearners(packageFilter);
        return ResponseEntity.ok(learners);
    }

    /**
     * Lấy thống kê tổng quan cho mentor
     * GET /api/mentor/stats
     * 
     * @return MentorStatsDTO
     */
    @GetMapping("/stats")
    public ResponseEntity<MentorService.MentorStatsDTO> getMentorStats() {
        MentorService.MentorStatsDTO stats = mentorService.getMentorStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy chi tiết learner cụ thể
     * GET /api/mentor/learners/{learnerId}
     * 
     * @param learnerId - ID của learner
     * @return MentorLearnerDTO
     */
    @GetMapping("/learners/{learnerId}")
    public ResponseEntity<MentorLearnerDTO> getLearnerDetails(@PathVariable Long learnerId) {
        // TODO: Implement get learner details
        return ResponseEntity.notFound().build();
    }
}
