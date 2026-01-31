import React from "react";
import LeaderboardPanel from "../components/listening/LeaderboardPanel";
import "./LeaderboardPage.css";

const LeaderboardPage: React.FC = () => {
  return (
    <div className="leaderboard-page">
      {/* Main Content Area */}
      <div className="learning-path-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="greeting">
            <h1>🏆 Bảng Xếp Hạng</h1>
            <p className="welcome-subtitle">
              Xem thứ hạng của bạn và so sánh với các người chơi khác trên toàn
              thế giới
            </p>
          </div>
        </div>

        {/* Leaderboard Content */}
        <LeaderboardPanel />
      </div>
    </div>
  );
};

export default LeaderboardPage;
