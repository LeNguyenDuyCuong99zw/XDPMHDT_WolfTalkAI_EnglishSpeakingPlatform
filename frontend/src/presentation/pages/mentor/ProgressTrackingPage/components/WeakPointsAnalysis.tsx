// src/presentation/pages/mentor/ProgressTrackingPage/components/WeakPointsAnalysis.tsx

import React from 'react';
import { AlertCircle, Target, Lightbulb, TrendingUp } from 'lucide-react';
import './WeakPointsAnalysis.css';

interface WeakPoint {
  id: string;
  skill: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
  examples: string[];
}

interface WeakPointsAnalysisProps {
  studentName: string;
}

export const WeakPointsAnalysis: React.FC<WeakPointsAnalysisProps> = ({
  studentName,
}) => {
  const weakPoints: WeakPoint[] = [
    {
      id: '1',
      skill: 'Writing',
      issue: 'Sử dụng thì không chính xác',
      severity: 'high',
      recommendation: 'Luyện tập thêm về các thì cơ bản (Present, Past, Future)',
      examples: [
        'I go to school yesterday ❌ → I went to school yesterday ✓',
        'She will goes there ❌ → She will go there ✓',
      ],
    },
    {
      id: '2',
      skill: 'Speaking',
      issue: 'Phát âm một số âm cuối chưa rõ',
      severity: 'medium',
      recommendation: 'Luyện phát âm các âm /t/, /d/, /s/ ở cuối từ',
      examples: [
        'worked /wɜːrkt/ - chú ý phát âm "ed"',
        'books /bʊks/ - phát âm rõ "s" cuối',
      ],
    },
    {
      id: '3',
      skill: 'Grammar',
      issue: 'Thứ tự từ trong câu hỏi',
      severity: 'medium',
      recommendation: 'Ôn lại cấu trúc câu hỏi với động từ khuyết thiếu',
      examples: [
        'Where you are going? ❌ → Where are you going? ✓',
        'What she likes? ❌ → What does she like? ✓',
      ],
    },
    {
      id: '4',
      skill: 'Vocabulary',
      issue: 'Hạn chế từ vựng về chủ đề công nghệ',
      severity: 'low',
      recommendation: 'Học 10-15 từ mới mỗi ngày về technology',
      examples: [
        'artificial intelligence, automation, cybersecurity',
        'cloud computing, blockchain, innovation',
      ],
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'rgba(254, 226, 226, 0.5)',
          border: 'rgba(239, 68, 68, 0.3)',
          text: '#dc2626',
        };
      case 'medium':
        return {
          bg: 'rgba(254, 243, 199, 0.5)',
          border: 'rgba(251, 191, 36, 0.3)',
          text: '#d97706',
        };
      case 'low':
        return {
          bg: 'rgba(219, 234, 254, 0.5)',
          border: 'rgba(14, 165, 233, 0.3)',
          text: '#0369a1',
        };
      default:
        return {
          bg: 'rgba(248, 250, 252, 0.5)',
          border: 'rgba(148, 163, 184, 0.3)',
          text: '#64748b',
        };
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Ưu tiên cao';
      case 'medium':
        return 'Ưu tiên trung bình';
      case 'low':
        return 'Ưu tiên thấp';
      default:
        return '';
    }
  };

  return (
    <div className="weak-points-analysis">
      <div className="weak-points-analysis__header">
        <div className="weak-points-analysis__header-icon">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="weak-points-analysis__title">Điểm Cần Cải Thiện</h3>
          <p className="weak-points-analysis__subtitle">
            Phân tích và đề xuất cải thiện cho {studentName}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="weak-points-analysis__stats">
        <div className="weak-point-stat weak-point-stat--high">
          <span className="weak-point-stat__value">
            {weakPoints.filter((w) => w.severity === 'high').length}
          </span>
          <span className="weak-point-stat__label">Ưu tiên cao</span>
        </div>
        <div className="weak-point-stat weak-point-stat--medium">
          <span className="weak-point-stat__value">
            {weakPoints.filter((w) => w.severity === 'medium').length}
          </span>
          <span className="weak-point-stat__label">Ưu tiên TB</span>
        </div>
        <div className="weak-point-stat weak-point-stat--low">
          <span className="weak-point-stat__value">
            {weakPoints.filter((w) => w.severity === 'low').length}
          </span>
          <span className="weak-point-stat__label">Ưu tiên thấp</span>
        </div>
      </div>

      {/* Weak Points List */}
      <div className="weak-points-analysis__list">
        {weakPoints.map((point) => {
          const colors = getSeverityColor(point.severity);

          return (
            <div
              key={point.id}
              className="weak-point-card"
              style={{
                background: colors.bg,
                borderColor: colors.border,
              }}
            >
              <div className="weak-point-card__header">
                <div className="weak-point-card__skill-tag">{point.skill}</div>
                <span
                  className="weak-point-card__severity"
                  style={{ color: colors.text }}
                >
                  {getSeverityLabel(point.severity)}
                </span>
              </div>

              <div className="weak-point-card__content">
                <div className="weak-point-card__section">
                  <div className="weak-point-card__section-header">
                    <Target size={16} />
                    <h4 className="weak-point-card__section-title">Vấn Đề</h4>
                  </div>
                  <p className="weak-point-card__text">{point.issue}</p>
                </div>

                <div className="weak-point-card__section">
                  <div className="weak-point-card__section-header">
                    <Lightbulb size={16} />
                    <h4 className="weak-point-card__section-title">Đề Xuất</h4>
                  </div>
                  <p className="weak-point-card__text">{point.recommendation}</p>
                </div>

                {point.examples.length > 0 && (
                  <div className="weak-point-card__section">
                    <div className="weak-point-card__section-header">
                      <TrendingUp size={16} />
                      <h4 className="weak-point-card__section-title">Ví Dụ</h4>
                    </div>
                    <div className="weak-point-card__examples">
                      {point.examples.map((example, index) => (
                        <div key={index} className="weak-point-card__example">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="weak-point-card__action-btn">
                Tạo Kế Hoạch Luyện Tập
              </button>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="weak-points-analysis__actions">
        <button className="weak-points-analysis__action-btn weak-points-analysis__action-btn--primary">
          <Target size={18} />
          <span>Tạo Lộ Trình Cải Thiện</span>
        </button>
        <button className="weak-points-analysis__action-btn weak-points-analysis__action-btn--secondary">
          <Lightbulb size={18} />
          <span>Gợi Ý Bài Tập</span>
        </button>
      </div>
    </div>
  );
};
