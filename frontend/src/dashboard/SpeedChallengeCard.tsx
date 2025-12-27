import React from 'react';

const SpeedChallengeCard: React.FC = () => (
  <div className="dashboard-speedchallenge-card">
    <div className="dashboard-speedchallenge-title">Speed Challenge</div>
    <div className="dashboard-speedchallenge-best">Best Score <span>1,240</span></div>
    <button className="dashboard-btn-play">Play Game</button>
  </div>
);

export default SpeedChallengeCard;
