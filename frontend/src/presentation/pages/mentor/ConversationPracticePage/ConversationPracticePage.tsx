// src/presentation/pages/mentor/ConversationPracticePage/ConversationPracticePage.tsx

import React, { useState } from 'react';
import {
  MessageCircle,
  Filter,
  Search,
  Plus,
  Loader2,
  Video,
  Users,
  PlayCircle,
} from 'lucide-react';
import './ConversationPracticePage.css';

interface ConversationSession {
  id: string;
  topic: string;
  scenario: string;
  learnerName: string;
  learnerEmail: string;
  scheduledDate: string;
  duration: number; // minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  recordingUrl?: string;
  notes?: string;
  createdAt: string;
}

export const ConversationPracticePage: React.FC = () => {
  const [sessions, _setSessions] = useState<ConversationSession[]>([]);
  const [loading, _setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateSession = () => {
    // TODO: Mở modal tạo session mới
    alert('Tính năng tạo buổi luyện hội thoại đang được phát triển');
  };

  const handleStartVideoCall = (sessionId: string) => {
    // TODO: Kết nối video call
    alert(`Bắt đầu cuộc gọi video cho session: ${sessionId}`);
  };

  const filteredSessions = sessions.filter(
    (session) =>
      session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.scenario.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && sessions.length === 0) {
    return (
      <div className="conversation-page conversation-page--loading glass-card">
        <Loader2 className="conversation-page__spinner" size={40} />
        <span className="conversation-page__loading-text">
          Đang tải buổi luyện tập...
        </span>
      </div>
    );
  }

  return (
    <div className="conversation-page">
      {/* Header */}
      <div className="conversation-page__header glass-card">
        <div className="conversation-page__header-main">
          <div className="conversation-page__header-icon">
            <MessageCircle size={20} />
          </div>
          <div>
            <h2 className="conversation-page__title">Luyện Hội Thoại</h2>
            <p className="conversation-page__subtitle">
              Tổ chức các buổi luyện tập giao tiếp với học viên
            </p>
          </div>
        </div>
        <div className="conversation-page__actions">
          <button
            className="conversation-page__icon-button"
            type="button"
            title="Bộ lọc"
          >
            <Filter size={18} />
          </button>
          <button
            className="conversation-page__primary-button"
            type="button"
            onClick={handleCreateSession}
          >
            <Plus size={18} />
            <span>Tạo Buổi Luyện Tập</span>
          </button>
        </div>
      </div>

      {/* Search controls */}
      {sessions.length > 0 && (
        <div className="conversation-page__controls glass-card">
          <div className="conversation-page__search">
            <Search className="conversation-page__search-icon" size={18} />
            <input
              type="text"
              className="conversation-page__search-input"
              placeholder="Tìm kiếm theo chủ đề, học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Content / Empty */}
      <div className="conversation-page__content glass-card">
        {filteredSessions.length > 0 ? (
          <div className="conversation-page__list">
            {filteredSessions.map((session) => (
              <ConversationCard
                key={session.id}
                session={session}
                onStartVideoCall={handleStartVideoCall}
              />
            ))}
          </div>
        ) : (
          <div className="conversation-page__empty">
            <div className="conversation-page__empty-icon">
              <MessageCircle size={28} />
            </div>
            <h3 className="conversation-page__empty-title">
              {sessions.length === 0
                ? 'Chưa có buổi luyện hội thoại nào'
                : 'Không tìm thấy buổi luyện tập'}
            </h3>
            <p className="conversation-page__empty-text">
              {sessions.length === 0
                ? 'Tạo buổi luyện hội thoại đầu tiên để giúp học viên cải thiện kỹ năng giao tiếp. Bạn có thể chọn chủ đề, tình huống thực tế và lên lịch video call.'
                : 'Hãy thử điều chỉnh tiêu chí tìm kiếm của bạn.'}
            </p>
            <span className="conversation-page__hint">
              <Video size={14} />
              Hỗ trợ video call 1-1 và ghi lại buổi học
            </span>
            {sessions.length === 0 && (
              <button
                className="conversation-page__primary-button conversation-page__primary-button--empty"
                type="button"
                onClick={handleCreateSession}
              >
                <Plus size={18} />
                <span>Tạo Buổi Luyện Tập Đầu Tiên</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ConversationCardProps {
  session: ConversationSession;
  onStartVideoCall: (sessionId: string) => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  session,
  onStartVideoCall,
}) => {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: 'Đã lên lịch',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'conversation-page__status--scheduled',
      completed: 'conversation-page__status--completed',
      cancelled: 'conversation-page__status--cancelled',
    };
    return colors[status] || '';
  };

  return (
    <div className="conversation-page__card glass-card">
      {/* Status badge */}
      <span
        className={`conversation-page__status-badge ${getStatusColor(
          session.status
        )}`}
      >
        {getStatusLabel(session.status)}
      </span>

      {/* Card header */}
      <div className="conversation-page__card-header">
        <h3 className="conversation-page__card-title">{session.topic}</h3>
        <p className="conversation-page__card-scenario">{session.scenario}</p>
      </div>

      {/* Learner info */}
      <div className="conversation-page__card-learner">
        <Users size={14} />
        <span>{session.learnerName}</span>
      </div>

      {/* Meta */}
      <div className="conversation-page__card-meta">
        <div className="conversation-page__meta-item">
          <span className="conversation-page__meta-label">Ngày & Giờ</span>
          <span className="conversation-page__meta-value">
            {new Date(session.scheduledDate).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="conversation-page__meta-item">
          <span className="conversation-page__meta-label">Thời lượng</span>
          <span className="conversation-page__meta-value">
            {session.duration} phút
          </span>
        </div>
      </div>

      {/* Card actions */}
      <div className="conversation-page__card-actions">
        {session.status === 'scheduled' && (
          <button
            className="conversation-page__action-btn conversation-page__action-btn--primary"
            onClick={() => onStartVideoCall(session.id)}
          >
            <Video size={14} />
            Bắt đầu
          </button>
        )}
        {session.status === 'completed' && session.recordingUrl && (
          <button className="conversation-page__action-btn conversation-page__action-btn--primary">
            <PlayCircle size={14} />
            Xem lại
          </button>
        )}
        <button className="conversation-page__action-btn conversation-page__action-btn--secondary">
          Chi tiết
        </button>
      </div>
    </div>
  );
};
