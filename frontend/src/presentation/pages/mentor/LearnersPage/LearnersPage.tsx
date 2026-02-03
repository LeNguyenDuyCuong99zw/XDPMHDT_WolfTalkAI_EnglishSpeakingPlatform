// src/presentation/pages/mentor/LearnersPage/LearnersPage.tsx
import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, RefreshCw, AlertCircle, Calendar, Mail, GraduationCap } from 'lucide-react';
import { getMentorLearners, MentorLearner } from '../../../../services/mentorService';
import './LearnersPage.css';

// Helper to format date
const formatDate = (dateString: string | number | Date) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const LearnersPage: React.FC = () => {
  const [learners, setLearners] = useState<MentorLearner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [filterPackage, setFilterPackage] = useState<'ALL' | 'PROFESSIONAL' | 'PREMIUM'>('ALL');

  const fetchLearners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Always fetch ALL from backend and filter locally if needed for better UX, 
      // or pass filter to backend if list is huge. Start with ALL.
      const data = await getMentorLearners('ALL'); // Fetching all assigned learners
      setLearners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching learners:', err);
      setError('Không thể tải danh sách học viên. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLearners();
  }, []);

  const filteredLearners = learners.filter(l => {
    const matchesText = 
      l.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
      l.email.toLowerCase().includes(filterText.toLowerCase());
    
    const matchesPackage = filterPackage === 'ALL' || 
      l.subscription.packageCode.toUpperCase().includes(filterPackage);

    return matchesText && matchesPackage;
  });

  return (
    <div className="learners-page-container">
      {/* Background decoration */}
      <div className="page-bg-decoration"></div>

      {/* Header Section */}
      <header className="page-header glass-panel">
        <div className="header-content">
          <div className="header-title-group">
            <div className="icon-wrapper">
              <Users size={24} className="text-primary-400" />
            </div>
            <div>
              <h1 className="page-title">Học viên của tôi</h1>
              <p className="page-subtitle">
                Quản lý tiến độ và thông tin các học viên được phân công
              </p>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-icon glass-btn" 
              onClick={fetchLearners}
              title="Tải lại"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="toolbar mt-4">
          <div className="search-bar glass-input-wrapper">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="glass-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <Filter size={16} />
              <span>Gói học:</span>
            </label>
            <select 
              value={filterPackage}
              onChange={(e) => setFilterPackage(e.target.value as any)}
              className="glass-select"
            >
              <option value="ALL">Tất cả</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-content">
        {isLoading ? (
          <div className="loading-state glass-panel">
             <div className="spinner-ring"></div>
             <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
           <div className="error-state glass-panel error-border">
            <AlertCircle size={32} className="text-red-500" />
            <p className="text-red-500">{error}</p>
            <button className="btn btn-secondary mt-2" onClick={fetchLearners}>Thử lại</button>
          </div>
        ) : filteredLearners.length === 0 ? (
          <div className="empty-state glass-panel">
            <div className="empty-icon-wrapper">
              <Users size={48} />
            </div>
            <h2>Không tìm thấy học viên</h2>
            <p>
              {filterText || filterPackage !== 'ALL' 
                ? 'Thử thay đổi bộ lọc tìm kiếm của bạn.' 
                : 'Bạn chưa được phân công học viên nào.'}
            </p>
          </div>
        ) : (
          <div className="learners-grid">
            {filteredLearners.map((learner) => (
              <div key={learner.id} className="learner-card glass-panel hover-effect">
                <div className="learner-card-header">
                  <div className="learner-avatar">
                    {learner.avatar ? (
                      <img src={learner.avatar} alt={learner.fullName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {learner.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="learner-identity">
                    <h3 className="learner-name">{learner.fullName}</h3>
                    <div className="learner-email">
                      <Mail size={14} />
                      <span>{learner.email}</span>
                    </div>
                  </div>
                  <div className={`status-badge status-${learner.subscription.status.toLowerCase()}`}>
                    {learner.subscription.status}
                  </div>
                </div>

                <div className="learner-card-body">
                  <div className="info-row">
                    <div className="info-label">
                      <GraduationCap size={16} />
                      <span>Gói đăng ký</span>
                    </div>
                    <span className="info-value font-medium text-primary-300">
                      {learner.subscription.packageName}
                    </span>
                  </div>

                  <div className="info-row">
                    <div className="info-label">
                      <Calendar size={16} />
                      <span>Thời hạn</span>
                    </div>
                    <div className="date-range">
                      <span>{formatDate(learner.subscription.startDate)}</span>
                      <span className="arrow">→</span>
                      <span>{formatDate(learner.subscription.endDate)}</span>
                    </div>
                  </div>

                  {learner.subscription.mentorHoursTotal > 0 && (
                    <div className="progress-section">
                      <div className="progress-label">
                        <span>Mentor Hours</span>
                        <span>
                          {learner.subscription.mentorHoursUsed} / {learner.subscription.mentorHoursTotal}h
                        </span>
                      </div>
                      <div className="progress-track">
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: `${Math.min(100, (learner.subscription.mentorHoursUsed / learner.subscription.mentorHoursTotal) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="learner-card-footer">
                  <button className="btn btn-primary w-full">Xem Chi Tiết</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
