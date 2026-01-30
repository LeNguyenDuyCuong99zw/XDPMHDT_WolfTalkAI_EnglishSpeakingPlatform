import React, { useMemo, useState } from 'react';
import { Calendar, Clock, Copy, ExternalLink, Plus, Users, Video, X, Check } from 'lucide-react';
import './LiveSessionPage.css';

type SessionStatus = 'upcoming' | 'live' | 'ended';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  meetLink: string;
  scheduledTime: string; // ISO
  durationMin: number;
  participants: number;
  status: SessionStatus;
}

export const LiveSessionPage: React.FC = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([
    {
      id: '1',
      title: 'English Grammar Basics - Session 1',
      description: 'Học cơ bản về ngữ pháp tiếng Anh',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      scheduledTime: '2026-01-21T10:00:00',
      durationMin: 60,
      participants: 15,
      status: 'live',
    },
    {
      id: '2',
      title: 'Speaking Practice - Intermediate',
      description: 'Luyện nói tiếng Anh trình độ trung cấp',
      meetLink: 'https://meet.google.com/xyz-mnop-qrs',
      scheduledTime: '2026-01-21T14:00:00',
      durationMin: 45,
      participants: 12,
      status: 'upcoming',
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    meetLink: '',
    date: '',
    time: '',
    durationMin: 60,
  });

  const avgParticipants = useMemo(() => {
    if (!sessions.length) return 0;
    return Math.round(sessions.reduce((s, x) => s + x.participants, 0) / sessions.length);
  }, [sessions]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const joinMeet = (link: string) => window.open(link, '_blank', 'noopener,noreferrer');

  const copyLink = async (id: string, link: string) => {
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const iso = `${form.date}T${form.time}:00`;

    const newSession: LiveSession = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      meetLink: form.meetLink.trim(),
      scheduledTime: iso,
      durationMin: Number(form.durationMin),
      participants: 0,
      status: 'upcoming',
    };

    setSessions((prev) => [newSession, ...prev]);
    setShowCreateModal(false);
    setForm({ title: '', description: '', meetLink: '', date: '', time: '', durationMin: 60 });
  };

  const badge = (s: SessionStatus) => {
    if (s === 'live') return <span className="ls-badge ls-badge--live"><span className="ls-dot" />ĐANG LIVE</span>;
    if (s === 'upcoming') return <span className="ls-badge ls-badge--upcoming">Sắp diễn ra</span>;
    return <span className="ls-badge ls-badge--ended">Đã kết thúc</span>;
  };

  return (
    <div className="ls-page">
      <div className="ls-header">
        <div>
          <h1 className="ls-title"><Video size={28} />Buổi Học Trực Tiếp</h1>
          <p className="ls-subtitle">Chỉ mở link Google Meet (không build video call nội bộ).</p>
        </div>

        <button className="ls-create" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />Tạo Buổi Học Mới
        </button>
      </div>

      <div className="ls-stats">
        <div className="ls-stat"><span>Tổng buổi học</span><b>{sessions.length}</b></div>
        <div className="ls-stat"><span>Live</span><b>{sessions.filter(x => x.status === 'live').length}</b></div>
        <div className="ls-stat"><span>TB học viên/buổi</span><b>{avgParticipants}</b></div>
      </div>

      <div className="ls-list">
        {sessions.map((s) => (
          <div key={s.id} className={`ls-card ${s.status === 'live' ? 'ls-card--live' : ''}`}>
            <div className="ls-card__top">
              <div className="ls-card__titleRow">
                <h3 className="ls-card__title">{s.title}</h3>
                {badge(s.status)}
              </div>
              <p className="ls-card__desc">{s.description}</p>
            </div>

            <div className="ls-meta">
              <div className="ls-metaItem"><Calendar size={16} />{fmtDate(s.scheduledTime)}</div>
              <div className="ls-metaItem"><Clock size={16} />{fmtTime(s.scheduledTime)} - {s.durationMin} phút</div>
              <div className="ls-metaItem"><Users size={16} />{s.participants} học viên</div>
            </div>

            <div className="ls-link">
              <div className="ls-linkLabel"><Video size={14} />Google Meet Link:</div>
              <div className="ls-linkRow">
                <input readOnly value={s.meetLink} className="ls-linkInput" />
                <button className="ls-copy" onClick={() => copyLink(s.id, s.meetLink)}>
                  {copiedId === s.id ? <><Check size={16} />Đã sao chép</> : <><Copy size={16} />Sao chép</>}
                </button>
              </div>
            </div>

            <button className={`ls-join ${s.status === 'live' ? 'ls-join--live' : ''}`} onClick={() => joinMeet(s.meetLink)}>
              <ExternalLink size={18} />{s.status === 'live' ? 'Tham Gia Ngay' : 'Vào Phòng Họp'}
            </button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="ls-modalOverlay" onClick={() => setShowCreateModal(false)}>
          <div className="ls-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ls-modalHeader">
              <h2 className="ls-modalTitle"><Plus size={22} />Tạo Buổi Học</h2>
              <button className="ls-modalClose" onClick={() => setShowCreateModal(false)}><X size={18} /></button>
            </div>

            <form className="ls-form" onSubmit={onCreate}>
              <label className="ls-field">
                <span>Tiêu đề *</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </label>

              <label className="ls-field">
                <span>Mô tả *</span>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
              </label>

              <div className="ls-row">
                <label className="ls-field">
                  <span>Ngày *</span>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </label>
                <label className="ls-field">
                  <span>Giờ *</span>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                </label>
              </div>

              <label className="ls-field">
                <span>Thời lượng *</span>
                <select value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}>
                  <option value={30}>30 phút</option>
                  <option value={45}>45 phút</option>
                  <option value={60}>60 phút</option>
                  <option value={90}>90 phút</option>
                </select>
              </label>

              <label className="ls-field">
                <span>Google Meet Link *</span>
                <input value={form.meetLink} onChange={(e) => setForm({ ...form, meetLink: e.target.value })} placeholder="https://meet.google.com/xxx-yyyy-zzz" required />
              </label>

              <div className="ls-actions">
                <button type="button" className="ls-cancel" onClick={() => setShowCreateModal(false)}>Hủy</button>
                <button type="submit" className="ls-submit"><Plus size={18} />Tạo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
