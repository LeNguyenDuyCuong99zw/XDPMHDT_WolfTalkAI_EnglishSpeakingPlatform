import React from 'react';

const AiCoachCard: React.FC = () => (
  <div className="dashboard-ai-card">
    <div className="dashboard-ai-badge">AI COACH INSIGHT</div>
    <div className="dashboard-ai-quote">
      "Your speaking score is great, but let's tackle <a href='#' className='dashboard-ai-link'>Past Tense</a> verbs today."
    </div>
    <div className="dashboard-ai-desc">I've prepared a special deck focused on irregular verbs to help you boost your confidence.</div>
    <button className="dashboard-btn-grammar">Start Grammar Focus</button>
    <div className="dashboard-ai-img">
      <img src="/images/books.png" alt="Books" style={{ width: 90, borderRadius: 18 }} />
    </div>
  </div>
);

export default AiCoachCard;
