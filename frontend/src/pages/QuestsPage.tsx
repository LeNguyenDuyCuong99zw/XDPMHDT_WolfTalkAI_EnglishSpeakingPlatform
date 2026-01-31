import React from "react";
import QuestDashboard from "../components/quest/QuestDashboard";
import "./QuestsPage.css";

const QuestsPage: React.FC = () => {
  return (
    <div className="quests-page">
      {/* Main Content Area */}
      <div className="learning-path-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="greeting">
            <h1>👑 Nhiệm vụ</h1>
            <p className="welcome-subtitle">
              Hoàn thành nhiệm vụ hàng ngày để nhận XP và leo bảng xếp hạng!
            </p>
          </div>
        </div>

        {/* Quest Dashboard Content */}
        <QuestDashboard />
      </div>
    </div>
  );
};

export default QuestsPage;
