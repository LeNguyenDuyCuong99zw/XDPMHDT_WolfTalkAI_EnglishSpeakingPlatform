import React from 'react';

const DailyGoalsCard: React.FC = () => (
  <div className="dashboard-dailygoals-card">
    <div className="dashboard-dailygoals-title">Daily Goals</div>
    <ul className="dashboard-dailygoals-list">
      <li className="dashboard-dailygoals-done">Complete 1 Lesson</li>
      <li>Review 20 words</li>
      <li>Practice Speaking (5m)</li>
    </ul>
  </div>
);

export default DailyGoalsCard;
