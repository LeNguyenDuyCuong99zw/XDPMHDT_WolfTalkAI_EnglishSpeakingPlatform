package com.wolftalk.backend.controller;

import com.wolftalk.backend.dto.learning.content.CheckpointTestDTO;
import com.wolftalk.backend.service.CheckpointService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/learning/checkpoints")
@RequiredArgsConstructor
public class CheckpointController {

    private final CheckpointService checkpointService;

    @GetMapping("/{levelId}")
    public ResponseEntity<CheckpointTestDTO> getTestForLevel(@PathVariable String levelId) {
        CheckpointTestDTO test = checkpointService.getTestForLevel(levelId);
        if (test == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(test);
    }

    @PostMapping("/{testId}/submit")
    public ResponseEntity<com.wolftalk.backend.dto.TestResultDTO> submitTest(
            @PathVariable String testId,
            @RequestBody com.wolftalk.backend.dto.TestSubmissionDTO submission,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {

        if (userDetails == null)
            return ResponseEntity.status(401).build();

        submission.setTestId(testId);
        return ResponseEntity.ok(checkpointService.submitTest(userDetails.getUsername(), submission));
    }
}
