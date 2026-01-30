// src/presentation/pages/mentor/ProgressTrackingPage/components/LearningPath.tsx

import React from 'react';
import { CheckCircle2, Circle, Lock, Trophy } from 'lucide-react';
import './LearningPath.css';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  progress: number;
  completedDate?: string;
}

interface LearningPathProps {
  studentId: string;
  studentName: string;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  studentName,
}) => {
  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Beginner Foundations',
      description: 'Học cơ bản về ngữ pháp và từ vựng',
      status: 'completed',
      progress: 100,
      completedDate: '15/12/2025',
    },
    {
      id: '2',
      title: 'Basic Communication',
      description: 'Giao tiếp cơ bản trong cuộc sống hàng ngày',
      status: 'completed',
      progress: 100,
      completedDate: '05/01/2026',
    },
    {
      id: '3',
      title: 'Intermediate Skills',
      description: 'Phát triển kỹ năng nghe, nói, đọc, viết',
      status: 'current',
      progress: 65,
    },
    {
      id: '4',
      title: 'Advanced Practice',
      description: 'Luyện tập nâng cao và chuyên sâu',
      status: 'locked',
      progress: 0,
    },
    {
      id: '5',
      title: 'Master Level',
      description: 'Đạt trình độ thành thạo tiếng Anh',
      status: 'locked',
      progress: 0,
    },
  ];

  return (
    <div className="learning-path">
      <div className="learning-path__header">
        <h3 className="learning-path__title">Lộ Trình Học Tập</h3>
        <p className="learning-path__subtitle">
          Theo dõi tiến trình học tập của {studentName}
        </p>
      </div>

      <div className="learning-path__timeline">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`learning-path__milestone learning-path__milestone--${milestone.status}`}
          >
            {/* Connector Line */}
            {index < milestones.length - 1 && (
              <div className="learning-path__connector" />
            )}

            {/* Milestone Icon */}
            <div className="learning-path__icon">
              {milestone.status === 'completed' && (
                <CheckCircle2 size={24} />
              )}
              {milestone.status === 'current' && <Circle size={24} />}
              {milestone.status === 'locked' && <Lock size={24} />}
            </div>

            {/* Milestone Content */}
            <div className="learning-path__content">
              <div className="learning-path__content-header">
                <h4 className="learning-path__milestone-title">
                  {milestone.title}
                </h4>
                {milestone.status === 'completed' && (
                  <span className="learning-path__completed-badge">
                    <Trophy size={14} />
                    Hoàn thành
                  </span>
                )}
              </div>

              <p className="learning-path__milestone-desc">
                {milestone.description}
              </p>

              {/* Progress Bar */}
              {milestone.status !== 'locked' && (
                <div className="learning-path__progress">
                  <div className="learning-path__progress-bar">
                    <div
                      className="learning-path__progress-fill"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                  <span className="learning-path__progress-text">
                    {milestone.progress}%
                  </span>
                </div>
              )}

              {/* Completed Date */}
              {milestone.completedDate && (
                <span className="learning-path__completed-date">
                  Hoàn thành: {milestone.completedDate}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
