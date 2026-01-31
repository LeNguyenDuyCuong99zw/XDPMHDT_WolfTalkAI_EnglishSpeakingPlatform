package com.wolftalk.backend.service;

import com.wolftalk.backend.dto.*;
import com.wolftalk.backend.entity.InitialAssessment;
import com.wolftalk.backend.entity.InitialAssessmentQuestion;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.InitialAssessmentQuestionRepository;
import com.wolftalk.backend.repository.InitialAssessmentRepository;
import com.wolftalk.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class InitialAssessmentService {
    
    @Autowired
    private InitialAssessmentRepository assessmentRepository;
    
    @Autowired
    private InitialAssessmentQuestionRepository questionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Bắt đầu bài test mới
    public InitialAssessmentDTO startTest(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        InitialAssessment assessment = new InitialAssessment();
        assessment.setUser(user);
        assessment.setStatus("ACTIVE");
        assessment.setCreatedAt(Instant.now());
        assessment.setTotalQuestions(20);
        assessment.setTotalScore(0);
        assessment.setCorrectAnswers(0);
        
        InitialAssessment saved = assessmentRepository.save(assessment);
        log.info("Started new assessment for user: {}", email);
        
        return mapToDTO(saved);
    }
    
    // Lấy 20 câu hỏi ngẫu nhiên
    public List<InitialAssessmentQuestionDTO> getRandomQuestions(Long assessmentId) {
        InitialAssessment assessment = assessmentRepository.findById(assessmentId)
            .orElseThrow(() -> new RuntimeException("Assessment not found"));
        
        if (!assessment.getStatus().equals("ACTIVE")) {
            throw new RuntimeException("Assessment is not active");
        }
        
        // Lấy 20 câu hỏi ngẫu nhiên
        List<InitialAssessmentQuestion> questions = questionRepository.findRandomQuestions(20);
        
        if (questions.isEmpty()) {
            throw new RuntimeException("No questions available");
        }
        
        return questions.stream()
            .map(this::mapQuestionToDTO)
            .collect(Collectors.toList());
    }
    
    // Xử lý câu trả lời
    public void submitAnswer(InitialAssessmentAnswerRequest request) {
        InitialAssessment assessment = assessmentRepository.findById(request.getAssessmentId())
            .orElseThrow(() -> new RuntimeException("Assessment not found"));
        
        InitialAssessmentQuestion question = questionRepository.findById(request.getQuestionId())
            .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // So sánh câu trả lời (không phân biệt hoa thường và khoảng trắng)
        boolean isCorrect = isAnswerCorrect(request.getAnswer(), question.getCorrectAnswer());
        
        if (isCorrect) {
            assessment.setCorrectAnswers(assessment.getCorrectAnswers() + 1);
            
            // Cộng điểm theo kỹ năng
            switch (question.getSkillType()) {
                case "LISTENING" -> {
                    assessment.setListeningCorrect(assessment.getListeningCorrect() + 1);
                    assessment.setListeningScore(assessment.getListeningCorrect() * 5); // 5 điểm mỗi câu
                }
                case "SPEAKING" -> {
                    assessment.setSpeakingCorrect(assessment.getSpeakingCorrect() + 1);
                    assessment.setSpeakingScore(assessment.getSpeakingCorrect() * 5);
                }
                case "WRITING" -> {
                    assessment.setWritingCorrect(assessment.getWritingCorrect() + 1);
                    assessment.setWritingScore(assessment.getWritingCorrect() * 5);
                }
                case "READING" -> {
                    assessment.setReadingCorrect(assessment.getReadingCorrect() + 1);
                    assessment.setReadingScore(assessment.getReadingCorrect() * 5);
                }
                default -> {}
            }
        }
        
        assessmentRepository.save(assessment);
        log.info("Answer submitted for assessment: {}, question: {}, correct: {}", 
            request.getAssessmentId(), request.getQuestionId(), isCorrect);
    }
    
    // Hoàn thành bài test và tính toán level
    public InitialAssessmentDTO completeTest(Long assessmentId) {
        InitialAssessment assessment = assessmentRepository.findById(assessmentId)
            .orElseThrow(() -> new RuntimeException("Assessment not found"));
        
        if (assessment.getCorrectAnswers() == null) {
            assessment.setCorrectAnswers(0);
        }
        
        // Tính tổng điểm (0-100)
        Integer totalScore = (assessment.getCorrectAnswers() * 100) / assessment.getTotalQuestions();
        assessment.setTotalScore(totalScore);
        
        // Xác định level
        String level = determineLevel(totalScore);
        assessment.setAssessmentLevel(level);
        
        // Tạo khuyến nghị
        LevelRecommendationDTO recommendation = generateRecommendation(assessment, level, totalScore);
        assessment.setRecommendation(recommendation.getRecommendation());
        assessment.setStrengths(recommendation.getStrengths());
        assessment.setWeaknesses(recommendation.getWeaknesses());
        
        assessment.setStatus("COMPLETED");
        assessment.setCompletedAt(Instant.now());
        
        InitialAssessment saved = assessmentRepository.save(assessment);
        log.info("Assessment completed for user: {}, level: {}, score: {}", 
            assessment.getUser().getEmail(), level, totalScore);
        
        return mapToDTO(saved);
    }
    
    // Lấy kết quả test hiện tại
    public InitialAssessmentDTO getCurrentTest(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        InitialAssessment assessment = assessmentRepository.findFirstByUserOrderByCreatedAtDesc(user)
            .orElseThrow(() -> new RuntimeException("No assessment found"));
        
        return mapToDTO(assessment);
    }
    
    // Kiểm tra xem user đã hoàn thành test chưa
    public boolean hasCompletedTest(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<InitialAssessment> assessments = assessmentRepository
            .findByUserAndStatus(user, "COMPLETED");
        
        return !assessments.isEmpty();
    }
    
    // Xác định level dựa vào điểm số
    private String determineLevel(Integer score) {
        if (score < 20) {
            return "BEGINNER";
        } else if (score < 40) {
            return "ELEMENTARY";
        } else if (score < 60) {
            return "INTERMEDIATE";
        } else if (score < 80) {
            return "UPPER_INTERMEDIATE";
        } else {
            return "ADVANCED";
        }
    }
    
    // Tạo khuyến nghị dựa vào kết quả
    private LevelRecommendationDTO generateRecommendation(InitialAssessment assessment, String level, Integer score) {
        LevelRecommendationDTO recommendation = new LevelRecommendationDTO();
        recommendation.setLevel(level);
        recommendation.setScore(score);
        
        StringBuilder strengths = new StringBuilder();
        StringBuilder weaknesses = new StringBuilder();
        String recommendText = "";
        String nextSteps = "";
        
        // Phân tích từng kỹ năng
        Integer listening = assessment.getListeningScore();
        Integer speaking = assessment.getSpeakingScore();
        Integer writing = assessment.getWritingScore();
        Integer reading = assessment.getReadingScore();
        
        if (listening > 15) strengths.append("Nghe hiểu tốt. ");
        else weaknesses.append("Cần cải thiện khả năng nghe. ");
        
        if (speaking > 15) strengths.append("Phát âm rõ. ");
        else weaknesses.append("Cần luyện phát âm thêm. ");
        
        if (writing > 15) strengths.append("Viết tốt. ");
        else weaknesses.append("Cần cải thiện viết câu. ");
        
        if (reading > 15) strengths.append("Đọc hiểu tốt.");
        else weaknesses.append("Cần cải thiện đọc hiểu.");
        
        // Khuyến nghị dựa vào level
        switch (level) {
            case "BEGINNER" -> {
                recommendText = "Bạn nên bắt đầu từ bài học cơ bản về bảng chữ cái và từ vựng thông dụng";
                nextSteps = "1. Hoàn thành bài test bảng chữ cái\n2. Học 100 từ vựng cơ bản\n3. Luyện phát âm";
            }
            case "ELEMENTARY" -> {
                recommendText = "Bạn sẵn sàng học các cấu trúc câu cơ bản và mở rộng từ vựng";
                nextSteps = "1. Học ngữ pháp tenses cơ bản\n2. Mở rộng từ vựng hàng ngày\n3. Luyện nói từng câu đơn giản";
            }
            case "INTERMEDIATE" -> {
                recommendText = "Bạn có thể học các chủ đề phức tạp hơn và cải thiện kỹ năng giao tiếp";
                nextSteps = "1. Học ngữ pháp nâng cao\n2. Luyện hội thoại thực tế\n3. Đọc các bài văn phức tạp";
            }
            case "UPPER_INTERMEDIATE" -> {
                recommendText = "Bạn sẵn sàng chuẩn bị cho các kỳ thi chứng chỉ tiếng Anh";
                nextSteps = "1. Chuẩn bị IELTS/TOEFL\n2. Luyện viết bài luận\n3. Xem video tiếng Anh chuyên sâu";
            }
            case "ADVANCED" -> {
                recommendText = "Bạn có thể tham gia các cuộc hội thoại phức tạp và sử dụng tiếng Anh chuyên nghiệp";
                nextSteps = "1. Luyện các lĩnh vực chuyên môn\n2. Cải thiện accent và phát âm\n3. Theo dõi tin tức tiếng Anh";
            }
        }
        
        recommendation.setRecommendation(recommendText);
        recommendation.setStrengths(strengths.toString());
        recommendation.setWeaknesses(weaknesses.toString());
        recommendation.setNextSteps(nextSteps);
        
        return recommendation;
    }
    
    // So sánh câu trả lời
    private boolean isAnswerCorrect(String userAnswer, String correctAnswer) {
        if (userAnswer == null || correctAnswer == null) {
            return false;
        }
        
        // Normalize: lowercase, trim whitespace
        String normalized = userAnswer.toLowerCase().trim();
        String expected = correctAnswer.toLowerCase().trim();
        
        // Chính xác hoặc chứa từ khóa chính
        return normalized.equals(expected) || normalized.contains(expected) || expected.contains(normalized);
    }
    
    // Map Entity to DTO
    private InitialAssessmentDTO mapToDTO(InitialAssessment assessment) {
        InitialAssessmentDTO dto = new InitialAssessmentDTO();
        dto.setId(assessment.getId());
        dto.setTotalScore(assessment.getTotalScore());
        dto.setCorrectAnswers(assessment.getCorrectAnswers());
        dto.setTotalQuestions(assessment.getTotalQuestions());
        dto.setAssessmentLevel(assessment.getAssessmentLevel());
        dto.setListeningScore(assessment.getListeningScore());
        dto.setSpeakingScore(assessment.getSpeakingScore());
        dto.setWritingScore(assessment.getWritingScore());
        dto.setReadingScore(assessment.getReadingScore());
        dto.setRecommendation(assessment.getRecommendation());
        dto.setStrengths(assessment.getStrengths());
        dto.setWeaknesses(assessment.getWeaknesses());
        dto.setCreatedAt(assessment.getCreatedAt());
        dto.setCompletedAt(assessment.getCompletedAt());
        dto.setStatus(assessment.getStatus());
        return dto;
    }
    
    // Map Question Entity to DTO
    private InitialAssessmentQuestionDTO mapQuestionToDTO(InitialAssessmentQuestion question) {
        InitialAssessmentQuestionDTO dto = new InitialAssessmentQuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionType(question.getQuestionType());
        dto.setAnswerFormat(question.getAnswerFormat());
        dto.setQuestionText(question.getQuestionText());
        dto.setAudioUrl(question.getAudioUrl());
        dto.setImageUrl(question.getImageUrl());
        
        // Parse options
        if (question.getOptions() != null && !question.getOptions().isEmpty()) {
            dto.setOptions(question.getOptions().split("\\|"));
        }
        
        dto.setDifficulty(question.getDifficulty());
        dto.setSkillType(question.getSkillType());
        dto.setExplanation(question.getExplanation());
        
        return dto;
    }
}
