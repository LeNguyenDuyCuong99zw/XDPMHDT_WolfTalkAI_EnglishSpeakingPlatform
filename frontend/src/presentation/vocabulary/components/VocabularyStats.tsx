import React from "react";
import { UserStats } from "../../../services/vocabularyAPI";

interface VocabularyStatsProps {
  stats: UserStats;
}

export const VocabularyStats: React.FC<VocabularyStatsProps> = ({ stats }) => {
  const getLevelName = (level: number): string => {
    switch (level) {
      case 1:
        return "Cơ bản";
      case 2:
        return "Sơ cấp";
      case 3:
        return "Trung cấp";
      case 4:
        return "Nâng cao";
      case 5:
        return "Chuyên gia";
      default:
        return "Chưa xác định";
    }
  };

  const getLevelColor = (level: number): string => {
    switch (level) {
      case 1:
        return "#4CAF50";
      case 2:
        return "#2196F3";
      case 3:
        return "#FF9800";
      case 4:
        return "#9C27B0";
      case 5:
        return "#F44336";
      default:
        return "#757575";
    }
  };

  return (
    <div className="vocab-stats-section">
      <div className="vocab-stats-header">
        <h2>Thống kê từ vựng</h2>
      </div>

      <div className="vocab-stats-grid">
        {/* Level Card */}
        <div
          className="vocab-stat-card"
          style={{ borderColor: getLevelColor(stats.currentLevel) }}
        >
          <div
            className="vocab-stat-icon"
            style={{ backgroundColor: getLevelColor(stats.currentLevel) }}
          >
            <span className="level-number">{stats.currentLevel}</span>
          </div>
          <div className="stat-info">
            <h3>Level hiện tại</h3>
            <p className="vocab-stat-value">
              {getLevelName(stats.currentLevel)}
            </p>
          </div>
        </div>

        {/* Words Learned Card */}
        <div className="vocab-stat-card">
          <div
            className="vocab-stat-icon"
            style={{ backgroundColor: "#4CAF50" }}
          >
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>Từ đã học</h3>
            <p className="vocab-stat-value">{stats.totalWordsLearned}</p>
          </div>
        </div>

        {/* Words In Progress Card */}
        <div className="vocab-stat-card">
          <div
            className="vocab-stat-icon"
            style={{ backgroundColor: "#FF9800" }}
          >
            <i className="fas fa-book-reader"></i>
          </div>
          <div className="stat-info">
            <h3>Đang học</h3>
            <p className="vocab-stat-value">{stats.wordsInProgress}</p>
          </div>
        </div>

        {/* XP Card */}
        <div className="vocab-stat-card">
          <div
            className="vocab-stat-icon"
            style={{ backgroundColor: "#9C27B0" }}
          >
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <h3>Tổng XP</h3>
            <p className="vocab-stat-value">{stats.totalXpEarned}</p>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      {stats.currentLevel < 5 && (
        <div className="vocab-level-progress">
          <div className="vocab-progress-header">
            <h3>Tiến độ lên Level {stats.currentLevel + 1}</h3>
            <span className="vocab-progress-text">
              {stats.totalWordsLearned} / {stats.wordsRequiredForNextLevel} từ
            </span>
          </div>
          <div className="vocab-progress-bar-container">
            <div
              className="vocab-progress-bar-fill"
              style={{
                width: `${stats.levelProgress}%`,
                backgroundColor: getLevelColor(stats.currentLevel + 1),
              }}
            >
              <span className="progress-percentage">
                {stats.levelProgress}%
              </span>
            </div>
          </div>
          <p className="words-remaining">
            Còn <strong>{stats.wordsToNextLevel}</strong> từ nữa để lên level!
          </p>
        </div>
      )}

      {stats.currentLevel === 5 && (
        <div className="max-level-message">
          <i className="fas fa-trophy"></i>
          <h3>Chúc mừng! Bạn đã đạt level tối đa!</h3>
          <p>Tiếp tục học để duy trì và nâng cao vốn từ vựng của bạn.</p>
        </div>
      )}
    </div>
  );
};
