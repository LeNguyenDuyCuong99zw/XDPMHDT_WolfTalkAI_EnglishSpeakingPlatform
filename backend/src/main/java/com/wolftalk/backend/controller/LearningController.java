package com.wolftalk.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wolftalk.backend.dto.learning.LevelDTO;
import com.wolftalk.backend.dto.learning.ScenarioDetailDTO;
import com.wolftalk.backend.dto.learning.TopicDTO;
import com.wolftalk.backend.dto.learning.UnitDTO;
import com.wolftalk.backend.dto.learning.content.ConversationDTO;
import com.wolftalk.backend.dto.learning.content.GrammarDTO;
import com.wolftalk.backend.dto.learning.content.VocabularyDTO;
import com.wolftalk.backend.service.SyllabusService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
public class LearningController {

    private final SyllabusService syllabusService;

    @GetMapping("/levels")
    public ResponseEntity<List<LevelDTO>> getLevels() {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(syllabusService.getLevels(email));
    }

    @GetMapping("/levels/{levelId}/units")
    public ResponseEntity<List<UnitDTO>> getUnitsByLevel(@PathVariable String levelId) {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(syllabusService.getUnitsByLevel(email, levelId));
    }

    @PostMapping("/units/{unitId}/unlock")
    public ResponseEntity<Void> unlockUnit(@PathVariable String unitId) {
        String email = getCurrentUserEmail();
        if (email == null)
            return ResponseEntity.status(401).build();
        syllabusService.unlockUnit(email, unitId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/units/{unitId}/complete")
    public ResponseEntity<Void> completeUnit(@PathVariable String unitId, @RequestParam(defaultValue = "0") int score) {
        String email = getCurrentUserEmail();
        if (email == null)
            return ResponseEntity.status(401).build();
        syllabusService.completeUnit(email, unitId, score);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<Void> completeLesson(@PathVariable String lessonId) {
        String email = getCurrentUserEmail();
        if (email == null)
            return ResponseEntity.status(401).build();
        syllabusService.completeLesson(email, lessonId);
        return ResponseEntity.ok().build();
    }

    // --- Lesson Content Endpoints ---

    @GetMapping("/lessons/{lessonId}/vocabulary")
    public ResponseEntity<List<VocabularyDTO>> getLessonVocabulary(@PathVariable String lessonId) {
        return ResponseEntity.ok(syllabusService.getLessonVocabulary(lessonId));
    }

    @GetMapping("/lessons/{lessonId}/grammar")
    public ResponseEntity<List<GrammarDTO>> getLessonGrammar(@PathVariable String lessonId) {
        return ResponseEntity.ok(syllabusService.getLessonGrammar(lessonId));
    }

    @GetMapping("/lessons/{lessonId}/conversation")
    public ResponseEntity<List<ConversationDTO>> getLessonConversation(@PathVariable String lessonId) {
        return ResponseEntity.ok(syllabusService.getLessonConversation(lessonId));
    }

    // --- Topic & Scenario (Free Mode) Endpoints ---

    @GetMapping("/topics")
    public ResponseEntity<List<TopicDTO>> getTopics() {
        return ResponseEntity.ok(syllabusService.getTopicGroups());
    }

    @GetMapping("/topics/{topicName}/scenarios")
    public ResponseEntity<List<String>> getScenariosByTopic(@PathVariable String topicName) {
        return ResponseEntity.ok(syllabusService.getScenariosByTopic(topicName));
    }

    @GetMapping("/scenarios/{scenarioIdOrTitle}/detail")
    public ResponseEntity<ScenarioDetailDTO> getScenarioDetail(@PathVariable String scenarioIdOrTitle) {
        return ResponseEntity.ok(syllabusService.getScenarioDetail(scenarioIdOrTitle));
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

        if (principal instanceof String && !"anonymousUser".equals(principal)) {
            return (String) principal;
        }

        return authentication.getName();
    }
}
