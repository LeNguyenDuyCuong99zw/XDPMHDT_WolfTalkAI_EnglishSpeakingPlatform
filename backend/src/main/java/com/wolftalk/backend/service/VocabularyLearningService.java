package com.wolftalk.backend.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.dto.VocabularyLearningDTO;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.entity.UserVocabularyLevel;
import com.wolftalk.backend.entity.UserVocabularyProgress;
import com.wolftalk.backend.entity.VocabularyWord;
import com.wolftalk.backend.entity.VocabularyWord.VocabularyTopic;
import com.wolftalk.backend.repository.UserRepository;
import com.wolftalk.backend.repository.UserVocabularyLevelRepository;
import com.wolftalk.backend.repository.UserVocabularyProgressRepository;
import com.wolftalk.backend.repository.VocabularyWordRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VocabularyLearningService {

    private final VocabularyWordRepository vocabularyWordRepository;
    private final UserVocabularyProgressRepository progressRepository;
    private final UserVocabularyLevelRepository levelRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;

    /**
     * Get or create user's vocabulary level
     */
    @Transactional
    public UserVocabularyLevel getOrCreateUserLevel(Long userId) {
        return levelRepository.findByUserId(userId)
            .orElseGet(() -> {
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                UserVocabularyLevel newLevel = new UserVocabularyLevel();
                newLevel.setUser(user);
                newLevel.setCurrentLevel(1);
                newLevel.setTotalWordsLearned(0);
                newLevel.setWordsInProgress(0);
                newLevel.setTotalXpEarned(0);
                return levelRepository.save(newLevel);
            });
    }

    /**
     * Get user's vocabulary level by email
     */
    @Transactional
    public UserVocabularyLevel getOrCreateUserLevelByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return getOrCreateUserLevel(user.getId());
    }

    /**
     * Get available topics for user's current level
     */
    public List<VocabularyLearningDTO.TopicInfo> getAvailableTopics(Long userId) {
        UserVocabularyLevel userLevel = getOrCreateUserLevel(userId);
        VocabularyTopic[] topics = userLevel.getAvailableTopics();
        
        List<VocabularyLearningDTO.TopicInfo> topicInfos = new ArrayList<>();
        for (VocabularyTopic topic : topics) {
            Long totalWords = vocabularyWordRepository.countByTopicAndMaxLevel(topic, userLevel.getCurrentLevel());
            Long masteredWords = progressRepository.countMasteredByUserIdAndTopic(userId, topic);
            
            VocabularyLearningDTO.TopicInfo info = new VocabularyLearningDTO.TopicInfo();
            info.setTopic(topic.name());
            info.setTopicDisplayName(getTopicDisplayName(topic));
            info.setTotalWords(totalWords.intValue());
            info.setMasteredWords(masteredWords.intValue());
            info.setProgress(totalWords > 0 ? (int)((masteredWords * 100) / totalWords) : 0);
            topicInfos.add(info);
        }
        
        return topicInfos;
    }

    /**
     * Get words for learning session - returns ONE word at a time with 4 options
     * Mix of new words and words needing review
     */
    @Transactional
    public VocabularyLearningDTO.LearningSession startLearningSession(Long userId, String topicName, int wordCount) {
        UserVocabularyLevel userLevel = getOrCreateUserLevel(userId);
        int maxLevel = userLevel.getCurrentLevel();
        
        VocabularyWord targetWord = null;
        String sessionType = "LEARN";
        
        if (topicName != null && !topicName.isEmpty()) {
            // Get one word from specific topic
            VocabularyTopic topic = VocabularyTopic.valueOf(topicName.toUpperCase());
            List<VocabularyWord> words = vocabularyWordRepository.findRandomByTopicAndMaxLevel(topic, maxLevel, 1);
            if (!words.isEmpty()) {
                targetWord = words.get(0);
            }
        } else {
            // First try to get words needing review
            List<VocabularyWord> reviewWords = vocabularyWordRepository.findWordsToReviewForUser(userId, 1);
            if (!reviewWords.isEmpty()) {
                targetWord = reviewWords.get(0);
                sessionType = "REVIEW";
            } else {
                // Get new words user hasn't learned
                List<VocabularyWord> newWords = vocabularyWordRepository.findNewWordsForUser(userId, maxLevel, 1);
                if (!newWords.isEmpty()) {
                    targetWord = newWords.get(0);
                    sessionType = "LEARN";
                } else {
                    // If no new or review words, get random
                    List<VocabularyWord> randomWords = vocabularyWordRepository.findRandomByMaxLevel(maxLevel, 1);
                    if (!randomWords.isEmpty()) {
                        targetWord = randomWords.get(0);
                        sessionType = "PRACTICE";
                    }
                }
            }
        }
        
        if (targetWord == null) {
            throw new RuntimeException("Không có từ vựng nào phù hợp");
        }
        
        // Generate 4 options (1 correct + 3 wrong)
        List<String> options = generateOptions(targetWord, maxLevel);
        
        VocabularyLearningDTO.LearningSession session = new VocabularyLearningDTO.LearningSession();
        session.setUserId(userId);
        session.setCurrentLevel(userLevel.getCurrentLevel());
        session.setTotalWordsLearned(userLevel.getTotalWordsLearned());
        session.setWordsToNextLevel(userLevel.getWordsToNextLevel());
        session.setWord(convertToWordDTO(targetWord));
        session.setOptions(options);
        session.setSessionType(sessionType);
        
        return session;
    }
    
    /**
     * Generate 4 multiple choice options for a word
     */
    private List<String> generateOptions(VocabularyWord correctWord, int maxLevel) {
        List<String> options = new ArrayList<>();
        options.add(correctWord.getMeaning()); // Correct answer
        
        // Get 3 wrong answers from other words in same topic or random
        List<VocabularyWord> otherWords = vocabularyWordRepository.findRandomWrongAnswers(
            correctWord.getId(), 
            correctWord.getTopic(), 
            maxLevel, 
            3
        );
        
        for (VocabularyWord word : otherWords) {
            options.add(word.getMeaning());
        }
        
        // If not enough, add generic wrong answers
        List<String> fallbackAnswers = Arrays.asList(
            "Từ vựng khác", "Nghĩa khác", "Không đúng", "Từ này có nghĩa khác"
        );
        int fallbackIndex = 0;
        while (options.size() < 4 && fallbackIndex < fallbackAnswers.size()) {
            String fallback = fallbackAnswers.get(fallbackIndex);
            if (!options.contains(fallback)) {
                options.add(fallback);
            }
            fallbackIndex++;
        }
        
        // Shuffle options
        Collections.shuffle(options);
        
        return options;
    }

    /**
     * Submit answer for a vocabulary word with answer checking
     */
    @Transactional
    public VocabularyLearningDTO.AnswerResult submitAnswerWithCheck(Long userId, Long wordId, String userAnswer) {
        VocabularyWord word = vocabularyWordRepository.findById(wordId)
            .orElseThrow(() -> new RuntimeException("Word not found"));
        
        boolean isCorrect = word.getMeaning().equalsIgnoreCase(userAnswer);
        
        VocabularyLearningDTO.AnswerResult result = submitAnswer(userId, wordId, isCorrect);
        result.setCorrectAnswer(word.getMeaning());
        
        return result;
    }

    /**
     * Submit answer for a vocabulary word
     */
    @Transactional
    public VocabularyLearningDTO.AnswerResult submitAnswer(Long userId, Long wordId, boolean isCorrect) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        VocabularyWord word = vocabularyWordRepository.findById(wordId)
            .orElseThrow(() -> new RuntimeException("Word not found"));
        
        // Get or create progress for this word
        UserVocabularyProgress progress = progressRepository.findByUserIdAndVocabularyWordId(userId, wordId)
            .orElseGet(() -> {
                UserVocabularyProgress newProgress = new UserVocabularyProgress();
                newProgress.setUser(user);
                newProgress.setVocabularyWord(word);
                newProgress.setStatus(UserVocabularyProgress.LearningStatus.NEW);
                newProgress.setCorrectCount(0);
                newProgress.setAttemptCount(0);
                newProgress.setMasteryScore(0);
                return newProgress;
            });
        
        boolean wasMasteredBefore = progress.getStatus() == UserVocabularyProgress.LearningStatus.MASTERED;
        
        // Record the attempt
        progress.recordAttempt(isCorrect);
        progressRepository.save(progress);
        
        // Calculate XP
        int xpEarned = calculateXP(isCorrect, word.getLevel(), progress.getAttemptCount() == 1);
        
        // Update user's vocabulary level
        UserVocabularyLevel userLevel = getOrCreateUserLevel(userId);
        userLevel.addXp(xpEarned);
        
        // Check if word is now mastered (wasn't before, is now)
        boolean justMastered = !wasMasteredBefore && progress.getStatus() == UserVocabularyProgress.LearningStatus.MASTERED;
        boolean leveledUp = false;
        int newLevel = userLevel.getCurrentLevel();
        
        if (justMastered) {
            int oldLevel = userLevel.getCurrentLevel();
            userLevel.addWordsLearned(1);
            newLevel = userLevel.getCurrentLevel();
            leveledUp = newLevel > oldLevel;
        }
        
        // Update words in progress count
        Long inProgress = progressRepository.countInProgressByUserId(userId);
        userLevel.setWordsInProgress(inProgress.intValue());
        
        levelRepository.save(userLevel);
        
        // Update leaderboard
        if (xpEarned > 0) {
            try {
                leaderboardService.updateWeeklyXP(user, xpEarned);
            } catch (Exception e) {
                log.warn("Failed to update leaderboard: {}", e.getMessage());
            }
        }
        
        // Build result
        VocabularyLearningDTO.AnswerResult result = new VocabularyLearningDTO.AnswerResult();
        result.setCorrect(isCorrect);
        result.setXpEarned(xpEarned);
        result.setMasteryScore(progress.getMasteryScore());
        result.setWordStatus(progress.getStatus().name());
        result.setJustMastered(justMastered);
        result.setLeveledUp(leveledUp);
        result.setNewLevel(newLevel);
        result.setTotalWordsLearned(userLevel.getTotalWordsLearned());
        result.setWordsToNextLevel(userLevel.getWordsToNextLevel());
        
        return result;
    }

    /**
     * Get user's vocabulary statistics
     */
    public VocabularyLearningDTO.UserStats getUserStats(Long userId) {
        UserVocabularyLevel userLevel = getOrCreateUserLevel(userId);
        Long masteredCount = progressRepository.countMasteredByUserId(userId);
        Long inProgressCount = progressRepository.countInProgressByUserId(userId);
        
        VocabularyLearningDTO.UserStats stats = new VocabularyLearningDTO.UserStats();
        stats.setUserId(userId);
        stats.setCurrentLevel(userLevel.getCurrentLevel());
        stats.setTotalWordsLearned(masteredCount.intValue());
        stats.setWordsInProgress(inProgressCount.intValue());
        stats.setTotalXpEarned(userLevel.getTotalXpEarned());
        stats.setWordsToNextLevel(userLevel.getWordsToNextLevel());
        stats.setWordsRequiredForNextLevel(userLevel.getWordsRequiredForNextLevel());
        stats.setLevelProgress(calculateLevelProgress(userLevel));
        
        return stats;
    }

    private int calculateXP(boolean isCorrect, int wordLevel, Boolean firstAttempt) {
        if (!isCorrect) return 2; // Small XP for trying
        
        int baseXP = 5 + (wordLevel * 2); // 7-15 base XP based on word level
        int bonus = 0;
        
        if (Boolean.TRUE.equals(firstAttempt)) {
            bonus += 3; // First attempt bonus
        }
        
        return Math.min(baseXP + bonus, 20); // Max 20 XP per word
    }

    private int calculateLevelProgress(UserVocabularyLevel userLevel) {
        int currentWords = userLevel.getTotalWordsLearned();
        int currentLevelStart = switch (userLevel.getCurrentLevel()) {
            case 1 -> 0;
            case 2 -> 30;
            case 3 -> 90;
            case 4 -> 190;
            case 5 -> 340;
            default -> 0;
        };
        int nextLevelWords = userLevel.getWordsRequiredForNextLevel();
        int wordsInCurrentLevel = currentWords - currentLevelStart;
        int wordsNeededForThisLevel = nextLevelWords - currentLevelStart;
        
        if (wordsNeededForThisLevel <= 0) return 100;
        return Math.min(100, (int)((wordsInCurrentLevel * 100.0) / wordsNeededForThisLevel));
    }

    private VocabularyLearningDTO.WordDTO convertToWordDTO(VocabularyWord word) {
        VocabularyLearningDTO.WordDTO dto = new VocabularyLearningDTO.WordDTO();
        dto.setId(word.getId());
        dto.setWord(word.getWord());
        dto.setPhonetic(word.getPhonetic());
        dto.setMeaning(word.getMeaning());
        dto.setExample(word.getExample());
        dto.setUsageNote(word.getUsageNote());
        dto.setAudioUrl(word.getAudioUrl());
        dto.setImageUrl(word.getImageUrl());
        dto.setTopic(word.getTopic().name());
        dto.setLevel(word.getLevel());
        dto.setWordType(word.getWordType() != null ? word.getWordType().name() : null);
        return dto;
    }

    private String getTopicDisplayName(VocabularyTopic topic) {
        return switch (topic) {
            case GREETINGS -> "Chào hỏi";
            case FAMILY -> "Gia đình";
            case FOOD -> "Thức ăn";
            case NUMBERS -> "Số đếm";
            case COLORS -> "Màu sắc";
            case ANIMALS -> "Động vật";
            case WEATHER -> "Thời tiết";
            case BODY_PARTS -> "Cơ thể";
            case CLOTHES -> "Quần áo";
            case TRANSPORTATION -> "Phương tiện";
            case HOUSE -> "Nhà cửa";
            case SCHOOL -> "Trường học";
            case WORK -> "Công việc";
            case TRAVEL -> "Du lịch";
            case HEALTH -> "Sức khỏe";
            case SPORTS -> "Thể thao";
            case TECHNOLOGY -> "Công nghệ";
            case NATURE -> "Thiên nhiên";
            case EMOTIONS -> "Cảm xúc";
            case TIME -> "Thời gian";
            case SHOPPING -> "Mua sắm";
            case HOBBIES -> "Sở thích";
            case BUSINESS -> "Kinh doanh";
            case SCIENCE -> "Khoa học";
            case CULTURE -> "Văn hóa";
        };
    }
}
