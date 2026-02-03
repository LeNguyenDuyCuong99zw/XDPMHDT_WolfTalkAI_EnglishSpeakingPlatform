import React, { useState, useEffect } from "react";
import { apiClient } from "../../services/api";
import "./WeeklyProgressDashboard.css";

interface ProgressStat {
  challengeType: string;
  totalAttempts: number;
  correctAttempts: number;
  totalXP: number;
  totalTime: number;
  accuracyPercentage: number;
  averageXPPerAttempt: number;
}

interface WeeklyProgressResponse {
  success: boolean;
  progress: ProgressStat[];
  count: number;
}

interface WeeklyProgressDashboardProps {
  userId?: number;
}

const WeeklyProgressDashboard: React.FC<WeeklyProgressDashboardProps> = ({
  userId,
}) => {
  const [weeklyProgress, setWeeklyProgress] = useState<ProgressStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    fetchWeeklyProgress();
  }, [userId]);

  const fetchWeeklyProgress = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<WeeklyProgressResponse>(
        "/challenges/progress/weekly",
      );

      if (response.success && Array.isArray(response.progress)) {
        setWeeklyProgress(response.progress);

        // Calculate total XP
        const total = response.progress.reduce(
          (sum: number, stat: ProgressStat) => sum + stat.totalXP,
          0,
        );
        setTotalXP(total);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching weekly progress:", err);
      setError("Không thể tải dữ liệu tiến trình");
    } finally {
      setLoading(false);
    }
  };

  const getChallengeColor = (type: string): string => {
    const colors: Record<string, string> = {
      LISTENING: "#FF6B6B",
      SPEAKING: "#4ECDC4",
      READING: "#45B7D1",
      WRITING: "#FFA07A",
      VOCABULARY: "#98D8C8",
      GRAMMAR: "#F7DC6F",
    };
    return colors[type] || "#999";
  };

  const getChallengeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      LISTENING: "🎧",
      SPEAKING: "🎤",
      READING: "📖",
      WRITING: "✍️",
      VOCABULARY: "📚",
      GRAMMAR: "📝",
    };
    return icons[type] || "📋";
  };

  const getAccuracyLevel = (accuracy: number): string => {
    if (accuracy >= 90) return "Excellent";
    if (accuracy >= 75) return "Good";
    if (accuracy >= 60) return "Fair";
    return "Need Practice";
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 90) return "#4CAF50";
    if (accuracy >= 75) return "#2196F3";
    if (accuracy >= 60) return "#FF9800";
    return "#F44336";
  };

  if (loading) {
    return (
      <div className="weekly-progress-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weekly-progress-container">
      <div className="progress-header">
        <h2>📊 This Week's Progress</h2>
        <div className="total-xp-badge">
          <span className="xp-icon">⭐</span>
          <span className="xp-value">{totalXP}</span>
          <span className="xp-label">XP Earned</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {weeklyProgress.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Progress Yet</h3>
          <p>Complete challenges to start tracking your progress!</p>
        </div>
      ) : (
        <div className="progress-grid">
          {weeklyProgress.map((stat) => (
            <div key={stat.challengeType} className="progress-card">
              {/* Card Header */}
              <div className="card-header">
                <div
                  className="challenge-badge"
                  style={{
                    backgroundColor: getChallengeColor(stat.challengeType),
                  }}
                >
                  <span className="challenge-icon">
                    {getChallengeIcon(stat.challengeType)}
                  </span>
                </div>
                <div className="challenge-name">{stat.challengeType}</div>
              </div>

              {/* XP Display */}
              <div className="xp-display">
                <span className="xp-number">{stat.totalXP}</span>
                <span className="xp-unit">XP</span>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                {/* Attempts */}
                <div className="stat-item">
                  <span className="stat-label">Attempts</span>
                  <span className="stat-value">{stat.totalAttempts}</span>
                </div>

                {/* Accuracy */}
                <div className="stat-item">
                  <span className="stat-label">Accuracy</span>
                  <div
                    className="accuracy-circle"
                    style={{
                      borderColor: getAccuracyColor(stat.accuracyPercentage),
                    }}
                  >
                    <span className="accuracy-value">
                      {stat.accuracyPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Correct Answers */}
                <div className="stat-item">
                  <span className="stat-label">Correct</span>
                  <span className="stat-value">
                    {stat.correctAttempts}/{stat.totalAttempts}
                  </span>
                </div>

                {/* Average XP */}
                <div className="stat-item">
                  <span className="stat-label">Avg/Answer</span>
                  <span className="stat-value">
                    {stat.averageXPPerAttempt.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar-container">
                <div className="progress-label">
                  <span>Proficiency</span>
                  <span
                    className="proficiency-level"
                    style={{ color: getAccuracyColor(stat.accuracyPercentage) }}
                  >
                    {getAccuracyLevel(stat.accuracyPercentage)}
                  </span>
                </div>
                <div
                  className="progress-bar"
                  style={{
                    backgroundColor:
                      getChallengeColor(stat.challengeType) + "20",
                  }}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${stat.accuracyPercentage}%`,
                      backgroundColor: getChallengeColor(stat.challengeType),
                    }}
                  ></div>
                </div>
              </div>

              {/* Time Spent */}
              <div className="time-display">
                <span className="time-icon">⏱️</span>
                <span className="time-text">
                  {Math.floor(stat.totalTime / 60)} min {stat.totalTime % 60}{" "}
                  sec
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {weeklyProgress.length > 0 && (
        <div className="summary-section">
          <div className="summary-card">
            <span className="summary-icon">🎯</span>
            <span className="summary-label">Total Challenges</span>
            <span className="summary-value">
              {weeklyProgress.reduce(
                (sum, stat) => sum + stat.totalAttempts,
                0,
              )}
            </span>
          </div>

          <div className="summary-card">
            <span className="summary-icon">✅</span>
            <span className="summary-label">Overall Accuracy</span>
            <span className="summary-value">
              {(
                (weeklyProgress.reduce(
                  (sum, stat) => sum + stat.correctAttempts,
                  0,
                ) /
                  weeklyProgress.reduce(
                    (sum, stat) => sum + stat.totalAttempts,
                    0,
                  )) *
                100
              ).toFixed(0)}
              %
            </span>
          </div>

          <div className="summary-card">
            <span className="summary-icon">⭐</span>
            <span className="summary-label">Weekly Total</span>
            <span className="summary-value">{totalXP} XP</span>
          </div>

          <div className="summary-card">
            <span className="summary-icon">🏆</span>
            <span className="summary-label">Top Challenge</span>
            <span className="summary-value">
              {
                weeklyProgress.reduce((max, stat) =>
                  stat.totalXP > max.totalXP ? stat : max,
                ).challengeType
              }
            </span>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="refresh-section">
        <button className="refresh-button" onClick={fetchWeeklyProgress}>
          🔄 Refresh Progress
        </button>
      </div>
    </div>
  );
};

export default WeeklyProgressDashboard;
