// src/presentation/pages/mentor/ProgressTrackingPage/ProgressTrackingPage.tsx

import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Search,
  Filter,
  Download,
  Target,
  Award,
  Clock,
  Activity,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import './ProgressTrackingPage.css';

interface StudentProgress {
  id: string;
  name: string;
  avatar?: string;
  level: string;
  overallProgress: number;
  completedLessons: number;
  totalLessons: number;
  studyStreak: number;
  lastActive: string;
  skills: {
    speaking: number;
    listening: number;
    reading: number;
    writing: number;
  };
  status: 'excellent' | 'good' | 'average' | 'needsAttention';
}

export const ProgressTrackingPage: React.FC = () => {
  const [students] = useState<StudentProgress[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      level: 'Intermediate',
      overallProgress: 85,
      completedLessons: 42,
      totalLessons: 50,
      studyStreak: 15,
      lastActive: '2 giờ trước',
      skills: { speaking: 80, listening: 85, reading: 90, writing: 75 },
      status: 'excellent',
    },
    {
      id: '2',
      name: 'Trần Thị B',
      level: 'Beginner',
      overallProgress: 65,
      completedLessons: 28,
      totalLessons: 50,
      studyStreak: 8,
      lastActive: '1 ngày trước',
      skills: { speaking: 60, listening: 70, reading: 65, writing: 65 },
      status: 'good',
    },
    {
      id: '3',
      name: 'Lê Văn C',
      level: 'Advanced',
      overallProgress: 92,
      completedLessons: 46,
      totalLessons: 50,
      studyStreak: 22,
      lastActive: '30 phút trước',
      skills: { speaking: 95, listening: 90, reading: 92, writing: 88 },
      status: 'excellent',
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      level: 'Intermediate',
      overallProgress: 45,
      completedLessons: 18,
      totalLessons: 50,
      studyStreak: 3,
      lastActive: '5 ngày trước',
      skills: { speaking: 40, listening: 50, reading: 45, writing: 45 },
      status: 'needsAttention',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const averageProgress =
    students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#0ea5e9';
      case 'average':
        return '#f59e0b';
      case 'needsAttention':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Xuất sắc';
      case 'good':
        return 'Tốt';
      case 'average':
        return 'Trung bình';
      case 'needsAttention':
        return 'Cần chú ý';
      default:
        return '';
    }
  };

  return (
    <div className="progress-tracking-page">
      {/* Header */}
      <div className="progress-tracking-page__header">
        <div>
          <h1 className="progress-tracking-page__title">
            <TrendingUp size={28} />
            Theo Dõi Tiến Độ
          </h1>
          <p className="progress-tracking-page__subtitle">
            Theo dõi và phân tích tiến độ học tập của học viên
          </p>
        </div>
        <button className="progress-tracking-page__export-btn">
          <Download size={18} />
          <span>Xuất Báo Cáo</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="progress-tracking-page__stats">
        <div className="progress-stat-card">
          <div className="progress-stat-card__icon progress-stat-card__icon--primary">
            <Users size={24} />
          </div>
          <div className="progress-stat-card__content">
            <span className="progress-stat-card__label">Tổng Học Viên</span>
            <h3 className="progress-stat-card__value">{students.length}</h3>
            <span className="progress-stat-card__trend progress-stat-card__trend--up">
              ↑ 12% so với tháng trước
            </span>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-card__icon progress-stat-card__icon--success">
            <Target size={24} />
          </div>
          <div className="progress-stat-card__content">
            <span className="progress-stat-card__label">Tiến Độ Trung Bình</span>
            <h3 className="progress-stat-card__value">{averageProgress.toFixed(0)}%</h3>
            <span className="progress-stat-card__trend progress-stat-card__trend--up">
              ↑ 8% so với tuần trước
            </span>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-card__icon progress-stat-card__icon--warning">
            <Activity size={24} />
          </div>
          <div className="progress-stat-card__content">
            <span className="progress-stat-card__label">Hoạt Động Hôm Nay</span>
            <h3 className="progress-stat-card__value">
              {students.filter((s) => s.lastActive.includes('giờ') || s.lastActive.includes('phút')).length}
            </h3>
            <span className="progress-stat-card__trend">
              {students.length} tổng học viên
            </span>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-card__icon progress-stat-card__icon--info">
            <Award size={24} />
          </div>
          <div className="progress-stat-card__content">
            <span className="progress-stat-card__label">Hoàn Thành Khóa</span>
            <h3 className="progress-stat-card__value">
              {students.filter((s) => s.overallProgress >= 90).length}
            </h3>
            <span className="progress-stat-card__trend">
              Trong tháng này
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="progress-tracking-page__controls glass-card">
        <div className="progress-tracking-page__search">
          <Search className="progress-tracking-page__search-icon" size={18} />
          <input
            type="text"
            className="progress-tracking-page__search-input"
            placeholder="Tìm kiếm học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="progress-tracking-page__filters">
          <Filter size={18} />
          <select
            className="progress-tracking-page__filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="excellent">Xuất sắc</option>
            <option value="good">Tốt</option>
            <option value="average">Trung bình</option>
            <option value="needsAttention">Cần chú ý</option>
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="progress-tracking-page__content">
        <div className="progress-tracking-page__list glass-card">
          <div className="progress-tracking-page__list-header">
            <h2 className="progress-tracking-page__list-title">
              Danh Sách Học Viên ({filteredStudents.length})
            </h2>
          </div>

          <div className="progress-tracking-page__students">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="student-progress-card"
                onClick={() => setSelectedStudent(student)}
              >
                {/* Student Info */}
                <div className="student-progress-card__header">
                  <div className="student-progress-card__avatar">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.name} />
                    ) : (
                      <span>{student.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="student-progress-card__info">
                    <h3 className="student-progress-card__name">{student.name}</h3>
                    <div className="student-progress-card__meta">
                      <span className="student-progress-card__level">{student.level}</span>
                      <span className="student-progress-card__separator">•</span>
                      <span className="student-progress-card__activity">
                        <Clock size={12} />
                        {student.lastActive}
                      </span>
                    </div>
                  </div>
                  <div
                    className="student-progress-card__status"
                    style={{ color: getStatusColor(student.status) }}
                  >
                    {getStatusLabel(student.status)}
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="student-progress-card__overall">
                  <div className="student-progress-card__overall-label">
                    <span>Tiến độ tổng thể</span>
                    <span className="student-progress-card__overall-value">
                      {student.overallProgress}%
                    </span>
                  </div>
                  <div className="student-progress-card__progress-bar">
                    <div
                      className="student-progress-card__progress-fill"
                      style={{
                        width: `${student.overallProgress}%`,
                        backgroundColor: getStatusColor(student.status),
                      }}
                    />
                  </div>
                </div>

                {/* Skills Breakdown */}
                <div className="student-progress-card__skills">
                  <div className="student-skill">
                    <span className="student-skill__label">Speaking</span>
                    <div className="student-skill__bar-container">
                      <div
                        className="student-skill__bar"
                        style={{ width: `${student.skills.speaking}%` }}
                      />
                    </div>
                    <span className="student-skill__value">{student.skills.speaking}%</span>
                  </div>

                  <div className="student-skill">
                    <span className="student-skill__label">Listening</span>
                    <div className="student-skill__bar-container">
                      <div
                        className="student-skill__bar"
                        style={{ width: `${student.skills.listening}%` }}
                      />
                    </div>
                    <span className="student-skill__value">{student.skills.listening}%</span>
                  </div>

                  <div className="student-skill">
                    <span className="student-skill__label">Reading</span>
                    <div className="student-skill__bar-container">
                      <div
                        className="student-skill__bar"
                        style={{ width: `${student.skills.reading}%` }}
                      />
                    </div>
                    <span className="student-skill__value">{student.skills.reading}%</span>
                  </div>

                  <div className="student-skill">
                    <span className="student-skill__label">Writing</span>
                    <div className="student-skill__bar-container">
                      <div
                        className="student-skill__bar"
                        style={{ width: `${student.skills.writing}%` }}
                      />
                    </div>
                    <span className="student-skill__value">{student.skills.writing}%</span>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="student-progress-card__stats">
                  <div className="student-progress-stat">
                    <CheckCircle2 size={16} />
                    <span>
                      {student.completedLessons}/{student.totalLessons} bài học
                    </span>
                  </div>
                  <div className="student-progress-stat">
                    <Activity size={16} />
                    <span>{student.studyStreak} ngày liên tục</span>
                  </div>
                </div>

                <button className="student-progress-card__view-btn">
                  Xem Chi Tiết
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Detail Modal (if needed) */}
      {selectedStudent && (
        <div
          className="progress-tracking-page__modal-overlay"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="progress-tracking-page__modal glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="progress-tracking-page__modal-header">
              <h2>Chi Tiết Tiến Độ - {selectedStudent.name}</h2>
              <button
                className="progress-tracking-page__modal-close"
                onClick={() => setSelectedStudent(null)}
              >
                ×
              </button>
            </div>
            <div className="progress-tracking-page__modal-content">
              <p>Nội dung chi tiết sẽ được bổ sung...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
