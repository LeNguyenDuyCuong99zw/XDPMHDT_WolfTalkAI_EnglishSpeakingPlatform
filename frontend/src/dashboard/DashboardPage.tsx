import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import WeeklyLeaderboardWidget from "../components/listening/WeeklyLeaderboardWidget";
import "./DashboardPage.css";
import "./Notification.css";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [unitsCompleted, setUnitsCompleted] = useState(0);
  const [points, setPoints] = useState(0);

  const [todayGoal] = useState(20);
  const [todayProgress, setTodayProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const userName = localStorage.getItem("userName") || "Học viên";

  useEffect(() => {
    // Initial load
    loadUserStats();

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
            <div className="action-icon">📚</div>
            <h3>Bài học mới</h3>
            <p>Học từ vựng và ngữ pháp</p>
            <button className="action-btn">BẮT ĐẦU</button>
          </div>

          <div
            className="action-card highlight"
            onClick={() => navigate("/practice")}
          >
            <div className="action-icon">✏️</div>
            <h3>Luyện tập</h3>
            <p>Trắc nghiệm, điền từ để kiếm XP</p>
            <button className="action-btn">LUYỆN TẬP</button>
          </div>

          <div className="action-card" onClick={() => navigate("/speaking")}>
            <div className="action-icon">🎤</div>
            <h3>Luyện nói</h3>
            <p>Cải thiện phát âm</p>
            <button className="action-btn">BẮT ĐẦU</button>
          </div>

          <div className="action-card" onClick={() => navigate("/listening")}>
            <div className="action-icon">🎧</div>
            <h3>Thử thách nghe</h3>
            <p>Nâng cao kỹ năng nghe</p>
            <button className="action-btn">NGHE NGAY</button>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/diagnostic-test")}
          >
            <div className="action-icon">✅</div>
            <h3>Kiểm tra trình độ</h3>
            <p>Đánh giá trình độ của bạn</p>
            <button className="action-btn">LÀM TEST</button>
          </div>

          <div className="action-card" onClick={() => navigate("/progress")}>
            <div className="action-icon">📊</div>
            <h3>Tiến độ</h3>
            <p>Xem thống kê của bạn</p>
            <button className="action-btn secondary">XEM</button>
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
