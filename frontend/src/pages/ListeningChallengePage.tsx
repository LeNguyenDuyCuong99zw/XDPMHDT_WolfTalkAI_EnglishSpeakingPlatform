import React, { useState, useEffect } from "react";
import { apiClient } from "../services/api";
import "./ListeningChallengePage.css";
import ListeningChallengeQuiz from "../components/listening/ListeningChallengeQuiz";
import TaskBoard from "../components/listening/TaskBoard";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficultyLevel: number;
  audioUrl: string;
  englishText: string;
  vietnameseText: string;
  basePoints: number;
  category: string;
  durationSeconds: number;
}

// apiClient handles all the configuration and token injection

const ListeningChallengePage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"challenges" | "tasks">(
    "challenges",
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null,
  );

  useEffect(() => {
    loadChallenges();
  }, [selectedDifficulty]);

  const loadChallenges = async () => {
    try {
      setLoading(true);

      let url = "/api/listening/challenges";
      if (selectedDifficulty) {
        url = `/api/listening/challenges/difficulty/${selectedDifficulty}`;
      }

      const response = await apiClient.get<Challenge[]>(url);

      setChallenges(response);
      setError(null);
    } catch (err: any) {
      setError("Không thể tải thử thách. Vui lòng thử lại.");
      console.error("Error loading challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleChallengeComplete = () => {
    setSelectedChallenge(null);
    loadChallenges();
  };

  if (selectedChallenge) {
    return (
      <ListeningChallengeQuiz
        challenge={selectedChallenge}
        onComplete={handleChallengeComplete}
        onBack={() => setSelectedChallenge(null)}
      />
    );
  }

  return (
    <div className="listening-challenge-page">
      <div className="listening-header">
        <h1>🎧 Thử thách nghe tiếng Anh</h1>
        <p>Nâng cao kỹ năng nghe của bạn với các thử thách từ dễ tới khó</p>
      </div>

      <div className="listening-nav-tabs">
        <button
          className={`tab ${viewMode === "challenges" ? "active" : ""}`}
          onClick={() => setViewMode("challenges")}
        >
          📚 Thử thách
        </button>
        <button
          className={`tab ${viewMode === "tasks" ? "active" : ""}`}
          onClick={() => setViewMode("tasks")}
        >
          ✓ Nhiệm vụ hôm nay
        </button>
      </div>

      <div className="listening-content">
        {viewMode === "challenges" && (
          <div className="challenges-section">
            <div className="difficulty-filter">
              <h3>Mức độ khó:</h3>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${selectedDifficulty === null ? "active" : ""}`}
                  onClick={() => setSelectedDifficulty(null)}
                >
                  Tất cả
                </button>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    className={`filter-btn difficulty-${level} ${selectedDifficulty === level ? "active" : ""}`}
                    onClick={() => setSelectedDifficulty(level)}
                  >
                    {"⭐".repeat(level)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Đang tải thử thách...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>❌ {error}</p>
                <button onClick={loadChallenges}>Thử lại</button>
              </div>
            ) : challenges.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy thử thách nào.</p>
              </div>
            ) : (
              <div className="challenges-grid">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="challenge-card"
                    onClick={() => handleChallengeSelect(challenge)}
                  >
                    <div className="challenge-header">
                      <h3>{challenge.title}</h3>
                      <span className="difficulty-badge">
                        {"⭐".repeat(challenge.difficultyLevel)}
                      </span>
                    </div>
                    <p className="challenge-description">
                      {challenge.description}
                    </p>
                    <div className="challenge-meta">
                      <span className="points-badge">
                        +{challenge.basePoints} điểm
                      </span>
                      <span className="category-badge">
                        {challenge.category}
                      </span>
                      <span className="duration-badge">
                        ⏱️ {challenge.durationSeconds}s
                      </span>
                    </div>
                    <button className="start-btn">Bắt đầu →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === "tasks" && <TaskBoard />}
      </div>
    </div>
  );
};

export default ListeningChallengePage;
