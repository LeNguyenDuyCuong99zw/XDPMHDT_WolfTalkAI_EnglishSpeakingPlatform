import React from 'react';

const VocabularyCard: React.FC = () => (
  <div className="dashboard-vocab-card">
    <div className="dashboard-vocab-title">Vocabulary Mastery <span className="dashboard-vocab-percent">30%</span></div>
    <div className="dashboard-vocab-bar-bg">
      <div className="dashboard-vocab-bar" style={{ width: '30%' }}></div>
    </div>
    <div className="dashboard-vocab-level">Basic Level</div>
    <div className="dashboard-vocab-progress">300/1000 words</div>
    <button className="dashboard-btn-report">View Detailed Report</button>
  </div>
);

export default VocabularyCard;
