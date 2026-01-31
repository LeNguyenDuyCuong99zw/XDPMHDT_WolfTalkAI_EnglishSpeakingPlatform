// src/presentation/pages/mentor/ProgressTrackingPage/components/MilestoneTracker.tsx

import React from 'react';
import { Target, Star, Award, Zap, TrendingUp } from 'lucide-react';
import './MilestoneTracker.css';

interface Achievement {
  id: string;
  icon: 'target' | 'star' | 'award' | 'zap';
  title: string;
  description: string;
  earnedDate: string;
  type: 'gold' | 'silver' | 'bronze';
}


export const MilestoneTracker: React.FC = () => {
  const achievements: Achievement[] = [
    {
      id: '1',
      icon: 'star',
      title: 'First Week Streak',
      description: 'Học liên tục 7 ngày',
      earnedDate: '10/01/2026',
      type: 'gold',
    },
    {
      id: '2',
      icon: 'target',
      title: '50 Lessons Completed',
      description: 'Hoàn thành 50 bài học',
      earnedDate: '12/01/2026',
      type: 'silver',
    },
    {
      id: '3',
      icon: 'award',
      title: 'Speaking Champion',
      description: 'Đạt 90% điểm speaking',
      earnedDate: '15/01/2026',
      type: 'gold',
    },
    {
      id: '4',
      icon: 'zap',
      title: 'Speed Learner',
      description: 'Hoàn thành bài học trong thời gian kỷ lục',
      earnedDate: '16/01/2026',
      type: 'bronze',
    },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'target':
        return <Target size={24} />;
      case 'star':
        return <Star size={24} />;
      case 'award':
        return <Award size={24} />;
      case 'zap':
        return <Zap size={24} />;
      default:
        return <Star size={24} />;
    }
  };

  return (
    <div className="milestone-tracker">
      <div className="milestone-tracker__header">
        <div className="milestone-tracker__header-icon">
          <TrendingUp size={20} />
        </div>
        <div>
          <h3 className="milestone-tracker__title">Thành Tích Đạt Được</h3>
          <p className="milestone-tracker__subtitle">
            {achievements.length} huy hiệu đã đạt được
          </p>
        </div>
      </div>

      <div className="milestone-tracker__achievements">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card achievement-card--${achievement.type}`}
          >
            <div className="achievement-card__icon">
              {getIcon(achievement.icon)}
            </div>
            <div className="achievement-card__content">
              <h4 className="achievement-card__title">{achievement.title}</h4>
              <p className="achievement-card__desc">{achievement.description}</p>
              <span className="achievement-card__date">
                {achievement.earnedDate}
              </span>
            </div>
            <div className="achievement-card__badge">
              <Award size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="milestone-tracker__summary">
        <div className="milestone-summary-stat">
          <div className="milestone-summary-stat__icon milestone-summary-stat__icon--gold">
            <Award size={18} />
          </div>
          <div className="milestone-summary-stat__content">
            <span className="milestone-summary-stat__value">2</span>
            <span className="milestone-summary-stat__label">Vàng</span>
          </div>
        </div>

        <div className="milestone-summary-stat">
          <div className="milestone-summary-stat__icon milestone-summary-stat__icon--silver">
            <Award size={18} />
          </div>
          <div className="milestone-summary-stat__content">
            <span className="milestone-summary-stat__value">1</span>
            <span className="milestone-summary-stat__label">Bạc</span>
          </div>
        </div>

        <div className="milestone-summary-stat">
          <div className="milestone-summary-stat__icon milestone-summary-stat__icon--bronze">
            <Award size={18} />
          </div>
          <div className="milestone-summary-stat__content">
            <span className="milestone-summary-stat__value">1</span>
            <span className="milestone-summary-stat__label">Đồng</span>
          </div>
        </div>
      </div>
    </div>
  );
};
