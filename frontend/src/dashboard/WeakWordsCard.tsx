import React from 'react';

const WeakWordsCard: React.FC = () => (
  <div className="dashboard-weakwords-card">
    <div className="dashboard-weakwords-title">Weak Words</div>
    <div className="dashboard-weakwords-desc">15 words need your attention based on recent mistakes.</div>
    <button className="dashboard-btn-practice">Practice Now</button>
  </div>
);

export default WeakWordsCard;
