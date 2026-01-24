package com.wolftalk.backend.controller;

import com.wolftalk.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class HeartbeatController {

    private final DashboardService dashboardService;

    @PostMapping("/heartbeat")
    public ResponseEntity<Void> heartbeat() {
        String email = getCurrentUserEmail();
        if (email != null) {
            dashboardService.incrementLearningTime(email);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(401).build();
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof Jwt) {
            return ((Jwt) principal).getClaimAsString("email");
        }
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            return ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        }
        if (principal instanceof String && !"anonymousUser".equals(principal)) {
            return (String) principal;
        }
        return authentication.getName();
    }
}
