package com.wolftalk.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wolftalk.backend.dto.PlacementTestDTO;
import com.wolftalk.backend.dto.PlacementTestStepRequest;
import com.wolftalk.backend.entity.PlacementTest;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.PlacementTestRepository;
import com.wolftalk.backend.repository.UserRepository;

@Service
public class PlacementTestService {

    @Autowired
    private PlacementTestRepository placementTestRepository;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public PlacementTestDTO startTest(String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user already has an incomplete test
        var existingTest = placementTestRepository.findByUserAndIsCompletedFalse(user);
        if (existingTest.isPresent()) {
            return convertToDTO(existingTest.get());
        }

        // Create new placement test
        PlacementTest test = new PlacementTest();
        test.setUser(user);
        test.setCurrentStep(1);
        test.setIsCompleted(false);

        PlacementTest saved = placementTestRepository.save(test);
        return convertToDTO(saved);
    }

    @Transactional
    public PlacementTestDTO updateTestStep(String userEmail, PlacementTestStepRequest request) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PlacementTest test = placementTestRepository.findById(request.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found"));

        if (!test.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Update based on step
        switch (request.getStep()) {
            case 1: // Language Selection
                test.setTargetLanguage(request.getTargetLanguage());
                break;
            case 2: // Daily Goal
                test.setDailyGoalMinutes(request.getDailyGoalMinutes());
                break;
            case 3: // Learning Goals
                try {
                    test.setLearningGoals(objectMapper.writeValueAsString(request.getLearningGoals()));
                } catch (Exception e) {
                    throw new RuntimeException("Error saving learning goals");
                }
                break;
            case 4: // Current Level
                test.setCurrentLevel(request.getCurrentLevel());
                break;
            case 5: // Learning Reasons
                try {
                    test.setLearningReasons(objectMapper.writeValueAsString(request.getLearningReasons()));
                } catch (Exception e) {
                    throw new RuntimeException("Error saving learning reasons");
                }
                break;
            case 6: // Discovery Source
                test.setDiscoverySource(request.getDiscoverySource());
                // Test is completed after this step
                test.setIsCompleted(true);
                calculateInitialResults(test);
                // Mark user as having completed placement test
                User userEntity = test.getUser();
                userEntity.setHasCompletedPlacementTest(true);
                userRepository.save(userEntity);
                break;
        }

        // Update current step
        if (request.getStep() < 6) {
            test.setCurrentStep(request.getStep() + 1);
        }

        // Handle quiz answer if provided
        if (request.getQuestionId() != null && request.getIsCorrect() != null) {
            updateQuizResults(test, request.getQuestionId(), request.getAnswer(), request.getIsCorrect());
        }

        PlacementTest updated = placementTestRepository.save(test);
        return convertToDTO(updated);
    }

    private void updateQuizResults(PlacementTest test, String questionId, String answer, Boolean isCorrect) {
        try {
            Map<String, Object> quizResults = new HashMap<>();
            if (test.getQuizResults() != null) {
                quizResults = objectMapper.readValue(test.getQuizResults(), new TypeReference<Map<String, Object>>() {
                });
            }

            Map<String, Object> questionResult = new HashMap<>();
            questionResult.put("answer", answer);
            questionResult.put("isCorrect", isCorrect);

            quizResults.put(questionId, questionResult);
            test.setQuizResults(objectMapper.writeValueAsString(quizResults));

            // Update totals
            test.setTotalQuestions(test.getTotalQuestions() + 1);
            if (isCorrect) {
                test.setTotalCorrectAnswers(test.getTotalCorrectAnswers() + 1);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error updating quiz results");
        }
    }

    private void calculateInitialResults(PlacementTest test) {
        // Calculate CEFR level based on current level
        String cefrLevel = "A1"; // Default beginner
        String learningPath = "beginner";

        if (test.getCurrentLevel() != null) {
            switch (test.getCurrentLevel()) {
                case "beginner":
                    cefrLevel = "A1";
                    learningPath = "beginner";
                    break;
                case "elementary":
                    cefrLevel = "A2";
                    learningPath = "elementary";
                    break;
                case "intermediate":
                    cefrLevel = "B1";
                    learningPath = "intermediate";
                    break;
                case "upper_intermediate":
                    cefrLevel = "B2";
                    learningPath = "upper_intermediate";
                    break;
                case "advanced":
                    cefrLevel = "C1";
                    learningPath = "advanced";
                    break;
                default:
                    cefrLevel = "A1";
                    learningPath = "beginner";
            }
        }

        test.setCefrLevel(cefrLevel);
        test.setLearningPath(learningPath);

        // Calculate scores based on quiz performance
        if (test.getTotalQuestions() > 0) {
            int percentage = (test.getTotalCorrectAnswers() * 100) / test.getTotalQuestions();
            test.setOverallScore(percentage);
            test.setPronunciationScore((double) percentage);
        } else {
            test.setOverallScore(0);
            test.setPronunciationScore(0.0);
        }

        test.setGrammarLevel(test.getCurrentLevel());
        test.setVocabularyLevel(test.getCurrentLevel());

        // Generate recommendations
        generateRecommendations(test);
    }

    private void generateRecommendations(PlacementTest test) {
        StringBuilder recommendations = new StringBuilder();
        recommendations.append("Based on your assessment:\n");
        recommendations.append("- Your CEFR level is: ").append(test.getCefrLevel()).append("\n");
        recommendations.append("- Daily practice goal: ").append(test.getDailyGoalMinutes()).append(" minutes\n");
        recommendations.append("- Focus on: ");

        try {
            if (test.getLearningGoals() != null) {
                List<String> goals = objectMapper.readValue(test.getLearningGoals(), new TypeReference<List<String>>() {
                });
                recommendations.append(String.join(", ", goals));
            }
        } catch (Exception e) {
            // Ignore
        }

        test.setRecommendations(recommendations.toString());
        test.setStrengths("Motivated to learn, clear goals");
        test.setWeaknesses("Need consistent practice");
    }

    public PlacementTestDTO getCurrentTest(String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PlacementTest test = placementTestRepository.findByUserAndIsCompletedFalse(user)
                .orElseThrow(() -> new RuntimeException("No active test found"));

        return convertToDTO(test);
    }

    public boolean hasCompletedTest(String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check user flag first (faster)
        if (user.getHasCompletedPlacementTest() != null && user.getHasCompletedPlacementTest()) {
            return true;
        }

        // Fallback to checking placement test table
        return placementTestRepository.existsByUserAndIsCompletedTrue(user);
    }

    private PlacementTestDTO convertToDTO(PlacementTest test) {
        PlacementTestDTO dto = new PlacementTestDTO();
        dto.setId(test.getId());
        dto.setUserId(test.getUser().getId());
        dto.setTestDate(test.getTestDate());
        dto.setTargetLanguage(test.getTargetLanguage());
        dto.setDailyGoalMinutes(test.getDailyGoalMinutes());

        // Parse JSON arrays
        try {
            if (test.getLearningGoals() != null) {
                dto.setLearningGoals(objectMapper.readValue(test.getLearningGoals(), new TypeReference<List<String>>() {
                }));
            }
            if (test.getLearningReasons() != null) {
                dto.setLearningReasons(
                        objectMapper.readValue(test.getLearningReasons(), new TypeReference<List<String>>() {
                        }));
            }
            if (test.getAudioUrls() != null) {
                dto.setAudioUrls(objectMapper.readValue(test.getAudioUrls(), new TypeReference<List<String>>() {
                }));
            }
        } catch (Exception e) {
            // Set empty lists if parsing fails
            dto.setLearningGoals(new ArrayList<>());
            dto.setLearningReasons(new ArrayList<>());
            dto.setAudioUrls(new ArrayList<>());
        }

        dto.setCurrentLevel(test.getCurrentLevel());
        dto.setDiscoverySource(test.getDiscoverySource());
        dto.setPronunciationScore(test.getPronunciationScore());
        dto.setAccuracyScore(test.getAccuracyScore());
        dto.setFluencyScore(test.getFluencyScore());
        dto.setCompletenessScore(test.getCompletenessScore());
        dto.setCefrLevel(test.getCefrLevel());
        dto.setOverallScore(test.getOverallScore());
        dto.setGrammarLevel(test.getGrammarLevel());
        dto.setVocabularyLevel(test.getVocabularyLevel());
        dto.setStrengths(test.getStrengths());
        dto.setWeaknesses(test.getWeaknesses());
        dto.setRecommendations(test.getRecommendations());
        dto.setAiAnalysis(test.getAiAnalysis());
        dto.setIsCompleted(test.getIsCompleted());
        dto.setCurrentStep(test.getCurrentStep());
        dto.setLearningPath(test.getLearningPath());
        dto.setTotalCorrectAnswers(test.getTotalCorrectAnswers());
        dto.setTotalQuestions(test.getTotalQuestions());

        return dto;
    }
}
