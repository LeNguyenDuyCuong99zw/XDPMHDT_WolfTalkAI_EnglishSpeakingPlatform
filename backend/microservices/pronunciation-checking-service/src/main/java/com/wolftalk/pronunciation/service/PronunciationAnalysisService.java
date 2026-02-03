package com.wolftalk.pronunciation.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wolftalk.pronunciation.dto.PronunciationCheckResponse;
import com.wolftalk.pronunciation.dto.VoskWord;
import com.wolftalk.pronunciation.dto.WordFeedback;
import com.wolftalk.pronunciation.entity.PronunciationAttempt;
import com.wolftalk.pronunciation.repository.PronunciationAttemptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PronunciationAnalysisService {
    
    private final VoskSpeechRecognitionService voskService;
    private final PronunciationAttemptRepository attemptRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Main method to check pronunciation
     */
    public PronunciationCheckResponse checkPronunciation(
            Long userId,
            String userEmail,
            MultipartFile audioFile, 
            String expectedText) throws IOException {
        
        log.info("Checking pronunciation for user: {}, expected text: {}", userId, expectedText);
        
        // Step 1: Transcribe audio using Vosk
        byte[] audioData = audioFile.getBytes();
        VoskSpeechRecognitionService.TranscriptionResult result = 
                voskService.transcribeAudio(audioData);
        
        String transcript = result.getTranscript();
        List<VoskWord> voskWords = result.getWords();
        
        log.info("Transcription result: {}", transcript);
        
        // Step 2: Analyze pronunciation
        List<WordFeedback> wordFeedback = analyzeWordLevel(voskWords, expectedText);
        
        // Step 3: Calculate scores
        double accuracyScore = calculateAccuracyScore(transcript, expectedText);
        double pronunciationScore = calculatePronunciationScore(voskWords);
        double overallScore = (accuracyScore + pronunciationScore) / 2.0;
        
        // Step 4: Determine level
        String level = determineLevel(overallScore);
        
        // Step 5: Generate suggestions
        List<String> suggestions = generateSuggestions(wordFeedback, overallScore);
        
        // Step 6: Award XP based on score
        if (userEmail != null) {
            awardXPBasedOnScore(userEmail, overallScore);
        }
        
        // Step 7: Save to database
        PronunciationAttempt attempt = savePronunciationAttempt(
                userId, expectedText, transcript, accuracyScore, 
                pronunciationScore, overallScore, level, 
                wordFeedback, suggestions);
        
        // Step 8: Build response
        return PronunciationCheckResponse.builder()
                .attemptId(attempt.getId())
                .transcript(transcript)
                .expectedText(expectedText)
                .accuracyScore(accuracyScore)
                .pronunciationScore(pronunciationScore)
                .overallScore(overallScore)
                .level(level)
                .wordFeedback(wordFeedback)
                .suggestions(suggestions)
                .build();
    }
    
    /**
     * Award XP to user based on pronunciation score
     * - Score >= 70: 5 XP
     * - Score >= 60: 3 XP
     */
    private void awardXPBasedOnScore(String userEmail, double score) {
        try {
            int xpToAward = 0;
            
            if (score >= 70) {
                xpToAward = 5;
            } else if (score >= 60) {
                xpToAward = 3;
            }
            
            if (xpToAward > 0) {
                // Use host.docker.internal to reach host machine from Docker container
                String backendUrl = "http://host.docker.internal:8080/api/leaderboard/award-xp";
                String url = String.format("%s?email=%s&xp=%d", backendUrl, userEmail, xpToAward);
                
                log.info("Awarding {} XP to user {} (score: {})", xpToAward, userEmail, score);
                
                // Call backend API to award XP
                org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                restTemplate.postForObject(url, null, Object.class);
                
                log.info("Successfully awarded {} XP to user {}", xpToAward, userEmail);
            }
        } catch (Exception e) {
            log.error("Failed to award XP to user {}: {}", userEmail, e.getMessage());
            // Don't fail the whole request if XP award fails
        }
    }
    
    /**
     * Analyze word-level pronunciation with color coding
     */
    private List<WordFeedback> analyzeWordLevel(List<VoskWord> voskWords, String expectedText) {
        List<String> expectedWords = Arrays.stream(expectedText.toLowerCase().split("\\s+"))
                .collect(Collectors.toList());
        
        List<WordFeedback> feedback = new ArrayList<>();
        
        for (int i = 0; i < voskWords.size(); i++) {
            VoskWord voskWord = voskWords.get(i);
            double confidence = voskWord.getConf();
            String word = voskWord.getWord();
            
            // Check if word matches expected
            boolean isCorrect = i < expectedWords.size() && 
                    word.equalsIgnoreCase(expectedWords.get(i));
            
            // Determine color based on confidence
            String color;
            String issue = null;
            
            if (confidence >= 0.7) {
                color = "green";
            } else if (confidence >= 0.5) {
                color = "orange";
                issue = "Pronunciation could be clearer";
            } else {
                color = "red";
                issue = "Low confidence - pronunciation needs improvement";
            }
            
            feedback.add(WordFeedback.builder()
                    .word(word)
                    .confidence(confidence)
                    .isCorrect(isCorrect)
                    .color(color)
                    .issue(issue)
                    .build());
        }
        
        return feedback;
    }
    
    /**
     * Calculate accuracy score based on word matching
     */
    private double calculateAccuracyScore(String transcript, String expectedText) {
        String[] transcriptWords = transcript.toLowerCase().split("\\s+");
        String[] expectedWords = expectedText.toLowerCase().split("\\s+");
        
        int matchCount = 0;
        int maxLength = Math.max(transcriptWords.length, expectedWords.length);
        
        for (int i = 0; i < Math.min(transcriptWords.length, expectedWords.length); i++) {
            if (transcriptWords[i].equals(expectedWords[i])) {
                matchCount++;
            }
        }
        
        return maxLength > 0 ? (double) matchCount / maxLength * 100.0 : 0.0;
    }
    
    /**
     * Calculate pronunciation score based on Vosk confidence scores
     */
    private double calculatePronunciationScore(List<VoskWord> words) {
        if (words.isEmpty()) {
            return 0.0;
        }
        
        double totalConfidence = words.stream()
                .mapToDouble(VoskWord::getConf)
                .sum();
        
        return (totalConfidence / words.size()) * 100.0;
    }
    
    /**
     * Determine proficiency level based on overall score
     */
    private String determineLevel(double overallScore) {
        if (overallScore >= 90) {
            return "Advanced";
        } else if (overallScore >= 75) {
            return "Upper intermediate";
        } else if (overallScore >= 60) {
            return "Intermediate";
        } else if (overallScore >= 45) {
            return "Lower intermediate";
        } else {
            return "Beginner";
        }
    }
    
    /**
     * Generate suggestions based on analysis
     */
    private List<String> generateSuggestions(List<WordFeedback> wordFeedback, double overallScore) {
        List<String> suggestions = new ArrayList<>();
        
        // Find words with low confidence
        List<String> problematicWords = wordFeedback.stream()
                .filter(w -> w.getConfidence() < 0.6)
                .map(WordFeedback::getWord)
                .collect(Collectors.toList());
        
        if (!problematicWords.isEmpty()) {
            suggestions.add("Practice these words: " + String.join(", ", problematicWords));
        }
        
        if (overallScore < 60) {
            suggestions.add("Try speaking more slowly and clearly");
            suggestions.add("Focus on pronouncing each word distinctly");
        } else if (overallScore < 80) {
            suggestions.add("Good progress! Keep practicing to improve fluency");
        } else {
            suggestions.add("Excellent pronunciation! Keep up the great work");
        }
        
        return suggestions;
    }
    
    /**
     * Save pronunciation attempt to database
     */
    private PronunciationAttempt savePronunciationAttempt(
            Long userId, String expectedText, String transcript,
            double accuracyScore, double pronunciationScore, double overallScore,
            String level, List<WordFeedback> wordFeedback, List<String> suggestions) {
        
        try {
            String wordFeedbackJson = objectMapper.writeValueAsString(wordFeedback);
            String suggestionsJson = objectMapper.writeValueAsString(suggestions);
            
            PronunciationAttempt attempt = PronunciationAttempt.builder()
                    .userId(userId)
                    .expectedText(expectedText)
                    .transcript(transcript)
                    .accuracyScore(accuracyScore)
                    .pronunciationScore(pronunciationScore)
                    .overallScore(overallScore)
                    .level(level)
                    .wordFeedbackJson(wordFeedbackJson)
                    .suggestionsJson(suggestionsJson)
                    .build();
            
            return attemptRepository.save(attempt);
        } catch (JsonProcessingException e) {
            log.error("Error serializing feedback to JSON", e);
            throw new RuntimeException("Failed to save pronunciation attempt", e);
        }
    }
    
    /**
     * Get pronunciation history for a user
     */
    public List<PronunciationAttempt> getUserHistory(Long userId) {
        return attemptRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
    }
}
