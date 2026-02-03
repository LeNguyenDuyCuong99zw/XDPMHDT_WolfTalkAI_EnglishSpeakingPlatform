package com.wolftalk.pronunciation.controller;

import com.wolftalk.pronunciation.entity.PracticeSentence;
import com.wolftalk.pronunciation.service.PracticeSentenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/pronunciation/sentences")
@RequiredArgsConstructor
@Slf4j
public class SentenceController {
    
    private final PracticeSentenceService sentenceService;
    
    @GetMapping("/random")
    public ResponseEntity<PracticeSentence> getRandomSentence(@org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "NORMAL") String type) {
        try {
            PracticeSentence sentence = sentenceService.getRandomSentence(type);
            return ResponseEntity.ok(sentence);
        } catch (Exception e) {
            log.error("Error fetching random sentence", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
