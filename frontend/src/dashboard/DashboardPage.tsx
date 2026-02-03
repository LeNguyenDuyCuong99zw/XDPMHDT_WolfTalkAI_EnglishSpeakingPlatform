import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import { vocabularyAPI } from "../services/vocabularyAPI";
import WeeklyLeaderboardWidget from "../components/listening/WeeklyLeaderboardWidget";
import "./DashboardPage.css";
import "./Notification.css";

// Declare dotlottie-wc for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        speed?: string;
        mode?: string;
        loop?: boolean;
        autoplay?: boolean;
      };
    }
  }
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [unitsCompleted, setUnitsCompleted] = useState(0);
  const [points, setPoints] = useState(0);
  const [vocabularyLevel, setVocabularyLevel] = useState(0);
  const [vocabularyLevelName, setVocabularyLevelName] = useState("");

  const [todayGoal] = useState(20);
  const [todayProgress, setTodayProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const userName = localStorage.getItem("userName") || "Học viên";

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
        return "Mới bắt đầu";
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

  useEffect(() => {
    // Initial load
    loadUserStats();
    loadVocabularyLevel();

    // Load Lottie player script
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.11/dist/dotlottie-wc.js";
    script.type = "module";
    document.head.appendChild(script);

    // Stats polling (less frequent)
    const statsInterval = setInterval(loadUserStats, 10000);

    // Heartbeat: Increment learning time every 1 minute
    const heartbeatInterval = setInterval(async () => {
      try {
        await apiClient.post("/dashboard/heartbeat", {});
        // After heartbeat, refresh local view
        loadUserStats();
      } catch (e) {
        console.error("Heartbeat failed", e);
      }
    }, 60000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(heartbeatInterval);
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const loadUserStats = async () => {
    try {
      const data = await apiClient.get<any>("/dashboard/stats");
      console.log("Dashboard Stats loaded:", data);
      setStreak(data.streak);
      setWordsLearned(data.wordsLearned);
      setUnitsCompleted(data.unitsCompleted);
      setPoints(data.points);

      // Progress calculation: direct from backend
      const currentProgress = data.todayLearningMinutes || 0;

      // Goal Achievement Notification
      // Only show if we go from NOT achieved to ACHIEVED in this session
      setTodayProgress((prev) => {
        if (currentProgress >= todayGoal && prev < todayGoal && prev !== 0) {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }
        return Math.min(currentProgress, todayGoal);
      });
    } catch (error) {
      console.error("Failed to load stats", error);
    }
  };

  const loadVocabularyLevel = async () => {
    try {
      const stats = await vocabularyAPI.getUserStats();
      setVocabularyLevel(stats.currentLevel);
      setVocabularyLevelName(getLevelName(stats.currentLevel));
    } catch (error) {
      console.error("Failed to load vocabulary level", error);
      // Set default values if API fails
      setVocabularyLevel(0);
      setVocabularyLevelName("Mới bắt đầu");
    }
  };

  return (
    <div className="duolingo-dashboard">
      {showNotification && (
        <div className="goal-notification">
          <div className="notification-icon-wrap">🎉</div>
          <div className="notification-details">
            <h4>Mục tiêu đã đạt!</h4>
            <p>Tuyệt vời! Bạn đã hoàn thành mục tiêu học tập hôm nay.</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="learning-path-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="greeting">
            <h1>Chào {userName}! 👋</h1>
            <p className="welcome-subtitle">
              Hãy tiếp tục hành trình học tiếng Anh của bạn
            </p>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="today-progress-card">
          <div className="progress-header">
            <h2>🎯 Mục tiêu hôm nay</h2>
            <span className="progress-time">
              {todayProgress}/{todayGoal} phút
            </span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(todayProgress / todayGoal) * 100}%` }}
              />
            </div>
          </div>
          <p className="progress-message">
            {todayProgress >= todayGoal
              ? "🎉 Xuất sắc! Bạn đã hoàn thành mục tiêu hôm nay!"
              : `Còn ${
                  todayGoal - todayProgress
                } phút nữa để hoàn thành mục tiêu!`}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card" onClick={() => navigate("/learning")}>
            <div className="action-icon">
              <dotlottie-wc
                src="https://lottie.host/f7148130-a270-43ed-ae99-041cf82730bc/Iz59IuWloq.lottie"
                style={{ width: "80px", height: "80px" }}
                autoplay
                loop
              />
            </div>
            <h3>Bài học mới</h3>
            <p>Học từ vựng và ngữ pháp</p>
            <button className="action-btn">BẮT ĐẦU</button>
          </div>

          <div
            className="action-card highlight"
            onClick={() => navigate("/practice")}
          >
            <div className="action-icon">
              <dotlottie-wc
                src="https://lottie.host/ab14b692-30a0-457c-b509-6c2eea8aaa38/JBNJls2O9D.lottie"
                style={{ width: "80px", height: "80px" }}
                autoplay
                loop
              />
            </div>
            <h3>Luyện tập</h3>
            <p>Trắc nghiệm, điền từ để kiếm XP</p>
            <button className="action-btn">LUYỆN TẬP</button>
          </div>

          <div className="action-card" onClick={() => navigate("/pronunciation")}>
            <div className="action-icon">
              <dotlottie-wc
                src="https://lottie.host/c68888aa-ea2a-4bd7-86c9-550a42dfb957/Ex1gv8p1lN.lottie"
                style={{ width: "80px", height: "80px" }}
                autoplay
                loop
              />
            </div>
            <h3>Luyện nói</h3>
            <p>Cải thiện phát âm</p>
            <button className="action-btn">BẮT ĐẦU</button>
          </div>

          <div className="action-card" onClick={() => navigate("/vocabulary")}>
            <div className="action-icon">
              <dotlottie-wc
                src="https://lottie.host/9008776f-52d8-46fa-a1d9-1565d93150fa/qeUV43Rush.lottie"
                style={{ width: "80px", height: "80px" }}
                autoplay
                loop
              />
            </div>
            {vocabularyLevel > 0 && (
              <div 
                className="vocab-level-badge" 
                style={{ backgroundColor: getLevelColor(vocabularyLevel) }}
              >
                Level {vocabularyLevel}
              </div>
            )}
            <h3>Học Từ vựng</h3>
            <p>
              {vocabularyLevel > 0 
                ? `${vocabularyLevelName} - Mở rộng vốn từ vựng` 
                : "Mở rộng vốn từ vựng"}
            </p>
            <button className="action-btn vocab-btn">HỌC NGAY</button>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/diagnostic-test")}
          >
            <div className="action-icon">
              <dotlottie-wc
                src="https://lottie.host/bd8b62ec-f449-4b99-94f8-b2efe6ac16e2/Blo6fty7Nl.lottie"
                style={{ width: "80px", height: "80px" }}
                autoplay
                loop
              />
            </div>
            <h3>Kiểm tra trình độ</h3>
            <p>Đánh giá trình độ của bạn</p>
            <button className="action-btn">LÀM TEST</button>
          </div>

          <div className="action-card" onClick={() => navigate("/ai")}>
            <div className="action-icon">
              <dotlottie-wc
                src="https://lottie.host/ddf861c6-c66b-4fa7-b4cc-681149778616/QR8b05cF2Z.lottie"
                style={{ width: "80px", height: "80px" }}
                autoplay
                loop
              />
            </div>
            <h3>Học với AI</h3>
            <p>Luyện tập với trí tuệ nhân tạo</p>
            <button className="action-btn secondary">HỌC NGAY</button>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-large">🔥</div>
            <div className="stat-content">
              <h3 className="stat-number">{streak}</h3>
              <p className="stat-label">Ngày liên tiếp</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-large">⭐</div>
            <div className="stat-content">
              <h3 className="stat-number">{wordsLearned}</h3>
              <p className="stat-label">Từ đã học</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-large">🏆</div>
            <div className="stat-content">
              <h3 className="stat-number">{unitsCompleted}</h3>
              <p className="stat-label">Bài hoàn thành</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-large">💎</div>
            <div className="stat-content">
              <h3 className="stat-number">{points}</h3>
              <p className="stat-label">Điểm thưởng</p>
            </div>
          </div>
        </div>

        {/* Suggested Lessons */}
        <div className="suggested-section">
          <h2 className="section-title">📖 Bài học đề xuất</h2>
          <div className="lesson-list">
            <div className="lesson-item">
              <div className="lesson-icon">🗣️</div>
              <div className="lesson-info">
                <h4>Giao tiếp cơ bản</h4>
                <p className="lesson-meta">10 bài học • Beginner</p>
              </div>
              <button className="lesson-start-btn">Học ngay</button>
            </div>

            <div className="lesson-item">
              <div className="lesson-icon">✈️</div>
              <div className="lesson-info">
                <h4>Tiếng Anh du lịch</h4>
                <p className="lesson-meta">8 bài học • Intermediate</p>
              </div>
              <button className="lesson-start-btn">Học ngay</button>
            </div>

            <div className="lesson-item">
              <div className="lesson-icon">💼</div>
              <div className="lesson-info">
                <h4>Tiếng Anh công sở</h4>
                <p className="lesson-meta">12 bài học • Advanced</p>
              </div>
              <button className="lesson-start-btn">Học ngay</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        {/* Stats Header */}
        <div className="stats-header">
          <div className="stat-item">
            <div className="stat-icon flag">🇺🇸</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon flame">🔥</div>
            <span className="stat-value">{streak}</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon gem">💎</div>
            <span className="stat-value">{points}</span>
          </div>
          <div className="stat-item">
            <div className="stat-icon heart">❤️</div>
            <span className="stat-value">5</span>
          </div>
        </div>

        {/* Unlock Leaderboard Card */}
        <WeeklyLeaderboardWidget />

        {/* Daily Quest Card */}
        <div className="side-card daily-quest">
          <div className="quest-header">
            <h3>Nhiệm vụ hàng ngày</h3>
            <a href="#" className="view-all">
              XEM TẤT CẢ
            </a>
          </div>
          <div className="quest-item">
            <div className="quest-icon">⚡</div>
            <div className="quest-details">
              <p className="quest-title">Kiếm 10 KN</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "0%" }}></div>
              </div>
              <p className="quest-progress">0 / 10</p>
            </div>
            <div className="quest-reward">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFB800'%3E%3Cpath d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'/%3E%3C/svg%3E"
                alt="reward"
                width="24"
              />
            </div>
          </div>
        </div>

        {/* Create Profile Card */}
        <div className="side-card profile-cta">
          <h3>Tạo hồ sơ để lưu tiến trình của bạn!</h3>
          <button className="btn-create-profile">TẠO HỒ SƠ</button>
          <button className="btn-login">ĐĂNG NHẬP</button>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <a href="#">GIỚI THIỆU</a>
          <a href="#">CỬA HÀNG</a>
          <a href="#">TÍNH HIỆU QUẢ</a>
          <a href="#">CÔNG VIỆC</a>
          <a href="#">NHÀ ĐẦU TƯ</a>
          <a href="#">ĐIỀU KHOẢN</a>
          <a href="#">BẢO MẬT</a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
