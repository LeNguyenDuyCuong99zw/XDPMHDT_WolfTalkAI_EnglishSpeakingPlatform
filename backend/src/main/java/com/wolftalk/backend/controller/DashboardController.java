package com.wolftalk.backend.controller;

import com.wolftalk.backend.dto.DashboardStatsDTO;
import com.wolftalk.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        String email = getCurrentUserEmail();
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        // Loading stats also updates activity streak
        dashboardService.markActivity(email);
        return ResponseEntity.ok(dashboardService.getStats(email));
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("DEBUG DashboardController: No authenticated user found.");
            return null;
        }

        Object principal = authentication.getPrincipal();
        System.out.println("DEBUG DashboardController: Found principal of type " + principal.getClass().getName() + ": "
                + principal);

        if (principal instanceof Jwt) {
            String email = ((Jwt) principal).getClaimAsString("email");
            System.out.println("DEBUG DashboardController: Extracted email from JWT: " + email);
            return email;
        }

        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            String email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
            System.out.println("DEBUG DashboardController: Extracted email from UserDetails: " + email);
            return email;
        }

        if (principal instanceof String && !"anonymousUser".equals(principal)) {
            System.out.println("DEBUG DashboardController: Using principal String as email: " + principal);
            return (String) principal;
        }

        System.out.println(
                "DEBUG DashboardController: Falling back to authentication.getName(): " + authentication.getName());
        return authentication.getName();
    }
}
