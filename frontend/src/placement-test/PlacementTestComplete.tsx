import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./PlacementTest.css";

const PlacementTestComplete: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const [finalLevel, setFinalLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFinalLevel();
  }, []);

  const loadFinalLevel = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `http://localhost:8080/api/placement-test/${testId}/final-level`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setFinalLevel(response.data.finalLevel);
      setIsLoading(false);

      // Auto-redirect to dashboard after 5 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    } catch (error) {
      console.error("Failed to load final level:", error);
      setIsLoading(false);
    }
  };

  const getLevelText = (level: string) => {
    const levels: { [key: string]: string } = {
      beginner: "Sơ cấp",
      elementary: "Cơ bản",
      intermediate: "Trung cấp",
      advanced: "Nâng cao",
      expert: "Thành thạo",
    };
    return levels[level] || level;
  };

  return (
    <div className="placement-test-container-dark">
      <div className="placement-test-card placement-test-step">
        <div className="completion-screen">
          <div className="completion-icon">🎉</div>
          <h1 className="completion-title">Chúc mừng!</h1>
          <p className="completion-subtitle">
            Bạn đã hoàn thành bài kiểm tra đánh giá.
          </p>

          {isLoading ? (
            <div className="loading-level">
              <div className="wolf-mascot-large">
                <div className="wolf-circle">
                  <span className="wolf-emoji">🐺</span>
                </div>
              </div>
              <p>Đang tính toán trình độ của bạn...</p>
            </div>
          ) : (
            <div className="level-result">
              <h2 className="level-title">Trình độ của bạn</h2>
              <div className="level-badge">{getLevelText(finalLevel)}</div>
              <p className="level-description">
                Chúng tôi đã chuẩn bị lộ trình học phù hợp với trình độ của bạn!
              </p>
            </div>
          )}

          <button
            className="btn-start-test"
            onClick={() => navigate("/dashboard")}
          >
            Đi đến Bảng điều khiển
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlacementTestComplete;
