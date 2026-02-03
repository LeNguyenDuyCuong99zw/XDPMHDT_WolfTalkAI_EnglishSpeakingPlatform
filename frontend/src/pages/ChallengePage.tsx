import React, { useState, useEffect } from "react";
import { apiClient } from "../services/api";
import ChallengeCard from "../components/challenge/ChallengeCard";
import WeeklyProgressDashboard from "../components/challenge/WeeklyProgressDashboard";
import "./ChallengePage.css";

interface Challenge {
  id: number;
  type: string;
  level: number;
  title: string;
  description: string;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  options?: string[];
  correctOptionIndex?: number;
  timeLimit: number;
}

interface SubmissionResult {
  success: boolean;
  submission: {
    id: number;
    isCorrect: boolean;
    xpEarned: number;
    accuracy: number;
  };
  message: string;
}

type ChallengeType =
  | "LISTENING"
  | "SPEAKING"
  | "READING"
  | "WRITING"
  | "VOCABULARY"
  | "GRAMMAR";

const CHALLENGE_TYPES: ChallengeType[] = [
  "LISTENING",
  "SPEAKING",
  "READING",
  "WRITING",
  "VOCABULARY",
  "GRAMMAR",
];

const ChallengePage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ChallengeType>("LISTENING");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<SubmissionResult | null>(
    null,
  );
  const [showProgress, setShowProgress] = useState(false);

  // Load challenges when type changes
  useEffect(() => {
    loadChallenges();
  }, [selectedType]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentChallengeIndex(0);
      setLastSubmission(null);

      const response = await apiClient.get<{
        success: boolean;
        challenges: Challenge[];
        count: number;
      }>(`/challenges/random/${selectedType}?limit=5`);

      if (response.success && Array.isArray(response.challenges)) {
        setChallenges(response.challenges);
      } else {
        setError("Không thể tải challenges");
      }
    } catch (err) {
      console.error("Error loading challenges:", err);
      setError("Không thể tải challenges. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answer: string, timeSpent: number) => {
    if (!challenges[currentChallengeIndex]) return;

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      const response = await apiClient.post<SubmissionResult>(
        "/challenges/submit",
        {
          challengeId: challenges[currentChallengeIndex].id,
          userAnswer: answer,
          timeSpent: timeSpent,
        },
      );

      if (response.success) {
        setLastSubmission(response);
        setSuccessMessage(response.message);

        // Move to next challenge after 2 seconds
        setTimeout(() => {
          if (currentChallengeIndex < challenges.length - 1) {
            setCurrentChallengeIndex(currentChallengeIndex + 1);
            setSuccessMessage(null);
          } else {
            setSuccessMessage(
              "Hoàn thành tất cả challenges! 🎉 Tải thêm để tiếp tục.",
            );
          }
        }, 2000);
      } else {
        setError("Gửi câu trả lời thất bại");
      }
    } catch (err: any) {
      console.error("Error submitting challenge:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Lỗi không xác định";
      setError(`Không thể gửi câu trả lời: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setSuccessMessage(null);
      setLastSubmission(null);
    }
  };

  const handlePreviousChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
      setSuccessMessage(null);
      setLastSubmission(null);
    }
  };

  const currentChallenge = challenges[currentChallengeIndex];
  const progress = `${currentChallengeIndex + 1}/${challenges.length}`;

  return (
    <div className="challenge-page">
      {/* Header */}
      <div className="challenge-page-header">
        <h1>🎯 Challenge Hub</h1>
        <p className="subtitle">
          Complete challenges to earn XP and improve your English!
        </p>
      </div>

      {/* Tabs for Challenge Types */}
      <div className="challenge-tabs">
        <div className="tabs-container">
          {CHALLENGE_TYPES.map((type) => (
            <button
              key={type}
              className={`tab ${selectedType === type ? "active" : ""}`}
              onClick={() => setSelectedType(type)}
              disabled={loading}
            >
              <span className="tab-icon">
                {type === "LISTENING" && "🎧"}
                {type === "SPEAKING" && "🎤"}
                {type === "READING" && "📖"}
                {type === "WRITING" && "✍️"}
                {type === "VOCABULARY" && "📚"}
                {type === "GRAMMAR" && "📝"}
              </span>
              <span className="tab-label">{type}</span>
            </button>
          ))}
        </div>

        {/* Progress Toggle */}
        <button
          className="progress-toggle-btn"
          onClick={() => setShowProgress(!showProgress)}
        >
          📊 {showProgress ? "Hide" : "Show"} Progress
        </button>
      </div>

      {/* Main Content */}
      <div className="challenge-content">
        {/* Weekly Progress Dashboard */}
        {showProgress && (
          <div className="progress-section">
            <WeeklyProgressDashboard />
          </div>
        )}

        {/* Challenge Section */}
        <div className="challenge-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading challenges...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button onClick={loadChallenges} className="retry-btn">
                Retry
              </button>
            </div>
          ) : challenges.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No challenges available</p>
              <button onClick={loadChallenges} className="reload-btn">
                Load Challenges
              </button>
            </div>
          ) : (
            <>
              {/* Challenge Card */}
              <div className="challenge-wrapper">
                <div className="challenge-progress-bar">
                  <span className="progress-text">Challenge {progress}</span>
                  <div className="progress-indicator">
                    {Array.from({ length: challenges.length }, (_, i) => (
                      <div
                        key={i}
                        className={`progress-dot ${
                          i === currentChallengeIndex
                            ? "active"
                            : i < currentChallengeIndex
                              ? "completed"
                              : ""
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {currentChallenge && (
                  <ChallengeCard
                    challenge={currentChallenge}
                    onSubmit={handleSubmit}
                    isLoading={submitting}
                  />
                )}

                {/* Result Message */}
                {successMessage && (
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    <span className="success-text">{successMessage}</span>
                    {lastSubmission && (
                      <div className="submission-details">
                        <span className="correct-badge">
                          {lastSubmission.submission.isCorrect
                            ? "✓ Correct!"
                            : "✗ Incorrect"}
                        </span>
                        <span className="xp-earned">
                          +{lastSubmission.submission.xpEarned} XP
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="challenge-navigation">
                  <button
                    className="nav-button prev"
                    onClick={handlePreviousChallenge}
                    disabled={currentChallengeIndex === 0 || submitting}
                  >
                    ← Previous
                  </button>

                  <span className="nav-counter">
                    {currentChallengeIndex + 1} of {challenges.length}
                  </span>

                  <button
                    className="nav-button next"
                    onClick={handleNextChallenge}
                    disabled={
                      currentChallengeIndex === challenges.length - 1 ||
                      !lastSubmission ||
                      submitting
                    }
                  >
                    Next →
                  </button>
                </div>

                {/* Load More Button */}
                {currentChallengeIndex === challenges.length - 1 &&
                  lastSubmission && (
                    <button className="load-more-btn" onClick={loadChallenges}>
                      📚 Load More Challenges
                    </button>
                  )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <div className="tips-card">
          <h3>💡 Tips for Success</h3>
          <ul>
            <li>Take your time and read/listen carefully before answering</li>
            <li>You earn more XP for correct answers and quick responses</li>
            <li>First correct attempt on a challenge earns bonus XP</li>
            <li>
              Complete challenges daily to see progress on the leaderboard
            </li>
            <li>Different challenge types help develop all English skills</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
