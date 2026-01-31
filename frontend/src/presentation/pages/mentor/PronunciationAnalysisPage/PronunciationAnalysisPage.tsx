// src/presentation/pages/mentor/PronunciationAnalysisPage/PronunciationAnalysisPage.tsx

import React, { useState } from 'react';
import {
  Mic,
  Filter,
  Search,
  Plus,
  Loader2,
  TrendingUp,
  Target,
} from 'lucide-react';
import './PronunciationAnalysisPage.css';

interface PronunciationAnalysis {
  id: string;
  learnerName: string;
  learnerEmail: string;
  text: string;
  recordingUrl?: string;
  score: number; // 0-100
  errors: {
    word: string;
    type: 'pronunciation' | 'stress' | 'intonation';
    severity: 'low' | 'medium' | 'high';
  }[];
  analyzedAt: string;
  status: 'pending' | 'analyzed' | 'reviewed';
}

export const PronunciationAnalysisPage: React.FC = () => {
  const [analyses] = useState<PronunciationAnalysis[]>([]);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateAnalysis = () => {
    // TODO: Mở modal tạo bài phân tích mới
    alert('Tính năng tạo phân tích phát âm đang được phát triển');
  };

  const filteredAnalyses = analyses.filter(
    (analysis) =>
      analysis.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && analyses.length === 0) {
    return (
      <div className="pronunciation-page pronunciation-page--loading glass-card">
        <Loader2 className="pronunciation-page__spinner" size={40} />
        <span className="pronunciation-page__loading-text">
          Đang tải phân tích...
        </span>
      </div>
    );
  }

  return (
    <div className="pronunciation-page">
      {/* Header */}
      <div className="pronunciation-page__header glass-card">
        <div className="pronunciation-page__header-main">
          <div className="pronunciation-page__header-icon">
            <Mic size={20} />
          </div>
          <div>
            <h2 className="pronunciation-page__title">Phân Tích Phát Âm</h2>
            <p className="pronunciation-page__subtitle">
              Chỉ ra lỗi phát âm, trọng âm và ngữ điệu của học viên
            </p>
          </div>
        </div>
        <div className="pronunciation-page__actions">
          <button
            className="pronunciation-page__icon-button"
            type="button"
            title="Bộ lọc"
          >
            <Filter size={18} />
          </button>
          <button
            className="pronunciation-page__primary-button"
            type="button"
            onClick={handleCreateAnalysis}
          >
            <Plus size={18} />
            <span>Tạo Phân Tích Mới</span>
          </button>
        </div>
      </div>

      {/* Search controls */}
      {analyses.length > 0 && (
        <div className="pronunciation-page__controls glass-card">
          <div className="pronunciation-page__search">
            <Search className="pronunciation-page__search-icon" size={18} />
            <input
              type="text"
              className="pronunciation-page__search-input"
              placeholder="Tìm kiếm theo học viên, nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Content / Empty */}
      <div className="pronunciation-page__content glass-card">
        {filteredAnalyses.length > 0 ? (
          <div className="pronunciation-page__list">
            {filteredAnalyses.map((analysis) => (
              <PronunciationCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        ) : (
          <div className="pronunciation-page__empty">
            <div className="pronunciation-page__empty-icon">
              <Mic size={28} />
            </div>
            <h3 className="pronunciation-page__empty-title">
              {analyses.length === 0
                ? 'Chưa có phân tích phát âm nào'
                : 'Không tìm thấy phân tích'}
            </h3>
            <p className="pronunciation-page__empty-text">
              {analyses.length === 0
                ? 'Tạo phân tích đầu tiên để giúp học viên cải thiện phát âm. Hệ thống sẽ tự động phát hiện lỗi phát âm, trọng âm và ngữ điệu.'
                : 'Hãy thử điều chỉnh tiêu chí tìm kiếm của bạn.'}
            </p>
            <span className="pronunciation-page__hint">
              <Target size={14} />
              AI tự động phát hiện lỗi và đánh giá độ chính xác
            </span>
            {analyses.length === 0 && (
              <button
                className="pronunciation-page__primary-button pronunciation-page__primary-button--empty"
                type="button"
                onClick={handleCreateAnalysis}
              >
                <Plus size={18} />
                <span>Tạo Phân Tích Đầu Tiên</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface PronunciationCardProps {
  analysis: PronunciationAnalysis;
}

const PronunciationCard: React.FC<PronunciationCardProps> = ({ analysis }) => {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ phân tích',
      analyzed: 'Đã phân tích',
      reviewed: 'Đã xem xét',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'pronunciation-page__status--pending',
      analyzed: 'pronunciation-page__status--analyzed',
      reviewed: 'pronunciation-page__status--reviewed',
    };
    return colors[status] || '';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'pronunciation-page__score--good';
    if (score >= 60) return 'pronunciation-page__score--medium';
    return 'pronunciation-page__score--poor';
  };

  return (
    <div className="pronunciation-page__card glass-card">
      {/* Status badge */}
      <span
        className={`pronunciation-page__status-badge ${getStatusColor(
          analysis.status
        )}`}
      >
        {getStatusLabel(analysis.status)}
      </span>

      {/* Card header */}
      <div className="pronunciation-page__card-header">
        <h3 className="pronunciation-page__card-learner">
          {analysis.learnerName}
        </h3>
        <p className="pronunciation-page__card-text">{analysis.text}</p>
      </div>

      {/* Score */}
      <div className="pronunciation-page__card-score">
        <div
          className={`pronunciation-page__score-circle ${getScoreColor(
            analysis.score
          )}`}
        >
          <span className="pronunciation-page__score-value">
            {analysis.score}
          </span>
          <span className="pronunciation-page__score-label">điểm</span>
        </div>
        <div className="pronunciation-page__score-details">
          <div className="pronunciation-page__score-item">
            <span className="pronunciation-page__score-item-label">
              Lỗi phát âm
            </span>
            <span className="pronunciation-page__score-item-value">
              {
                analysis.errors.filter((e) => e.type === 'pronunciation')
                  .length
              }
            </span>
          </div>
          <div className="pronunciation-page__score-item">
            <span className="pronunciation-page__score-item-label">
              Lỗi trọng âm
            </span>
            <span className="pronunciation-page__score-item-value">
              {analysis.errors.filter((e) => e.type === 'stress').length}
            </span>
          </div>
          <div className="pronunciation-page__score-item">
            <span className="pronunciation-page__score-item-label">
              Lỗi ngữ điệu
            </span>
            <span className="pronunciation-page__score-item-value">
              {analysis.errors.filter((e) => e.type === 'intonation').length}
            </span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="pronunciation-page__card-meta">
        <div className="pronunciation-page__meta-item">
          <span className="pronunciation-page__meta-label">Ngày phân tích</span>
          <span className="pronunciation-page__meta-value">
            {new Date(analysis.analyzedAt).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="pronunciation-page__meta-item">
          <span className="pronunciation-page__meta-label">Email</span>
          <span className="pronunciation-page__meta-value">
            {analysis.learnerEmail}
          </span>
        </div>
      </div>

      {/* Card actions */}
      <div className="pronunciation-page__card-actions">
        <button className="pronunciation-page__action-btn pronunciation-page__action-btn--primary">
          <TrendingUp size={14} />
          Xem Chi Tiết
        </button>
        <button className="pronunciation-page__action-btn pronunciation-page__action-btn--secondary">
          Gửi Feedback
        </button>
      </div>
    </div>
  );
};
