import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  maxScore = 100,
  icon = '📊',
  color = 'blue',
}) => {
  const percentage = (score / maxScore) * 100;

  const getColor = () => {
    if (color === 'green') return '#10b981';
    if (color === 'yellow') return '#f59e0b';
    if (color === 'red') return '#ef4444';
    return '#3b82f6';
  };

  const getBackgroundColor = () => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#3b82f6';
    if (percentage >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="score-card">
      <div className="score-header">
        <span className="score-icon">{icon}</span>
        <h3 className="score-title">{title}</h3>
      </div>
      <div className="score-value">{score.toFixed(1)}</div>
      <div className="score-progress-container">
        <div
          className="score-progress-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: getBackgroundColor(),
          }}
        />
      </div>
      <div className="score-percentage">{percentage.toFixed(0)}%</div>

      <style>{`
        .score-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .score-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .score-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .score-icon {
          font-size: 24px;
        }

        .score-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin: 0;
        }

        .score-value {
          font-size: 36px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
        }

        .score-progress-container {
          width: 100%;
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .score-progress-bar {
          height: 100%;
          transition: width 0.5s ease, background-color 0.3s;
          border-radius: 4px;
        }

        .score-percentage {
          font-size: 12px;
          font-weight: 500;
          color: #9ca3af;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default ScoreCard;
