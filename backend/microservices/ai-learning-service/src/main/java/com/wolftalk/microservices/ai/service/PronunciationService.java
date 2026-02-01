package com.wolftalk.microservices.ai.service;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import com.wolftalk.microservices.ai.dto.PronunciationAssessmentResponse;
import com.wolftalk.microservices.ai.entity.PronunciationAssessment;
import com.wolftalk.microservices.ai.repository.PronunciationAssessmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PronunciationService {
    
    private final PronunciationAssessmentRepository assessmentRepository;
    private final AIProviderService aiProviderService;
    
    @Value("${google.speech.language.code}")
    private String languageCode;
    
    public PronunciationAssessmentResponse assessPronunciation(
            Long userId, 
            MultipartFile audioFile, 
            String expectedText) throws IOException {
        
        log.info("Assessing pronunciation for user: {}", userId);
        
        // Step 1: Transcribe audio using Google Speech-to-Text
        String transcript = transcribeAudio(audioFile);
        
        // Step 2: Calculate pronunciation scores
        BigDecimal accuracyScore = calculateAccuracyScore(transcript, expectedText);
        BigDecimal fluencyScore = calculateFluencyScore(transcript);
        BigDecimal pronunciationScore = calculatePronunciationScore(transcript, expectedText);
        BigDecimal overallScore = calculateOverallScore(accuracyScore, fluencyScore, pronunciationScore);
        
        // Step 3: Get AI feedback using Gemini
        List<String> suggestions = aiProviderService.generatePronunciationSuggestions(
                transcript, expectedText, AIProviderService.AIProvider.AUTO);
        String generalFeedback = aiProviderService.generatePronunciationFeedback(
                transcript, expectedText, overallScore, AIProviderService.AIProvider.AUTO);
        
        // Step 4: Analyze word-level feedback
        List<PronunciationAssessmentResponse.WordFeedback> wordFeedback = 
                analyzeWordLevelPronunciation(transcript, expectedText);
        
        // Step 5: Save assessment to database
        PronunciationAssessment assessment = PronunciationAssessment.builder()
                .userId(userId)
                .transcript(transcript)
                .expectedText(expectedText)
                .accuracyScore(accuracyScore)
                .fluencyScore(fluencyScore)
                .pronunciationScore(pronunciationScore)
                .feedback(generalFeedback)
                .build();
        
        assessment = assessmentRepository.save(assessment);
        
        // Step 6: Build response
        return PronunciationAssessmentResponse.builder()
                .assessmentId(assessment.getId())
                .transcript(transcript)
                .accuracyScore(accuracyScore)
                .fluencyScore(fluencyScore)
                .pronunciationScore(pronunciationScore)
                .overallScore(overallScore)
                .wordFeedback(wordFeedback)
                .suggestions(suggestions)
                .generalFeedback(generalFeedback)
                .build();
    }
    
    private String transcribeAudio(MultipartFile audioFile) throws IOException {
        try (SpeechClient speechClient = SpeechClient.create()) {
            ByteString audioBytes = ByteString.copyFrom(audioFile.getBytes());
            
            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(audioBytes)
                    .build();
            
            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
                    .setLanguageCode(languageCode)
                    .setEnableAutomaticPunctuation(true)
                    .setModel("default")
                    .build();
            
            RecognizeResponse response = speechClient.recognize(config, audio);
            
            StringBuilder transcript = new StringBuilder();
            for (SpeechRecognitionResult result : response.getResultsList()) {
                SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
                transcript.append(alternative.getTranscript());
            }
            
            return transcript.toString().trim();
        }
    }
    
    private BigDecimal calculateAccuracyScore(String transcript, String expectedText) {
        if (transcript == null || expectedText == null) {
            return BigDecimal.ZERO;
        }
        
        String[] transcriptWords = transcript.toLowerCase().split("\\s+");
        String[] expectedWords = expectedText.toLowerCase().split("\\s+");
        
        int matchCount = 0;
        int maxLength = Math.max(transcriptWords.length, expectedWords.length);
        
        for (int i = 0; i < Math.min(transcriptWords.length, expectedWords.length); i++) {
            if (transcriptWords[i].equals(expectedWords[i])) {
                matchCount++;
            }
        }
        
        return BigDecimal.valueOf((double) matchCount / maxLength * 100)
                .setScale(2, RoundingMode.HALF_UP);
    }
    
    private BigDecimal calculateFluencyScore(String transcript) {
        // Simple fluency calculation based on word count and sentence structure
        int wordCount = transcript.split("\\s+").length;
        int sentenceCount = transcript.split("[.!?]").length;
        
        double avgWordsPerSentence = (double) wordCount / Math.max(sentenceCount, 1);
        
        // Ideal range: 10-20 words per sentence
        double fluencyScore = 100.0;
        if (avgWordsPerSentence < 5) {
            fluencyScore = 60.0;
        } else if (avgWordsPerSentence > 25) {
            fluencyScore = 70.0;
        }
        
        return BigDecimal.valueOf(fluencyScore).setScale(2, RoundingMode.HALF_UP);
    }
    
    private BigDecimal calculatePronunciationScore(String transcript, String expectedText) {
        // Combine accuracy and length similarity
        BigDecimal accuracyScore = calculateAccuracyScore(transcript, expectedText);
        
        double lengthRatio = (double) transcript.length() / Math.max(expectedText.length(), 1);
        double lengthScore = 100.0;
        
        if (lengthRatio < 0.8 || lengthRatio > 1.2) {
            lengthScore = 70.0;
        }
        
        return accuracyScore.multiply(BigDecimal.valueOf(0.7))
                .add(BigDecimal.valueOf(lengthScore * 0.3))
                .setScale(2, RoundingMode.HALF_UP);
    }
    
    private BigDecimal calculateOverallScore(BigDecimal accuracy, BigDecimal fluency, BigDecimal pronunciation) {
        return accuracy.multiply(BigDecimal.valueOf(0.4))
                .add(fluency.multiply(BigDecimal.valueOf(0.3)))
                .add(pronunciation.multiply(BigDecimal.valueOf(0.3)))
                .setScale(2, RoundingMode.HALF_UP);
    }
    
    private List<PronunciationAssessmentResponse.WordFeedback> analyzeWordLevelPronunciation(
            String transcript, String expectedText) {
        
        List<PronunciationAssessmentResponse.WordFeedback> feedbackList = new ArrayList<>();
        String[] transcriptWords = transcript.toLowerCase().split("\\s+");
        String[] expectedWords = expectedText.toLowerCase().split("\\s+");
        
        for (int i = 0; i < Math.min(transcriptWords.length, expectedWords.length); i++) {
            String transcriptWord = transcriptWords[i];
            String expectedWord = expectedWords[i];
            
            BigDecimal wordScore = transcriptWord.equals(expectedWord) 
                    ? BigDecimal.valueOf(100) 
                    : BigDecimal.valueOf(50);
            
            String issue = transcriptWord.equals(expectedWord) 
                    ? "Correct" 
                    : "Mispronounced";
            
            feedbackList.add(PronunciationAssessmentResponse.WordFeedback.builder()
                    .word(expectedWord)
                    .score(wordScore)
                    .phonetic("/" + expectedWord + "/")
                    .issue(issue)
                    .build());
        }
        
        return feedbackList;
    }
}
