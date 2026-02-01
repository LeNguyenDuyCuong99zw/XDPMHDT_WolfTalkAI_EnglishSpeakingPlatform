import { apiClient } from './api';

// Types matching backend DTOs
export interface VocabularyWord {
  id: number;
  word: string;
  phonetic?: string;
  meaning: string;
  example?: string;
  usageNote?: string;
  audioUrl?: string;
  imageUrl?: string;
  topic: string;
  level: number;
  wordType?: string;
}

export interface UserStats {
  userId: number;
  currentLevel: number;
  totalWordsLearned: number;
  wordsInProgress: number;
  totalXpEarned: number;
  wordsToNextLevel: number;
  wordsRequiredForNextLevel: number;
  levelProgress: number; // 0-100%
}

export interface TopicInfo {
  topic: string;
  topicDisplayName: string;
  totalWords: number;
  masteredWords: number;
  progress: number; // 0-100%
}

export interface LearningSession {
  userId: number;
  currentLevel: number;
  totalWordsLearned: number;
  wordsToNextLevel: number;
  word: VocabularyWord;
  options: string[]; // 4 multiple choice options
  sessionType: 'LEARN' | 'REVIEW' | 'PRACTICE';
}

export interface AnswerResult {
  correct: boolean;
  xpEarned: number;
  masteryScore: number;
  wordStatus: string;
  justMastered: boolean;
  leveledUp: boolean;
  newLevel: number;
  totalWordsLearned: number;
  wordsToNextLevel: number;
  correctAnswer: string;
}

export interface LevelInfo {
  level: number;
  wordsRequired: number;
  wordsToNextLevel: number;
  topics: string[];
  description: string;
}

export interface LevelRequirements {
  success: boolean;
  levels: {
    [key: string]: LevelInfo;
  };
}

/**
 * Vocabulary Learning API Service
 */
export const vocabularyAPI = {
  /**
   * Get user's vocabulary stats
   */
  async getUserStats(): Promise<UserStats> {
    return apiClient.get<UserStats>('/vocabulary/stats');
  },

  /**
   * Get available topics for user's current level
   */
  async getAvailableTopics(): Promise<TopicInfo[]> {
    return apiClient.get<TopicInfo[]>('/vocabulary/topics');
  },

  /**
   * Start a learning session
   * @param topic - Optional topic filter (e.g., 'GREETINGS')
   * @param wordCount - Number of words (default: 10)
   */
  async startLearningSession(
    topic?: string,
    wordCount: number = 10
  ): Promise<LearningSession> {
    const params = new URLSearchParams();
    if (topic) params.append('topic', topic);
    params.append('wordCount', wordCount.toString());
    
    const queryString = params.toString();
    return apiClient.get<LearningSession>(
      `/vocabulary/session${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Submit answer for a vocabulary word
   */
  async submitAnswer(
    wordId: number,
    userAnswer: string
  ): Promise<AnswerResult> {
    return apiClient.post<AnswerResult>('/vocabulary/answer', {
      wordId,
      userAnswer,
    });
  },

  /**
   * Get level requirements information
   */
  async getLevelRequirements(): Promise<LevelRequirements> {
    return apiClient.get<LevelRequirements>('/vocabulary/levels');
  },
};
