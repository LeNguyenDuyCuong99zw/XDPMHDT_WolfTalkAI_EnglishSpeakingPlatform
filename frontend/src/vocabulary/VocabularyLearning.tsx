import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./VocabularyLearning.css";

interface WordDTO {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  usageNote: string;
  audioUrl: string;
  imageUrl: string;
  topic: string;
  level: number;
  wordType: string;
}

interface TopicInfo {
  topic: string;
  topicDisplayName: string;
  totalWords: number;
  masteredWords: number;
  progress: number;
}

interface LearningSession {
  userId: number;
  currentLevel: number;
  totalWordsLearned: number;
  wordsToNextLevel: number;
  word: WordDTO;
  sessionType: "LEARN" | "REVIEW" | "PRACTICE";
  options: string[];
}

interface AnswerResult {
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

interface UserStats {
  userId: number;
  currentLevel: number;
  totalWordsLearned: number;
  wordsInProgress: number;
  totalXpEarned: number;
  wordsToNextLevel: number;
  wordsRequiredForNextLevel: number;
  levelProgress: number;
}

const topicIcons: Record<string, string> = {
  GREETINGS: "👋",
  FAMILY: "👨‍👩‍👧‍👦",
  NUMBERS: "🔢",
  COLORS: "🎨",
  FOOD: "🍔",
  ANIMALS: "🐾",
  BODY_PARTS: "💪",
  WEATHER: "☀️",
  CLOTHES: "👕",
  TRANSPORTATION: "🚗",
  HOUSE: "🏠",
  SCHOOL: "🎒",
  WORK: "💼",
  TRAVEL: "✈️",
  HEALTH: "💊",
  SPORTS: "⚽",
  TECHNOLOGY: "💻",
  BUSINESS: "📊",
  SCIENCE: "🔬",
  EMOTIONS: "😊",
  TIME: "⏰",
  NATURE: "🌿",
  MUSIC: "🎵",
  ART: "🎨",
  HOBBIES: "🎯",
};

const VocabularyLearning: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"dashboard" | "topics" | "learning">(
    "dashboard",
  );
  const [stats, setStats] = useState<UserStats | null>(null);
  const [topics, setTopics] = useState<TopicInfo[]>([]);
  const [session, setSession] = useState<LearningSession | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [showMeaning, setShowMeaning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const token = localStorage.getItem("token");

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/vocabulary/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, [token]);

  const fetchTopics = useCallback(async () => {
    try {
      const response = await fetch("/api/vocabulary/topics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      }
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  }, [token]);

  const startSession = useCallback(
    async (topic?: string) => {
      setLoading(true);
      setError(null);
      try {
        const url = topic
          ? `/api/vocabulary/session?topic=${topic}`
          : "/api/vocabulary/session";
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          setSelectedAnswer(null);
          setAnswerResult(null);
          setShowMeaning(false);
          setView("learning");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Không thể bắt đầu phiên học");
        }
      } catch (err) {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const submitAnswer = async () => {
    if (!session || !selectedAnswer) return;

    setLoading(true);
    try {
      const response = await fetch("/api/vocabulary/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wordId: session.word.id,
          userAnswer: selectedAnswer,
        }),
      });

      if (response.ok) {
        const result: AnswerResult = await response.json();
        setAnswerResult(result);
        setSessionCount((prev) => prev + 1);
        if (result.correct) {
          setCorrectCount((prev) => prev + 1);
        }
        // Refresh stats after answer
        fetchStats();
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextWord = () => {
    if (selectedTopic) {
      startSession(selectedTopic);
    } else {
      startSession();
    }
  };

  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    fetchStats();
    fetchTopics();
  }, [fetchStats, fetchTopics]);

  const renderDashboard = () => (
    <div className="vocab-dashboard">
      <div className="vocab-header">
        <button className="back-btn" onClick={() => navigate("/learn")}>
          <span className="back-icon">←</span>
          Quay lại
        </button>
        <h1 className="vocab-title">
          <span className="title-icon">📚</span>
          Học Từ Vựng
        </h1>
      </div>

      {stats && (
        <div className="stats-container">
          <div className="level-card">
            <div className="level-badge">Level {stats.currentLevel}</div>
            <div className="level-progress">
              <div
                className="level-progress-bar"
                style={{
                  width: `${stats.levelProgress || 0}%`,
                }}
              />
            </div>
            <p className="level-text">
              Còn {stats.wordsToNextLevel} từ để lên level tiếp
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📖</div>
              <div className="stat-value">{stats.totalWordsLearned}</div>
              <div className="stat-label">Từ đã học</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-value">{stats.wordsInProgress}</div>
              <div className="stat-label">Đang học</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">{stats.totalXpEarned}</div>
              <div className="stat-label">Tổng XP</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">
                {stats.wordsRequiredForNextLevel}
              </div>
              <div className="stat-label">Mục tiêu</div>
            </div>
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button
          className="action-btn primary"
          onClick={() => startSession()}
          disabled={loading}
        >
          <span className="btn-icon">🎯</span>
          Học từ mới
        </button>
        <button
          className="action-btn secondary"
          onClick={() => setView("topics")}
        >
          <span className="btn-icon">📂</span>
          Chọn chủ đề
        </button>
      </div>

      {/* Quick Topic Preview */}
      <div className="topics-preview">
        <h3>Chủ đề có sẵn</h3>
        <div className="topics-preview-grid">
          {topics.slice(0, 6).map((topic) => (
            <div
              key={topic.topic}
              className="topic-preview-card"
              onClick={() => {
                setSelectedTopic(topic.topic);
                startSession(topic.topic);
              }}
            >
              <span className="topic-icon">
                {topicIcons[topic.topic] || "📝"}
              </span>
              <span className="topic-name">{topic.topicDisplayName}</span>
              <span className="topic-progress">
                {topic.masteredWords}/{topic.totalWords}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTopics = () => (
    <div className="vocab-topics">
      <div className="vocab-header">
        <button className="back-btn" onClick={() => setView("dashboard")}>
          <span className="back-icon">←</span>
          Quay lại
        </button>
        <h1 className="vocab-title">Chọn Chủ Đề</h1>
      </div>

      <div className="topics-grid">
        {topics.map((topic) => (
          <div
            key={topic.topic}
            className="topic-card"
            onClick={() => {
              setSelectedTopic(topic.topic);
              startSession(topic.topic);
            }}
          >
            <div className="topic-card-icon">
              {topicIcons[topic.topic] || "📝"}
            </div>
            <h3 className="topic-card-title">{topic.topicDisplayName}</h3>
            <div className="topic-progress-bar">
              <div
                className="topic-progress-fill"
                style={{
                  width: `${topic.progress}%`,
                }}
              />
            </div>
            <p className="topic-card-stats">
              {topic.masteredWords} / {topic.totalWords} từ thành thạo
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLearning = () => {
    if (!session) return null;

    const { word, sessionType, options } = session;

    return (
      <div className="vocab-learning">
        <div className="learning-header">
          <button
            className="back-btn"
            onClick={() => {
              setView("dashboard");
              setSession(null);
              setSessionCount(0);
              setCorrectCount(0);
            }}
          >
            <span className="back-icon">←</span>
            Kết thúc
          </button>
          <div className="session-progress">
            <span className="progress-text">
              {sessionType === "LEARN"
                ? "📚 Học mới"
                : sessionType === "REVIEW"
                  ? "🔄 Ôn tập"
                  : "💪 Luyện tập"}
            </span>
            <span className="progress-count">
              ✓ {correctCount}/{sessionCount}
            </span>
          </div>
        </div>

        <div className="word-card">
          <div className="word-level-badge">Level {word.level}</div>
          <div className="word-type-badge">{word.wordType}</div>

          <div className="word-main">
            <h2 className="word-text">{word.word}</h2>
            <button className="audio-btn" onClick={() => playAudio(word.word)}>
              🔊
            </button>
          </div>

          <p className="word-phonetic">{word.phonetic}</p>

          {showMeaning && (
            <div className="word-details">
              <p className="word-meaning">{word.meaning}</p>
              <p className="word-example">"{word.example}"</p>
              {word.usageNote && (
                <p className="word-usage">💡 {word.usageNote}</p>
              )}
            </div>
          )}

          {!answerResult && (
            <button
              className="show-meaning-btn"
              onClick={() => setShowMeaning(!showMeaning)}
            >
              {showMeaning ? "Ẩn nghĩa" : "Hiện nghĩa"}
            </button>
          )}
        </div>

        {!answerResult ? (
          <div className="answer-section">
            <h3 className="question-text">Chọn nghĩa đúng của từ:</h3>
            <div className="options-grid">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${selectedAnswer === option ? "selected" : ""}`}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={loading}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            <button
              className="submit-btn"
              onClick={submitAnswer}
              disabled={!selectedAnswer || loading}
            >
              {loading ? "Đang kiểm tra..." : "Kiểm tra"}
            </button>
          </div>
        ) : (
          <div
            className={`result-section ${answerResult.correct ? "correct" : "incorrect"}`}
          >
            <div className="result-icon">
              {answerResult.correct ? "🎉" : "😢"}
            </div>
            <h3 className="result-text">
              {answerResult.correct ? "Chính xác!" : "Chưa đúng!"}
            </h3>
            {!answerResult.correct && (
              <p className="correct-answer">
                Đáp án đúng: <strong>{answerResult.correctAnswer}</strong>
              </p>
            )}
            <div className="result-stats">
              <span className="xp-earned">+{answerResult.xpEarned} XP</span>
              <span className="mastery-score">
                Độ thành thạo: {answerResult.masteryScore}%
              </span>
            </div>
            {answerResult.leveledUp && (
              <div className="level-up-celebration">
                🎊 Chúc mừng! Bạn đã lên Level {answerResult.newLevel}! 🎊
              </div>
            )}
            <button className="next-btn" onClick={nextWord}>
              Từ tiếp theo →
            </button>
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="vocab-error">
        <div className="error-icon">⚠️</div>
        <h2>Oops!</h2>
        <p>{error}</p>
        <button
          onClick={() => {
            setError(null);
            setView("dashboard");
          }}
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="vocabulary-learning-container">
      {view === "dashboard" && renderDashboard()}
      {view === "topics" && renderTopics()}
      {view === "learning" && renderLearning()}
    </div>
  );
};

export default VocabularyLearning;
