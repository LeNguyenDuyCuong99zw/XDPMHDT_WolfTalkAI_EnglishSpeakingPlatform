// src/presentation/pages/mentor/PronunciationAnalysisPage/components/ErrorHighlighter.tsx

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Info, Volume2, X } from 'lucide-react';
import './ErrorHighlighter.css';

interface PronunciationError {
  word: string;
  position: number; // vị trí từ trong câu
  type: 'pronunciation' | 'stress' | 'intonation' | 'grammar';
  severity: 'low' | 'medium' | 'high';
  expected: string;
  actual: string;
  suggestion: string;
  phonetic?: string;
  audioExample?: string;
}

interface ErrorHighlighterProps {
  text: string;
  errors: PronunciationError[];
  onPlayExample?: (word: string) => void;
}

export const ErrorHighlighter: React.FC<ErrorHighlighterProps> = ({
  text,
  errors,
  onPlayExample,
}) => {
  const [selectedError, setSelectedError] = useState<PronunciationError | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Split text into words
  const words = text.split(' ');

  const getErrorForWord = (index: number): PronunciationError | undefined => {
    return errors.find((error) => error.position === index);
  };

  const getErrorClass = (error?: PronunciationError) => {
    if (!error) return '';
    
    const baseClass = 'error-highlighter__word--error';
    const severityClass = `error-highlighter__word--${error.severity}`;
    const typeClass = `error-highlighter__word--${error.type}`;
    
    return `${baseClass} ${severityClass} ${typeClass}`;
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'pronunciation':
        return <AlertCircle size={16} />;
      case 'stress':
        return <Info size={16} />;
      case 'intonation':
        return <Volume2 size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pronunciation: 'Phát âm',
      stress: 'Trọng âm',
      intonation: 'Ngữ điệu',
      grammar: 'Ngữ pháp',
    };
    return labels[type] || type;
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      low: 'Nhẹ',
      medium: 'Trung bình',
      high: 'Nghiêm trọng',
    };
    return labels[severity] || severity;
  };

  const filteredErrors = filterType === 'all' 
    ? errors 
    : errors.filter((e) => e.type === filterType);

  const errorStats = {
    total: errors.length,
    pronunciation: errors.filter((e) => e.type === 'pronunciation').length,
    stress: errors.filter((e) => e.type === 'stress').length,
    intonation: errors.filter((e) => e.type === 'intonation').length,
  };

  return (
    <div className="error-highlighter">
      {/* Header */}
      <div className="error-highlighter__header">
        <div className="error-highlighter__header-icon">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="error-highlighter__title">Phát Hiện Lỗi</h3>
          <p className="error-highlighter__subtitle">
            Nhấn vào từ được đánh dấu để xem chi tiết
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="error-highlighter__stats">
        <div className="error-highlighter__stat">
          <span className="error-highlighter__stat-value">{errorStats.total}</span>
          <span className="error-highlighter__stat-label">Tổng lỗi</span>
        </div>
        <div className="error-highlighter__stat error-highlighter__stat--pronunciation">
          <span className="error-highlighter__stat-value">{errorStats.pronunciation}</span>
          <span className="error-highlighter__stat-label">Phát âm</span>
        </div>
        <div className="error-highlighter__stat error-highlighter__stat--stress">
          <span className="error-highlighter__stat-value">{errorStats.stress}</span>
          <span className="error-highlighter__stat-label">Trọng âm</span>
        </div>
        <div className="error-highlighter__stat error-highlighter__stat--intonation">
          <span className="error-highlighter__stat-value">{errorStats.intonation}</span>
          <span className="error-highlighter__stat-label">Ngữ điệu</span>
        </div>
      </div>

      {/* Filter */}
      <div className="error-highlighter__filters">
        <button
          className={`error-highlighter__filter-btn ${
            filterType === 'all' ? 'error-highlighter__filter-btn--active' : ''
          }`}
          onClick={() => setFilterType('all')}
        >
          Tất cả
        </button>
        <button
          className={`error-highlighter__filter-btn ${
            filterType === 'pronunciation' ? 'error-highlighter__filter-btn--active' : ''
          }`}
          onClick={() => setFilterType('pronunciation')}
        >
          Phát âm
        </button>
        <button
          className={`error-highlighter__filter-btn ${
            filterType === 'stress' ? 'error-highlighter__filter-btn--active' : ''
          }`}
          onClick={() => setFilterType('stress')}
        >
          Trọng âm
        </button>
        <button
          className={`error-highlighter__filter-btn ${
            filterType === 'intonation' ? 'error-highlighter__filter-btn--active' : ''
          }`}
          onClick={() => setFilterType('intonation')}
        >
          Ngữ điệu
        </button>
      </div>

      {/* Text with highlighted errors */}
      <div className="error-highlighter__text-container">
        <div className="error-highlighter__text">
          {words.map((word, index) => {
            const error = getErrorForWord(index);
            const isFiltered = filterType !== 'all' && error && error.type !== filterType;
            
            return (
              <React.Fragment key={index}>
                <span
                  className={`error-highlighter__word ${
                    error && !isFiltered ? getErrorClass(error) : ''
                  }`}
                  onClick={() => error && !isFiltered && setSelectedError(error)}
                >
                  {word}
                  {error && !isFiltered && (
                    <span className="error-highlighter__error-indicator">
                      {getErrorIcon(error.type)}
                    </span>
                  )}
                </span>
                {index < words.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Error details panel */}
      {selectedError && (
        <div className="error-highlighter__details">
          <div className="error-highlighter__details-header">
            <div className="error-highlighter__details-title-row">
              <h4 className="error-highlighter__details-title">
                Chi Tiết Lỗi: "{selectedError.word}"
              </h4>
              <button
                className="error-highlighter__close-btn"
                onClick={() => setSelectedError(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="error-highlighter__details-meta">
              <span
                className={`error-highlighter__badge error-highlighter__badge--${selectedError.type}`}
              >
                {getTypeLabel(selectedError.type)}
              </span>
              <span
                className={`error-highlighter__badge error-highlighter__badge--${selectedError.severity}`}
              >
                {getSeverityLabel(selectedError.severity)}
              </span>
            </div>
          </div>

          <div className="error-highlighter__details-content">
            {/* Phonetic */}
            {selectedError.phonetic && (
              <div className="error-highlighter__detail-item">
                <span className="error-highlighter__detail-label">Phiên âm:</span>
                <span className="error-highlighter__detail-value error-highlighter__phonetic">
                  {selectedError.phonetic}
                </span>
              </div>
            )}

            {/* Expected vs Actual */}
            <div className="error-highlighter__comparison">
              <div className="error-highlighter__comparison-item error-highlighter__comparison-item--wrong">
                <span className="error-highlighter__comparison-label">
                  <X size={14} />
                  Phát âm thực tế
                </span>
                <span className="error-highlighter__comparison-value">
                  {selectedError.actual}
                </span>
              </div>
              <div className="error-highlighter__comparison-item error-highlighter__comparison-item--correct">
                <span className="error-highlighter__comparison-label">
                  <CheckCircle2 size={14} />
                  Phát âm đúng
                </span>
                <span className="error-highlighter__comparison-value">
                  {selectedError.expected}
                </span>
              </div>
            </div>

            {/* Suggestion */}
            <div className="error-highlighter__suggestion">
              <div className="error-highlighter__suggestion-icon">
                <Info size={16} />
              </div>
              <p className="error-highlighter__suggestion-text">
                {selectedError.suggestion}
              </p>
            </div>

            {/* Play example */}
            {onPlayExample && (
              <button
                className="error-highlighter__play-example-btn"
                onClick={() => onPlayExample(selectedError.word)}
              >
                <Volume2 size={18} />
                <span>Nghe Ví Dụ Chuẩn</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error list */}
      {filteredErrors.length > 0 && (
        <div className="error-highlighter__list">
          <h4 className="error-highlighter__list-title">
            Danh sách lỗi ({filteredErrors.length})
          </h4>
          <div className="error-highlighter__list-items">
            {filteredErrors.map((error, index) => (
              <div
                key={index}
                className="error-highlighter__list-item"
                onClick={() => setSelectedError(error)}
              >
                <div className="error-highlighter__list-item-icon">
                  {getErrorIcon(error.type)}
                </div>
                <div className="error-highlighter__list-item-content">
                  <span className="error-highlighter__list-item-word">
                    {error.word}
                  </span>
                  <span className="error-highlighter__list-item-type">
                    {getTypeLabel(error.type)} • {getSeverityLabel(error.severity)}
                  </span>
                </div>
                <div
                  className={`error-highlighter__list-item-severity error-highlighter__list-item-severity--${error.severity}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
