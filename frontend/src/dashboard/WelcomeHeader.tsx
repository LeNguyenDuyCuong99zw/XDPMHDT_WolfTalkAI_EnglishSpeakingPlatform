import React from 'react';

const WelcomeHeader: React.FC<{ name: string }> = ({ name }) => (
  <div className="dashboard-header">
    <div>
      <h1 className="dashboard-title">Welcome back, {name}!</h1>
      <div className="dashboard-desc">Let's continue your journey to fluency.</div>
    </div>
    <div className="dashboard-streak">
      <span role="img" aria-label="fire">🔥</span> 5 Day Streak
    </div>
  </div>
);

export default WelcomeHeader;
