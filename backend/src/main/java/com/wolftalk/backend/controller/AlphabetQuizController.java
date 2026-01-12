package com.wolftalk.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wolftalk.backend.dto.AlphabetProgressRequest;
import com.wolftalk.backend.dto.AlphabetQuestionDTO;
import com.wolftalk.backend.service.AlphabetQuestionService;

@RestController
@RequestMapping("/api/alphabet")
public class AlphabetQuizController {
    
    @Autowired
    private AlphabetQuestionService alphabetQuestionService;
    
    @GetMapping("/questions")
    public ResponseEntity<List<AlphabetQuestionDTO>> getQuestions(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String type) {
        
        List<AlphabetQuestionDTO> questions;
        if (type != null && !type.isEmpty()) {
            questions = alphabetQuestionService.getQuestionsByType(type, limit);
        } else {
            questions = alphabetQuestionService.getRandomQuestions(limit);
        }
        
        return ResponseEntity.ok(questions);
    }
    
    @PostMapping("/progress")
    public ResponseEntity<Map<String, Object>> saveProgress(
            @RequestBody AlphabetProgressRequest request,
            Authentication authentication) {
        
        String email = authentication.getName();
        Map<String, Object> response = alphabetQuestionService.saveProgress(email, request);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/progress")
    public ResponseEntity<Map<String, Object>> getProgress(Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> progress = alphabetQuestionService.getUserProgress(email);
        
        return ResponseEntity.ok(progress);
    }
}
