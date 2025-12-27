import React from 'react';

const WeakAreasCard: React.FC<{ areas: { title: string, label: string, accuracy: string }[] }> = ({ areas }) => (
  <div className="progress-weak-areas-card">
    <div className="progress-weak-header">
      <span>Weak Areas Identified</span>
      <a href="#" className="progress-view-all">View All</a>
    </div>
    <div className="progress-weak-list">
      {areas.map((area, idx) => (
        <div className="progress-weak-item" key={idx}>
          <div>
            <b>{area.title}</b>
            <div className="progress-weak-label">{area.label} • <span className="progress-weak-bad">{area.accuracy}</span></div>
          </div>
          <button className="progress-btn-practice">Practice Now</button>
        </div>
      ))}
    </div>
  </div>
);

export default WeakAreasCard;
