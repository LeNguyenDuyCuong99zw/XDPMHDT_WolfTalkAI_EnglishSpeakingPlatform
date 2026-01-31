import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../services/api";
import {
  QuestDashboardData,
  UserQuestProgress,
  ClaimRewardResponse,
  MonthlyChallengeProgress,
  getQuestIcon,
  getChallengeIcon,
  getTierColor,
  getTierEmoji,
  getStatusDisplay,
} from "../../types/quest";
import "./QuestDashboard.css";

// Response types matching backend
interface DashboardResponse {
  success: boolean;
  dashboard: QuestDashboardData;
}

interface ClaimResponse {
  success: boolean;
  result: ClaimRewardResponse;
}

const QuestDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<QuestDashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchDashboard = useCallback(async () => {
    // Kiểm tra token trước khi gọi API
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setNeedsLogin(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setNeedsLogin(false);

      const response =
        await apiClient.get<DashboardResponse>("/quests/dashboard");
      console.log("Quest Dashboard API Response:", response);
      console.log("Daily Quests:", response.dashboard?.dailyQuests);
      if (response.success && response.dashboard) {
        setDashboardData(response.dashboard);
      } else {
        setError("Không thể tải dữ liệu nhiệm vụ");
      }
    } catch (err: any) {
      console.error("Error fetching quest dashboard:", err);
      // Kiểm tra lỗi 401 Unauthorized
      if (err?.response?.status === 401) {
        setNeedsLogin(true);
        localStorage.removeItem("accessToken"); // Token hết hạn, xóa đi
      } else {
        setError("Không thể tải dữ liệu nhiệm vụ. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleClaimReward = async (progressId: number) => {
    try {
      setClaimingId(progressId);
      const response = await apiClient.post<ClaimResponse>("/quests/claim", {
        progressId,
      });

      if (response.success && response.result) {
        showNotification(
          `🎉 Nhận thưởng: +${response.result.xpEarned} XP, +${response.result.gemsEarned} 💎`,
          "success",
        );
        // Refresh dashboard
        fetchDashboard();
      }
    } catch (err) {
      console.error("Error claiming reward:", err);
      showNotification("Không thể nhận thưởng. Vui lòng thử lại.", "error");
    } finally {
      setClaimingId(null);
    }
  };

  const handleClaimAll = async () => {
    try {
      setClaimingId(-1); // -1 indicates claiming all
      const response = await apiClient.post<ClaimResponse>(
        "/quests/claim-all",
        {},
      );

      if (response.success && response.result) {
        showNotification(
          `🎉 Nhận tất cả: +${response.result.xpEarned} XP, +${response.result.gemsEarned} 💎`,
          "success",
        );
        fetchDashboard();
      }
    } catch (err) {
      console.error("Error claiming all rewards:", err);
      showNotification("Không thể nhận thưởng. Vui lòng thử lại.", "error");
    } finally {
      setClaimingId(null);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const renderProgressBar = (progress: number, color: string) => {
    return (
      <div className="quest-progress-bar">
        <div
          className="quest-progress-fill"
          style={{
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    );
  };

  const renderDailyQuest = (
    questProgress: UserQuestProgress,
    index: number,
  ) => {
    // Support both nested quest object and flat structure from backend
    // Backend DTO uses: title, description, currentProgress, progressPercentage
    // Frontend may also have: questTitle, currentValue, progress
    const questTitle =
      (questProgress as any).title ||
      questProgress.quest?.title ||
      questProgress.questTitle;
    const questType =
      (questProgress as any).questType ||
      questProgress.quest?.type ||
      questProgress.questType;
    const targetValue =
      (questProgress as any).targetValue ||
      questProgress.quest?.targetValue ||
      questProgress.targetValue ||
      0;
    const xpReward =
      (questProgress as any).xpReward ||
      questProgress.quest?.xpReward ||
      questProgress.xpReward ||
      0;
    const challengeType =
      (questProgress as any).targetChallengeType ||
      questProgress.quest?.challengeType;

    // Handle both currentProgress (backend) and currentValue (frontend)
    const currentValue =
      (questProgress as any).currentProgress ?? questProgress.currentValue ?? 0;

    // Handle both progressPercentage (backend) and progress (frontend)
    const progress =
      (questProgress as any).progressPercentage ?? questProgress.progress ?? 0;

    // Get correct ID for claiming (progressId from backend or id)
    const progressId = (questProgress as any).progressId || questProgress.id;

    if (!questTitle) {
      console.log("Quest missing title:", questProgress);
      return null;
    }

    const isCompleted = questProgress.status === "COMPLETED";
    const isClaimed = questProgress.status === "CLAIMED";
    const canClaim = isCompleted && !isClaimed;
    const isClaiming = claimingId === progressId;

    // Get icon class based on quest type
    const getIconClass = () => {
      if (questType === "XP" || challengeType === "XP") return "xp-quest";
      if (questType === "LESSON" || challengeType === "LESSON")
        return "lesson-quest";
      if (questType === "STREAK" || challengeType === "STREAK")
        return "streak-quest";
      if (questType === "TIME" || challengeType === "TIME") return "time-quest";
      return "default-quest";
    };

    // Get icon emoji
    const getIcon = () => {
      if (challengeType) return getChallengeIcon(challengeType);
      if (questType) return getQuestIcon(questType);
      return "📋";
    };

    return (
      <div
        key={progressId || index}
        className={`quest-card ${isCompleted ? "completed" : ""} ${
          isClaimed ? "claimed" : ""
        }`}
      >
        {/* Quest Icon */}
        <div className={`quest-icon-container ${getIconClass()}`}>
          <span>{getIcon()}</span>
        </div>

        {/* Quest Content */}
        <div className="quest-content">
          <h3 className="quest-title">{questTitle}</h3>
          <div className="quest-progress-row">
            <div className="quest-progress-bar-container">
              <div
                className={`quest-progress-bar-fill ${isCompleted ? "completed" : ""}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="quest-progress-text">
              {currentValue} / {targetValue}
            </span>
          </div>
        </div>

        {/* Reward Badge */}
        <div className="quest-reward-badge">⭐</div>

        {/* Action */}
        <div className="quest-action">
          {canClaim ? (
            <button
              className="claim-button"
              onClick={() => handleClaimReward(progressId)}
              disabled={isClaiming}
            >
              {isClaiming ? <span className="loading-spinner-small" /> : "Nhận"}
            </button>
          ) : isClaimed ? (
            <span className="status-badge claimed">✓</span>
          ) : (
            <span
              className="status-badge in-progress"
              style={{ color: getStatusDisplay(questProgress.status).color }}
            >
              {xpReward} XP
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderMonthlyChallenge = (challenge: MonthlyChallengeProgress) => {
    if (!challenge) return null;

    const isCompleted = challenge.status === "COMPLETED";
    const isClaimed = challenge.status === "CLAIMED";
    const canClaim = isCompleted && !isClaimed;
    const isClaiming = claimingId === (challenge.progressId || challenge.id);

    // Map backend fields to display values (handle both naming conventions)
    const title =
      challenge.title || challenge.challengeTitle || "Thử thách tháng";
    const currentValue =
      challenge.completedQuests ?? challenge.currentValue ?? 0;
    const targetValue =
      challenge.totalQuestsRequired ?? challenge.targetValue ?? 0;
    const progress = challenge.progressPercentage ?? challenge.progress ?? 0;
    const daysRemaining =
      challenge.remainingDays ?? challenge.daysRemaining ?? 0;

    // Get Vietnamese month name
    const getVietnameseMonth = () => {
      const months = [
        "THÁNG MỘT",
        "THÁNG HAI",
        "THÁNG BA",
        "THÁNG TƯ",
        "THÁNG NĂM",
        "THÁNG SÁU",
        "THÁNG BẢY",
        "THÁNG TÁM",
        "THÁNG CHÍN",
        "THÁNG MƯỜI",
        "THÁNG MƯỜI MỘT",
        "THÁNG MƯỜI HAI",
      ];
      const currentMonth = new Date().getMonth();
      return months[currentMonth];
    };

    return (
      <div
        className={`monthly-challenge-card ${isCompleted ? "completed" : ""}`}
      >
        <div className="monthly-header">
          <span className="month-badge">{getVietnameseMonth()}</span>
          <div className="monthly-title-row">
            <h2 className="monthly-title">{title}</h2>
            <div className="monthly-timer">
              <span className="timer-icon">⏰</span>
              <span>{daysRemaining} NGÀY</span>
            </div>
          </div>
        </div>

        <div className="monthly-progress-box">
          <span className="progress-label">
            Hoàn thành {targetValue} nhiệm vụ
          </span>
          <div className="monthly-progress-bar-container">
            <div
              className="monthly-progress-bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="monthly-progress-text">
            {currentValue} / {targetValue}
          </span>
        </div>

        {canClaim && (
          <button
            className="claim-monthly-button"
            onClick={() =>
              handleClaimReward(challenge.progressId || challenge.id)
            }
            disabled={isClaiming}
          >
            {isClaiming ? (
              <span className="loading-spinner-small" />
            ) : (
              "🎉 Nhận thưởng!"
            )}
          </button>
        )}

        {isClaimed && (
          <div className="monthly-claimed-badge">✅ Đã hoàn thành!</div>
        )}

        <div className="monthly-mascot">🦊</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="quest-dashboard loading">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Đang tải nhiệm vụ...</p>
        </div>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="quest-dashboard needs-login">
        <div className="login-prompt-container">
          <span className="login-icon">🔐</span>
          <h3>Vui lòng đăng nhập</h3>
          <p>Bạn cần đăng nhập để xem và hoàn thành nhiệm vụ hàng ngày.</p>
          <button className="login-button" onClick={() => navigate("/login")}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quest-dashboard error">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchDashboard}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const completedQuests =
    dashboardData.dailyQuests?.filter(
      (q) => q.status === "COMPLETED" || q.status === "CLAIMED",
    ).length || 0;
  const hasClaimableQuests =
    dashboardData.dailyQuests?.some((q) => q.status === "COMPLETED") || false;

  return (
    <div className="quest-dashboard">
      {/* Notification */}
      {notification && (
        <div className={`quest-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Main Layout: Left Content + Right Sidebar */}
      <div className="quest-layout">
        {/* Left Content */}
        <div className="quest-main-content">
          {/* Stats Header */}
          <div className="quest-stats-header">
            <div className="stat-card xp-stat">
              <span className="stat-icon">⭐</span>
              <div className="stat-content">
                <span className="stat-value">
                  {dashboardData.totalXpToday || 0}
                </span>
                <span className="stat-label">XP Hôm nay</span>
              </div>
            </div>
            <div className="stat-card streak-stat">
              <span className="stat-icon">🔥</span>
              <div className="stat-content">
                <span className="stat-value">
                  {dashboardData.currentStreak || 0}
                </span>
                <span className="stat-label">Chuỗi ngày</span>
              </div>
            </div>
            <div className="stat-card completed-stat">
              <span className="stat-icon">✅</span>
              <div className="stat-content">
                <span className="stat-value">
                  {dashboardData.dailyQuestsCompleted || completedQuests}/
                  {dashboardData.dailyQuestsTotal ||
                    dashboardData.dailyQuests?.length ||
                    0}
                </span>
                <span className="stat-label">Hoàn thành</span>
              </div>
            </div>
            <div className="stat-card gems-stat">
              <span className="stat-icon">�</span>
              <div className="stat-content">
                <span className="stat-value">
                  {dashboardData.pendingGemsReward || 0}
                </span>
                <span className="stat-label">Gems chờ nhận</span>
              </div>
            </div>
          </div>

          {/* Monthly Challenge Section */}
          {dashboardData.monthlyChallenge && (
            <section className="monthly-section">
              <h2 className="section-title">🏆 Thử thách tháng</h2>
              {renderMonthlyChallenge(dashboardData.monthlyChallenge)}
            </section>
          )}

          {/* Daily Quests Section */}
          <section className="daily-quests-section">
            <div className="section-header">
              <h2 className="section-title">📋 Nhiệm vụ hàng ngày</h2>
              <div className="section-header-right">
                {dashboardData.remainingTimeHours &&
                  dashboardData.remainingTimeHours > 0 && (
                    <span className="daily-timer">
                      ⏰ {dashboardData.remainingTimeHours} GIỜ
                    </span>
                  )}
                {hasClaimableQuests && (
                  <button
                    className="claim-all-button"
                    onClick={handleClaimAll}
                    disabled={claimingId === -1}
                  >
                    {claimingId === -1 ? (
                      <span className="loading-spinner-small" />
                    ) : (
                      "Nhận tất cả"
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="quests-grid">
              {dashboardData.dailyQuests &&
              dashboardData.dailyQuests.length > 0 ? (
                dashboardData.dailyQuests.map((quest, index) =>
                  renderDailyQuest(quest, index),
                )
              ) : (
                <div className="no-quests-message">
                  <span className="no-quests-icon">📝</span>
                  <p>Chưa có nhiệm vụ nào cho hôm nay.</p>
                  <p className="no-quests-hint">
                    Hãy bắt đầu học để nhận nhiệm vụ mới!
                  </p>
                </div>
              )}
            </div>
            <p className="daily-reset-notice">
              ⏰ Nhiệm vụ hàng ngày reset vào 00:00 mỗi ngày
              {dashboardData.remainingTimeHours &&
                dashboardData.remainingTimeHours > 0 && (
                  <span> ({dashboardData.remainingTimeHours} giờ còn lại)</span>
                )}
            </p>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="quest-sidebar">
          {/* Unlock Leaderboards Card */}
          <div className="sidebar-card unlock-card">
            <div className="unlock-icon">🔓</div>
            <h3 className="unlock-title">Mở khóa Bảng xếp hạng!</h3>
            <p className="unlock-description">
              Hoàn thành thêm 4 bài học để bắt đầu cạnh tranh
            </p>
            <div className="unlock-progress-container">
              <div className="unlock-progress-bar">
                <div className="unlock-progress-fill"></div>
              </div>
              <div className="unlock-lessons">
                <span className="lesson-dot completed">📖</span>
                <span className="lesson-dot">📖</span>
                <span className="lesson-dot">📖</span>
                <span className="lesson-dot">📖</span>
                <span className="lesson-dot">📖</span>
              </div>
            </div>
          </div>

          {/* Daily Goal Card */}
          <div className="sidebar-card daily-goal-card">
            <div className="daily-goal-header">
              <span className="goal-icon">🎯</span>
              <span className="goal-title">Mục tiêu hôm nay</span>
            </div>
            <div className="daily-goal-content">
              <div className="goal-xp">
                <span className="goal-current">
                  {dashboardData.totalXpToday || 0}
                </span>
                <span className="goal-separator">/</span>
                <span className="goal-target">50 XP</span>
              </div>
              <div className="goal-progress-bar">
                <div
                  className="goal-progress-fill"
                  style={{
                    width: `${Math.min(((dashboardData.totalXpToday || 0) / 50) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Create Profile Card */}
          <div className="sidebar-card profile-card">
            <div className="profile-avatar">🦊</div>
            <h3 className="profile-title">Tạo hồ sơ của bạn</h3>
            <p className="profile-description">
              Lưu tiến trình học tập và kết nối với bạn bè
            </p>
            <button className="profile-button">TẠO HỒ SƠ</button>
            <button className="profile-button-secondary">ĐĂNG NHẬP</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuestDashboard;
