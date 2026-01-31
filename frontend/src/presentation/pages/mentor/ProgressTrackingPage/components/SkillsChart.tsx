// src/presentation/pages/mentor/ProgressTrackingPage/components/SkillsChart.tsx

import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './SkillsChart.css';

interface SkillData {
  name: string;
  current: number;
  previous: number;
  target: number;
}

interface SkillsChartProps {
  studentName: string;
}

export const SkillsChart: React.FC<SkillsChartProps> = ({
  studentName,
}) => {
  const skills: SkillData[] = [
    {
      name: 'Speaking',
      current: 85,
      previous: 78,
      target: 90,
    },
    {
      name: 'Listening',
      current: 90,
      previous: 85,
      target: 95,
    },
    {
      name: 'Reading',
      current: 92,
      previous: 88,
      target: 95,
    },
    {
      name: 'Writing',
      current: 78,
      previous: 80,
      target: 85,
    },
    {
      name: 'Grammar',
      current: 88,
      previous: 82,
      target: 90,
    },
    {
      name: 'Vocabulary',
      current: 82,
      previous: 82,
      target: 90,
    },
  ];

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp size={14} className="skills-chart__trend-icon--up" />;
    } else if (current < previous) {
      return <TrendingDown size={14} className="skills-chart__trend-icon--down" />;
    } else {
      return <Minus size={14} className="skills-chart__trend-icon--stable" />;
    }
  };

  const getTrendText = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) return `+${diff}`;
    if (diff < 0) return `${diff}`;
    return '0';
  };

  const getBarColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 95) return '#10b981'; // Green
    if (percentage >= 80) return '#0ea5e9'; // Blue
    if (percentage >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="skills-chart">
      <div className="skills-chart__header">
        <div className="skills-chart__header-icon">
          <BarChart3 size={20} />
        </div>
        <div>
          <h3 className="skills-chart__title">Biểu Đồ Kỹ Năng</h3>
          <p className="skills-chart__subtitle">
            Phân tích chi tiết các kỹ năng của {studentName}
          </p>
        </div>
      </div>

      <div className="skills-chart__legend">
        <div className="skills-chart__legend-item">
          <span className="skills-chart__legend-dot skills-chart__legend-dot--current" />
          <span className="skills-chart__legend-label">Hiện tại</span>
        </div>
        <div className="skills-chart__legend-item">
          <span className="skills-chart__legend-dot skills-chart__legend-dot--target" />
          <span className="skills-chart__legend-label">Mục tiêu</span>
        </div>
      </div>

      <div className="skills-chart__bars">
        {skills.map((skill) => {
          const barColor = getBarColor(skill.current, skill.target);
          const progressWidth = (skill.current / 100) * 100;
          const targetPosition = (skill.target / 100) * 100;

          return (
            <div key={skill.name} className="skill-bar">
              <div className="skill-bar__header">
                <span className="skill-bar__name">{skill.name}</span>
                <div className="skill-bar__values">
                  <span className="skill-bar__current">{skill.current}%</span>
                  <div className="skill-bar__trend">
                    {getTrendIcon(skill.current, skill.previous)}
                    <span>{getTrendText(skill.current, skill.previous)}</span>
                  </div>
                </div>
              </div>

              <div className="skill-bar__container">
                <div className="skill-bar__background">
                  {/* Current Progress Bar */}
                  <div
                    className="skill-bar__progress"
                    style={{
                      width: `${progressWidth}%`,
                      backgroundColor: barColor,
                    }}
                  >
                    <div className="skill-bar__shimmer" />
                  </div>

                  {/* Target Marker */}
                  <div
                    className="skill-bar__target-marker"
                    style={{ left: `${targetPosition}%` }}
                  >
                    <div className="skill-bar__target-line" />
                    <span className="skill-bar__target-label">
                      {skill.target}%
                    </span>
                  </div>
                </div>

                {/* Scale Markers */}
                <div className="skill-bar__scale">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>

              {/* Gap to Target */}
              {skill.current < skill.target && (
                <div className="skill-bar__gap">
                  Còn {skill.target - skill.current}% để đạt mục tiêu
                </div>
              )}
              {skill.current >= skill.target && (
                <div className="skill-bar__achieved">
                  ✓ Đã đạt mục tiêu
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Summary */}
      <div className="skills-chart__summary">
        <div className="skills-chart__summary-item">
          <span className="skills-chart__summary-label">Điểm Trung Bình</span>
          <span className="skills-chart__summary-value">
            {(
              skills.reduce((sum, s) => sum + s.current, 0) / skills.length
            ).toFixed(1)}
            %
          </span>
        </div>
        <div className="skills-chart__summary-item">
          <span className="skills-chart__summary-label">Kỹ Năng Mạnh Nhất</span>
          <span className="skills-chart__summary-value">
            {skills.reduce((max, s) => (s.current > max.current ? s : max)).name}
          </span>
        </div>
        <div className="skills-chart__summary-item">
          <span className="skills-chart__summary-label">Cần Cải Thiện</span>
          <span className="skills-chart__summary-value">
            {skills.reduce((min, s) => (s.current < min.current ? s : min)).name}
          </span>
        </div>
      </div>
    </div>
  );
};
