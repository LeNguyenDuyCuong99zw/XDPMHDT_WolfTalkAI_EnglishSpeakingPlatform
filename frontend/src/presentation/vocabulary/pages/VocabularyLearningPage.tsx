import React, { useState, useEffect } from "react";
import { vocabularyAPI } from "../../../services/vocabularyAPI";
import type {
  UserStats,
  TopicInfo,
  LearningSession,
  AnswerResult,
} from "../../../services/vocabularyAPI";
import { VocabularyStats } from "../components/VocabularyStats";
import { TopicSelector } from "../components/TopicSelector";
import { VocabularyQuiz } from "../components/VocabularyQuiz";
import Sidebar from "../../../components/Sidebar";
import "../styles/Vocabulary.css";
import { FaArrowLeft, FaRandom, FaBook } from "react-icons/fa";

type ViewMode = "dashboard" | "quiz";

export const VocabularyLearningPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [stats, setStats] = useState<UserStats | null>(null);
  const [topics, setTopics] = useState<TopicInfo[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(
    undefined,
  );
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, topicsData] = await Promise.all([
        vocabularyAPI.getUserStats(),
        vocabularyAPI.getAvailableTopics(),
      ]);
      setStats(statsData);
      setTopics(topicsData);
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLearning = async (topic?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await vocabularyAPI.startLearningSession(topic, 1);
      setCurrentSession(session);
      setSelectedTopic(topic);
      setViewMode("quiz");
    } catch (err: any) {
      console.error("Error starting session:", err);
      setError(err.message || "Không thể bắt đầu bài học. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (
    wordId: number,
    answer: string,
  ): Promise<AnswerResult> => {
    const result = await vocabularyAPI.submitAnswer(wordId, answer);

    // Update stats after answer
    if (stats) {
      const updatedStats = { ...stats };
      updatedStats.totalXpEarned += result.xpEarned;
      updatedStats.totalWordsLearned = result.totalWordsLearned;
      updatedStats.wordsToNextLevel = result.wordsToNextLevel;
      if (result.leveledUp) {
        updatedStats.currentLevel = result.newLevel;
      }
      setStats(updatedStats);
    }

    return result;
  };

  const handleNextQuestion = async () => {
    // Load next question
    await handleStartLearning(selectedTopic);
  };

  const handleBackToDashboard = async () => {
    setViewMode("dashboard");
    setCurrentSession(null);
    setSelectedTopic(undefined);
    // Reload dashboard data to get updated stats
    await loadDashboardData();
  };

  const handleRandomPractice = () => {
    handleStartLearning(); // No topic = random
  };

  if (isLoading && !stats && !currentSession) {
    return (
      <div className="vocab-main-layout">
        <Sidebar />
        <div className="vocab-main-content">
          <div className="vocab-loading-container">
            <div className="vocab-loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="vocab-main-layout">
        <Sidebar />
        <div className="vocab-main-content">
          <div className="vocab-error-container">
            <h2>Đã xảy ra lỗi</h2>
            <p>{error}</p>
            <button className="vocab-retry-button" onClick={loadDashboardData}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vocab-main-layout">
      <Sidebar />
      <div className="vocab-main-content">
        {viewMode === "dashboard" && stats && (
          <div className="vocab-dashboard">
            <div className="vocab-welcome-header">
              <div className="vocab-greeting">
                <h1>Học từ vựng 📚</h1>
                <p className="vocab-greeting-subtitle">
                  Phát triển vốn từ vựng của bạn với những bài học hấp dẫn
                </p>
              </div>
            </div>

            <VocabularyStats stats={stats} />

            <div className="vocab-quick-actions">
              <button
                className="vocab-action-card"
                onClick={handleRandomPractice}
                disabled={isLoading}
              >
                <div className="vocab-action-icon">🎲</div>
                <h3>Luyện tập ngẫu nhiên</h3>
                <p>Học từ vựng random</p>
                <button className="vocab-action-button">BẮT ĐẦU</button>
              </button>
            </div>

            <TopicSelector
              topics={topics}
              onSelectTopic={handleStartLearning}
              selectedTopic={selectedTopic}
            />

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
          </div>
        )}

        {viewMode === "quiz" && currentSession && (
          <div className="vocab-quiz-container">
            <button
              className="vocab-back-button"
              onClick={handleBackToDashboard}
            >
              <FaArrowLeft /> Quay lại
            </button>

            <VocabularyQuiz
              session={currentSession}
              onSubmitAnswer={handleSubmitAnswer}
              onNext={handleNextQuestion}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyLearningPage;
