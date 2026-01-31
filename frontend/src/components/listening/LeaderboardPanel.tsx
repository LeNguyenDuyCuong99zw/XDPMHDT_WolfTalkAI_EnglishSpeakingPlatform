import React, { useState, useEffect } from "react";
import { apiClient } from "../../services/api";
import "./LeaderboardPanel.css";

interface WeeklyLeaderboardEntry {
  rank: number;
  userId: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  weeklyXp: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  tier: string;
  tierEmoji: string;
  league?: string;
  weekStart: string;
  weekEnd: string;
}

// apiClient handles all the configuration and token injection

const LeaderboardPanel: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<WeeklyLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState<string>("");
  const [weekEnd, setWeekEnd] = useState<string>("");
  const [sortBy, setSortBy] = useState<"xp" | "tier" | "streak">("xp");

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Vui lòng đăng nhập để xem bảng xếp hạng");
        return;
      }

      const response = await apiClient.get<WeeklyLeaderboardEntry[]>(
        "/api/leaderboard/weekly?limit=100",
      );

      setLeaderboard(response);

      // Set week dates from first entry
      if (response.length > 0) {
        setWeekStart(formatDate(response[0].weekStart));
        setWeekEnd(formatDate(response[0].weekEnd));
      }
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      setError("Không thể tải bảng xếp hạng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...leaderboard].sort((a, b) => {
    if (sortBy === "xp") {
      return b.weeklyXp - a.weeklyXp;
    } else if (sortBy === "streak") {
      return (b.currentStreak || 0) - (a.currentStreak || 0);
    } else {
      // Sort by tier (Diamond > Gold > Silver > Bronze)
      const tierOrder = { DIAMOND: 4, GOLD: 3, SILVER: 2, BRONZE: 1 };
      const tierA = tierOrder[a.tier as keyof typeof tierOrder] || 0;
      const tierB = tierOrder[b.tier as keyof typeof tierOrder] || 0;
      return tierB - tierA;
    }
  });

  if (loading) {
    return (
      <div className="leaderboard-panel loading">
        <div className="spinner"></div>
        <p>Đang tải bảng xếp hạng...</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-panel">
      <div className="leaderboard-header">
        <h2>🏆 Bảng Xếp Hạng</h2>
        <div className="sort-buttons">
          <button
            className={`sort-btn ${sortBy === "xp" ? "active" : ""}`}
            onClick={() => setSortBy("xp")}
          >
            ⭐ XP
          </button>
          <button
            className={`sort-btn ${sortBy === "streak" ? "active" : ""}`}
            onClick={() => setSortBy("streak")}
          >
            🔥 Streak
          </button>
          <button
            className={`sort-btn ${sortBy === "tier" ? "active" : ""}`}
            onClick={() => setSortBy("tier")}
          >
            💎 Rank
          </button>
        </div>
      </div>

      <div className="leaderboard-table">
        <div className="leaderboard-table-header">
          <div className="col-rank">Xếp hạng</div>
          <div className="col-name">Người chơi</div>
          <div className="col-xp">XP</div>
          <div className="col-streak">Streak</div>
          <div className="col-tier">Rank</div>
        </div>

        {leaderboard.length === 0 ? (
          <div className="empty-leaderboard">
            <p>📊 Chưa có dữ liệu xếp hạng tuần này</p>
            <p className="empty-subtitle">
              Hãy hoàn thành một số thử thách để bắt đầu!
            </p>
          </div>
        ) : (
          sorted.map((entry) => (
            <div
              key={entry.userId}
              className={`leaderboard-row ${
                entry.rank <= 3 ? `top-${entry.rank}` : ""
              }`}
            >
              <div className="col-rank">
                <span className="rank-badge">
                  {entry.rank === 1 && "🥇"}
                  {entry.rank === 2 && "🥈"}
                  {entry.rank === 3 && "🥉"}
                  {entry.rank > 3 && `#${entry.rank}`}
                </span>
              </div>

              <div className="col-name">
                <div className="user-info">
                  {entry.avatar ? (
                    <img
                      src={entry.avatar}
                      alt={entry.firstName}
                      className="avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {(entry.firstName[0] + entry.lastName[0]).toUpperCase()}
                    </div>
                  )}
                  <div className="user-name-section">
                    <span className="user-name">
                      {entry.firstName} {entry.lastName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-xp">
                <span className="xp-badge">{entry.weeklyXp} XP</span>
              </div>

              <div className="col-streak">
                <span className="streak-badge">
                  🔥 {entry.currentStreak || 0}
                </span>
              </div>

              <div className="col-tier">
                <span className="tier-emoji">{entry.tierEmoji}</span>
                <span className="tier-name">{entry.tier}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="leaderboard-footer">
        <p className="footer-text">
          🏆 Xếp hạng dựa trên XP hàng tuần (reset vào Thứ Hai hàng tuần)
        </p>
      </div>
    </div>
  );
};

// Helper function to format date
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default LeaderboardPanel;
