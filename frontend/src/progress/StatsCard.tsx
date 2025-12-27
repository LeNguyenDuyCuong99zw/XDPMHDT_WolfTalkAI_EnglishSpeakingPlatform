import React from 'react';

const StatsCard: React.FC<{ streak: number, time: string, words: number }> = ({ streak, time, words }) => (
  <div className="progress-stats-card">
    <div className="progress-stat">
      <div className="progress-stat-label">Current Streak</div>
      <div className="progress-stat-value">{streak} Days</div>
    </div>
    <div className="progress-stat">
      <div className="progress-stat-label">Total Time</div>
      <div className="progress-stat-value">{time}</div>
    </div>
    <div className="progress-stat">
      <div className="progress-stat-label">Words Mastered</div>
      <div className="progress-stat-value">{words.toLocaleString()}</div>
    </div>
  </div>
);

export default StatsCard;
