package com.wolftalk.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wolftalk.backend.dto.LeaderboardEntryDTO;
import com.wolftalk.backend.dto.ListeningChallengeDTO;
import com.wolftalk.backend.dto.ListeningProgressDTO;
import com.wolftalk.backend.dto.ListeningSubmitDTO;
import com.wolftalk.backend.dto.ListeningTaskDTO;
import com.wolftalk.backend.service.ListeningService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/listening")
@RequiredArgsConstructor
public class ListeningController {

    private final ListeningService listeningService;

    // Get all challenges
    @GetMapping("/challenges")
    public ResponseEntity<List<ListeningChallengeDTO>> getAllChallenges() {
        return ResponseEntity.ok(listeningService.getAllChallenges());
    }

    // Get challenges by difficulty
    @GetMapping("/challenges/difficulty/{level}")
    public ResponseEntity<List<ListeningChallengeDTO>> getChallengesByDifficulty(
            @PathVariable Integer level) {
        return ResponseEntity.ok(listeningService.getChallengesByDifficulty(level));
    }

    // Get challenge details
    @GetMapping("/challenges/{id}")
    public ResponseEntity<ListeningChallengeDTO> getChallengeById(@PathVariable Long id) {
        return ResponseEntity.ok(listeningService.getChallengeById(id));
    }

    // Submit answer
    @PostMapping("/submit")
    public ResponseEntity<ListeningProgressDTO> submitAnswer(
            @RequestBody ListeningSubmitDTO submitDTO,
            Authentication authentication) {
        
        var userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(listeningService.submitAnswer(userId, submitDTO));
    }

    // Get user progress
    @GetMapping("/my-progress")
    public ResponseEntity<List<ListeningProgressDTO>> getUserProgress(
            Authentication authentication) {
        
        var userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(listeningService.getUserProgress(userId));
    }

    // Get leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDTO>> getLeaderboard(
            @RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(listeningService.getLeaderboard(limit));
    }

    // Get daily tasks
    @GetMapping("/tasks/daily")
    public ResponseEntity<List<ListeningTaskDTO>> getDailyTasks(
            Authentication authentication) {
        
        var userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(listeningService.getDailyTasks(userId));
    }

    // Complete task
    @PutMapping("/tasks/{taskId}/complete")
    public ResponseEntity<ListeningTaskDTO> completeTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(listeningService.completeTask(taskId));
    }
}
