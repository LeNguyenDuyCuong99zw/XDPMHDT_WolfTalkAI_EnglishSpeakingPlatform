import React from 'react';

const TravelGoalCard: React.FC = () => (
  <div className="progress-travel-goal-card">
    <div className="progress-travel-title">Next Travel Goal</div>
    <div className="progress-travel-desc">You are learning French. Based on your progress, you'll be ready for your trip to Paris in 3 months!</div>
    <div className="progress-travel-actions">
      <button className="progress-btn-flight">Flight Booked</button>
      <button className="progress-btn-level">Level B2 Required</button>
    </div>
    <div className="progress-travel-map">Paris, France [Map]</div>
  </div>
);

export default TravelGoalCard;
