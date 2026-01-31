import React, { useState, useEffect } from "react";
import { apiClient } from "../../services/api";
import "./WeeklyLeaderboardWidget.css";

interface WeeklyLeaderboardEntry {
  rank: number;
  userId: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  weeklyXp: number;
  tier: string;
  tierEmoji: string;
}

interface UserStats {
  userId: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  weeklyXp: number;
  rank: number;
  tier: string;
  tierEmoji: string;
}

// apiClient handles all the configuration and token injection

const WeeklyLeaderboardWidget: React.FC = () => {
  const [topUsers, setTopUsers] = useState<WeeklyLeaderboardEntry[]>([]);
  const [myStats, setMyStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Vui lòng đăng nhập để xem bảng xếp hạng");
        return;
      }

      console.log("Token found:", token.substring(0, 20) + "...");

      // Fetch top 5 leaderboard
      const leaderboardResponse = await apiClient.get<WeeklyLeaderboardEntry[]>(
        "/leaderboard/weekly?limit=5",
      );
      setTopUsers(leaderboardResponse);

      // Fetch user stats
      const statsResponse = await apiClient.get<UserStats>(
        "/leaderboard/stats/me",
      );
      setMyStats(statsResponse);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      console.log("Full error details:", err);
      setError("Không thể tải bảng xếp hạng");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="weekly-leaderboard-widget loading">
        <div className="widget-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weekly-leaderboard-widget error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="weekly-leaderboard-widget">
      {/* Header */}
      <div className="widget-header">
        <div className="header-title">
          <h3>⭐ Tuần Này</h3>
          <span className="week-badge">Tuần {getWeekNumber()}</span>
        </div>
        <a href="/leaderboard" className="view-all-link">
          Xem tất cả →
        </a>
      </div>

      {/* Top 5 Users */}
      <div className="top-users">
        {topUsers.map((user) => (
          <div key={user.userId} className="leaderboard-item">
            <div className="rank-badge">
              {user.rank === 1 && "🥇"}
              {user.rank === 2 && "🥈"}
              {user.rank === 3 && "🥉"}
              {user.rank > 3 && `#${user.rank}`}
            </div>

            <div className="user-info">
              <div className="user-avatar">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {(user.firstName[0] + user.lastName[0]).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="user-details">
                <p className="user-name">
                  {user.firstName} {user.lastName}
                </p>
                <p className="user-xp">{user.weeklyXp} XP</p>
              </div>
            </div>

            <div className="tier-badge">
              <span className="tier-emoji">{user.tierEmoji}</span>
            </div>
          </div>
        ))}
      </div>

      {/* My Rank Section */}
      {myStats && (
        <div className="my-rank-section">
          <div className="my-rank-card">
            <div className="rank-info">
              <div className="my-rank-number">#{myStats.rank}</div>
              <div className="my-stats">
                <p className="my-name">
                  {myStats.firstName} {myStats.lastName}
                </p>
                <p className="my-tier">
                  {myStats.tierEmoji} {getTierLabel(myStats.tier)}
                </p>
              </div>
            </div>

            <div className="my-xp">
              <div className="xp-value">{myStats.weeklyXp}</div>
              <div className="xp-label">XP</div>
            </div>
          </div>

          {/* XP Progress to Next Tier */}
          <div className="tier-progress">
            <p className="tier-progress-label">Tiến độ tới tier tiếp theo</p>
            <div className="progress-bar-container">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${getProgressPercentage(myStats.weeklyXp)}%`,
                  }}
                />
              </div>
            </div>
            <p className="progress-text">
              {myStats.weeklyXp} / {getNextTierXP(myStats.tier)} XP
            </p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <a href="/leaderboard" className="view-leaderboard-btn">
        👀 Xem Bảng Xếp Hạng Đầy Đủ
      </a>
    </div>
  );
};

// Helper functions
function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
}

function getTierLabel(tier: string): string {
  const labels: Record<string, string> = {
    BRONZE: "Bronze",
    SILVER: "Silver",
    GOLD: "Gold",
    DIAMOND: "Diamond",
  };
  return labels[tier] || tier;
}

function getNextTierXP(tier: string): number {
  const tierXP: Record<string, number> = {
    BRONZE: 100,
    SILVER: 300,
    GOLD: 500,
    DIAMOND: 500,
  };
  return tierXP[tier] || 100;
}

function getProgressPercentage(xp: number): number {
  let currentTierXP = 0;
  let nextTierXP = 100;

  if (xp < 100) {
    currentTierXP = 0;
    nextTierXP = 100;
  } else if (xp < 300) {
    currentTierXP = 100;
    nextTierXP = 300;
  } else if (xp < 500) {
    currentTierXP = 300;
    nextTierXP = 500;
  } else {
    currentTierXP = 500;
    nextTierXP = 500; // Diamond is max
  }

  const progress = xp - currentTierXP;
  const tierRange = nextTierXP - currentTierXP;
  return Math.min((progress / tierRange) * 100, 100);
}

export default WeeklyLeaderboardWidget;
