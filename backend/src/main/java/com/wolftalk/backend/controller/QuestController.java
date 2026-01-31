package com.wolftalk.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wolftalk.backend.dto.DailyQuestProgressDTO;
import com.wolftalk.backend.dto.MonthlyChallengeProgressDTO;
import com.wolftalk.backend.dto.QuestDashboardDTO;
import com.wolftalk.backend.service.QuestService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller cho Daily Quests và Monthly Challenges (Duolingo style)
 * 
 * Endpoints:
 * - GET /api/quests/dashboard - Lấy toàn bộ quest dashboard
 * - GET /api/quests/daily - Lấy daily quests hôm nay
 * - GET /api/quests/monthly - Lấy monthly challenge hiện tại
 * - POST /api/quests/claim - Claim reward cho quest đã hoàn thành
 */
@RestController
@RequestMapping("/api/quests")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuestController {

    private final QuestService questService;

    /**
     * Lấy toàn bộ quest dashboard của user
     * Bao gồm: daily quests, monthly challenge, stats, unclaimed rewards
     * 
     * GET /api/quests/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<?> getQuestDashboard(Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body(errorResponse("Unauthorized"));
            }

            QuestDashboardDTO dashboard = questService.getQuestDashboardByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("dashboard", dashboard);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting quest dashboard", e);
            return ResponseEntity.status(500).body(errorResponse(e.getMessage()));
        }
    }

    /**
     * Lấy daily quests của user hôm nay
     * 
     * GET /api/quests/daily
     */
    @GetMapping("/daily")
    public ResponseEntity<?> getDailyQuests(Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body(errorResponse("Unauthorized"));
            }

            List<DailyQuestProgressDTO> dailyQuests = questService.getDailyQuestsByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("quests", dailyQuests);
            response.put("count", dailyQuests.size());
            response.put("completedCount", dailyQuests.stream()
                    .filter(q -> q.getStatus().name().equals("COMPLETED") || 
                                 q.getStatus().name().equals("CLAIMED"))
                    .count());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting daily quests", e);
            return ResponseEntity.status(500).body(errorResponse(e.getMessage()));
        }
    }

    /**
     * Lấy monthly challenge hiện tại của user
     * 
     * GET /api/quests/monthly
     */
    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyChallenge(Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body(errorResponse("Unauthorized"));
            }

            MonthlyChallengeProgressDTO challenge = questService.getCurrentMonthlyChallengeByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("challenge", challenge);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting monthly challenge", e);
            return ResponseEntity.status(500).body(errorResponse(e.getMessage()));
        }
    }

    /**
     * Claim reward cho quest đã hoàn thành
     * 
     * POST /api/quests/claim
     * Body: { "progressId": 123 }
     */
    @PostMapping("/claim")
    public ResponseEntity<?> claimReward(
            @RequestBody QuestDashboardDTO.ClaimRewardRequest request,
            Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body(errorResponse("Unauthorized"));
            }

            QuestDashboardDTO.ClaimRewardResponse result = questService.claimRewardByEmail(
                    email, request.getProgressId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", result.getSuccess());
            response.put("result", result);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error claiming reward", e);
            return ResponseEntity.status(500).body(errorResponse(e.getMessage()));
        }
    }

    /**
     * Claim tất cả rewards chưa nhận
     * 
     * POST /api/quests/claim-all
     */
    @PostMapping("/claim-all")
    public ResponseEntity<?> claimAllRewards(Authentication auth) {
        try {
            String email = extractEmail(auth);
            if (email == null) {
                return ResponseEntity.status(401).body(errorResponse("Unauthorized"));
            }

            // Get dashboard to find unclaimed rewards
            QuestDashboardDTO dashboard = questService.getQuestDashboardByEmail(email);
            
            int totalXpClaimed = 0;
            int totalGemsClaimed = 0;
            int claimedCount = 0;

            // Claim daily quest rewards
            for (DailyQuestProgressDTO quest : dashboard.getDailyQuests()) {
                if (quest.getProgressId() != null && 
                    quest.getStatus().name().equals("COMPLETED") && 
                    !quest.getRewardClaimed()) {
                    
                    QuestDashboardDTO.ClaimRewardResponse result = questService.claimRewardByEmail(
                            email, quest.getProgressId());
                    
                    if (result.getSuccess()) {
                        totalXpClaimed += result.getXpEarned();
                        totalGemsClaimed += result.getGemsEarned();
                        claimedCount++;
                    }
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("claimedCount", claimedCount);
            response.put("totalXpClaimed", totalXpClaimed);
            response.put("totalGemsClaimed", totalGemsClaimed);
            response.put("message", claimedCount > 0 
                    ? String.format("Đã nhận %d phần thưởng!", claimedCount)
                    : "Không có phần thưởng nào để nhận");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error claiming all rewards", e);
            return ResponseEntity.status(500).body(errorResponse(e.getMessage()));
        }
    }

    // Helper methods
    private String extractEmail(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof Jwt) {
            return ((Jwt) principal).getClaimAsString("email");
        }
        
        // Handle case where principal is a String (email directly from JwtAuthenticationFilter)
        if (principal instanceof String) {
            return (String) principal;
        }

        return null;
    }

    private Map<String, Object> errorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }
}
