import React from 'react';

const FluencyCard: React.FC<{ data: { month: string, value: number }[] }> = ({ data }) => {
  // Placeholder for chart, will replace with real chart later
  return (
    <div className="progress-fluency-card">
      <div className="progress-fluency-header">
        <span>Fluency Growth</span>
        <span className="progress-fluency-growth">+12%</span>
      </div>
      <div className="progress-fluency-chart">
        <div className="progress-fluency-chart-placeholder">[Chart]</div>
      </div>
    </div>
  );
};

export default FluencyCard;
