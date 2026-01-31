package com.wolftalk.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.dto.AlphabetProgressRequest;
import com.wolftalk.backend.dto.AlphabetQuestionDTO;
import com.wolftalk.backend.entity.AlphabetQuestion;
import com.wolftalk.backend.entity.AlphabetQuizProgress;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.AlphabetQuestionRepository;
import com.wolftalk.backend.repository.AlphabetQuizProgressRepository;
import com.wolftalk.backend.repository.UserRepository;

@Service
public class AlphabetQuestionService {
    
    @Autowired
    private AlphabetQuestionRepository alphabetQuestionRepository;
    
    @Autowired
    private AlphabetQuizProgressRepository progressRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<AlphabetQuestionDTO> getRandomQuestions(int limit) {
        List<AlphabetQuestion> questions = alphabetQuestionRepository.findRandomQuestions(limit);
        return questions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AlphabetQuestionDTO> getQuestionsByType(String type, int limit) {
        List<AlphabetQuestion> questions = alphabetQuestionRepository.findRandomQuestionsByType(type, limit);
        return questions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public Map<String, Object> saveProgress(String email, AlphabetProgressRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        AlphabetQuestion question = alphabetQuestionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        AlphabetQuizProgress progress = new AlphabetQuizProgress();
        progress.setUser(user);
        progress.setQuestion(question);
        progress.setUserAnswer(request.getUserAnswer());
        progress.setIsCorrect(request.getIsCorrect());
        progress.setPronunciationScore(request.getPronunciationScore());
        progress.setTimeSpentSeconds(request.getTimeSpentSeconds());
        
        progressRepository.save(progress);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Progress saved successfully");
        response.put("isCorrect", request.getIsCorrect());
        
        return response;
    }
    
    public Map<String, Object> getUserProgress(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long correctAnswers = progressRepository.countCorrectAnswersByUser(user);
        Double avgScore = progressRepository.getAveragePronunciationScore(user);
        List<AlphabetQuizProgress> recentProgress = progressRepository.findByUserOrderByCompletedAtDesc(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalCorrect", correctAnswers);
        response.put("averagePronunciationScore", avgScore != null ? avgScore : 0.0);
        response.put("totalAttempts", recentProgress.size());
        response.put("recentResults", recentProgress.stream()
                .limit(10)
                .map(p -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("questionId", p.getQuestion().getId());
                    result.put("targetWord", p.getQuestion().getTargetWord());
                    result.put("isCorrect", p.getIsCorrect());
                    result.put("pronunciationScore", p.getPronunciationScore());
                    result.put("completedAt", p.getCompletedAt());
                    return result;
                })
                .collect(Collectors.toList()));
        
        return response;
    }
    
    private AlphabetQuestionDTO convertToDTO(AlphabetQuestion question) {
        AlphabetQuestionDTO dto = new AlphabetQuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionType(question.getQuestionType());
        dto.setTargetWord(question.getTargetWord());
        dto.setTargetIpa(question.getTargetIpa());
        dto.setAudioUrl(question.getAudioUrl());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        dto.setComparisonWord(question.getComparisonWord());
        dto.setComparisonIpa(question.getComparisonIpa());
        dto.setComparisonAudioUrl(question.getComparisonAudioUrl());
        dto.setDifficultyLevel(question.getDifficultyLevel());
        return dto;
    }
}
