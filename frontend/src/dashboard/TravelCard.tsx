import React from 'react';

const TravelCard: React.FC = () => (
  <div className="dashboard-travel-card">
    <div className="dashboard-travel-title">Travel Essentials</div>
    <div className="dashboard-travel-desc">Learn key phrases for navigating airports and hotels.</div>
    <button className="dashboard-btn-lesson">Start Lesson</button>
    <div className="dashboard-travel-img">
      <img src="/images/japan.png" alt="Travel" style={{ width: 120, borderRadius: 18 }} />
    </div>
  </div>
);

export default TravelCard;
