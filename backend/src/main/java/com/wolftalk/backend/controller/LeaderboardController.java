package com.wolftalk.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wolftalk.backend.dto.UserLeaderboardStatsDTO;
import com.wolftalk.backend.dto.WeeklyLeaderboardEntryDTO;
import com.wolftalk.backend.service.LeaderboardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller cho Weekly Leaderboard (Duolingo style)
 * 
 * Endpoints:
 * - GET /api/leaderboard/weekly - Lấy top leaderboard của tuần
 * - GET /api/leaderboard/stats/me - Lấy thống kê cá nhân
 * - GET /api/leaderboard/history - Lấy lịch sử ranking
 */
@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@Slf4j
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    /**
     * Lấy top leaderboard của tuần hiện tại
     * 
     * @param limit Số lượng entries (default: 100)
     * @return List<WeeklyLeaderboardEntryDTO>
     */
    @GetMapping("/weekly")
    public ResponseEntity<List<WeeklyLeaderboardEntryDTO>> getWeeklyLeaderboard(
            @RequestParam(defaultValue = "100") int limit) {
        
        log.info("Fetching weekly leaderboard, limit: {}", limit);
        List<WeeklyLeaderboardEntryDTO> leaderboard = leaderboardService.getWeeklyLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }

    /**
     * Lấy thống kê leaderboard cá nhân (rank, XP, tier của user hiện tại)
     * 
     * @param authentication Thông tin user hiện tại
     * @return UserLeaderboardStatsDTO
     */
    @GetMapping("/stats/me")
    public ResponseEntity<UserLeaderboardStatsDTO> getMyStats(Authentication authentication) {
        String email = extractEmail(authentication);
        
        log.info("Fetching leaderboard stats for user: {}", email);
        UserLeaderboardStatsDTO stats = leaderboardService.getMyWeeklyStatsByEmail(email);
        return ResponseEntity.ok(stats);
    }

    /**
     * Lấy lịch sử ranking của user (tất cả các tuần trước đó)
     * Sử dụng để xem progress over time
     * 
     * @param authentication Thông tin user hiện tại
     * @return List<WeeklyLeaderboardEntryDTO>
     */
    @GetMapping("/history")
    public ResponseEntity<List<WeeklyLeaderboardEntryDTO>> getLeaderboardHistory(
            Authentication authentication) {
        String email = extractEmail(authentication);
        
        log.info("Fetching leaderboard history for user: {}", email);
        List<WeeklyLeaderboardEntryDTO> history = leaderboardService.getUserLeaderboardHistoryByEmail(email);
        return ResponseEntity.ok(history);
    }

    // Extract email from authentication
    private String extractEmail(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof Jwt) {
            // First try 'email' claim, then fallback to 'subject'
            String email = ((Jwt) principal).getClaimAsString("email");
            if (email != null) {
                return email;
            }
            // Fallback to subject which contains email in our JWT
            return ((Jwt) principal).getSubject();
        }
        
        // Handle case where principal is a String (email directly from JwtAuthenticationFilter)
        if (principal instanceof String) {
            return (String) principal;
        }

        return null;
    }
}
