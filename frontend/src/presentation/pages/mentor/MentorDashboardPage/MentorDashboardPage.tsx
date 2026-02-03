// src/presentation/pages/mentor/MentorDashboardPage/MentorDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getMentorLearners, getMentorStats, MentorLearner, MentorStats } from '../../../../services/mentorService';
import {
  BookOpen,
  Users,
  ClipboardList,
  Activity,
  TrendingUp,
  LineChart,
  BarChart3,
  Filter,
} from 'lucide-react';
import './MentorDashboardPage.css';

export const MentorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [learners, setLearners] = useState<MentorLearner[]>([]);
  const [stats, setStats] = useState<MentorStats | null>(null);
  const [packageFilter, setPackageFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount and when filter changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [learnersData, statsData] = await Promise.all([
          getMentorLearners(packageFilter),
          getMentorStats(),
        ]);
        // Ensure learnersData is always an array
        setLearners(Array.isArray(learnersData) ? learnersData : []);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching mentor data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        // Set empty array on error
        setLearners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [packageFilter]);

  // Calculate active learners (those with recent activity)
  const activeLearners = learners.filter(l => {
    if (!l.lastActivity) return false;
    const lastActivity = new Date(l.lastActivity);
    const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceActivity <= 7; // Active in last 7 days
  }).length;

  // Calculate pending assessments
  const pendingAssessments = learners.reduce((sum, l) => sum + (l.assignedTests - l.completedTests), 0);

  // Calculate total materials shared (placeholder)
  const materialsShared = learners.length * 2; // Placeholder calculation


  if (isLoading) {
    return (
      <div className="mentor-dashboard">
        <div className="mentor-dashboard__loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mentor-dashboard">
        <div className="mentor-dashboard__error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-dashboard">
      {/* Header */}
      <header className="mentor-dashboard__header glass-card">
        <div className="mentor-dashboard__header-main">
          <h1 className="mentor-dashboard__title">
            Dashboard Welcome, {user?.fullName}!
          </h1>
          <p className="mentor-dashboard__subtitle">
            Quick overview of your learners, assessments, and activity.
          </p>
        </div>
        <div className="mentor-dashboard__badge">
          <span className="mentor-dashboard__badge-dot" />
          Mentor
        </div>
      </header>

      {/* Overview row */}
      <section className="mentor-dashboard__overview glass-card">
        <div className="mentor-dashboard__overview-header">
          <div>
            <h2 className="mentor-dashboard__overview-title">Dashboard overview</h2>
            <p className="mentor-dashboard__overview-subtitle">
              Monitor learners, assessments, and engagement at a glance.
            </p>
          </div>
          <div className="mentor-dashboard__overview-pill">
            <TrendingUp size={16} />
            Last 30 days
          </div>
        </div>

        <div className="mentor-dashboard__overview-grid">
          <div className="mentor-dashboard__overview-card">
            <div className="mentor-dashboard__overview-icon mentor-dashboard__overview-icon--primary">
              <Users size={20} />
            </div>
            <p className="mentor-dashboard__overview-label">Total learners</p>
            <p className="mentor-dashboard__overview-value">{stats?.totalLearners || 0}</p>
            <p className="mentor-dashboard__overview-trend mentor-dashboard__overview-trend--neutral">
              {stats?.professionalCount || 0} Professional, {stats?.premiumCount || 0} Premium
            </p>
          </div>

          <div className="mentor-dashboard__overview-card">
            <div className="mentor-dashboard__overview-icon mentor-dashboard__overview-icon--accent">
              <ClipboardList size={20} />
            </div>
            <p className="mentor-dashboard__overview-label">Active assessments</p>
            <p className="mentor-dashboard__overview-value">{pendingAssessments}</p>
            <p className="mentor-dashboard__overview-trend mentor-dashboard__overview-trend--up">
              Pending completion
            </p>
          </div>

          <div className="mentor-dashboard__overview-card">
            <div className="mentor-dashboard__overview-icon mentor-dashboard__overview-icon--warning">
              <BookOpen size={20} />
            </div>
            <p className="mentor-dashboard__overview-label">Materials shared</p>
            <p className="mentor-dashboard__overview-value">{materialsShared}</p>
            <p className="mentor-dashboard__overview-trend mentor-dashboard__overview-trend--neutral">
              Across all learners
            </p>
          </div>

          <div className="mentor-dashboard__overview-card">
            <div className="mentor-dashboard__overview-icon mentor-dashboard__overview-icon--success">
              <Activity size={20} />
            </div>
            <p className="mentor-dashboard__overview-label">Active learners</p>
            <p className="mentor-dashboard__overview-value">{activeLearners}</p>
            <p className="mentor-dashboard__overview-trend mentor-dashboard__overview-trend--up">
              Active this week
            </p>
          </div>
        </div>
      </section>

      {/* Learners Section */}
      <section className="mentor-dashboard__learners glass-card">
        <div className="mentor-dashboard__learners-header">
          <h2 className="mentor-dashboard__section-title">Assigned Learners</h2>
          <div className="mentor-dashboard__filter">
            <Filter size={16} />
            <select 
              value={packageFilter} 
              onChange={(e) => setPackageFilter(e.target.value)}
              className="mentor-dashboard__filter-select"
            >
              <option value="ALL">All Packages</option>
              <option value="PROFESSIONAL">Professional Only</option>
              <option value="PREMIUM">Premium Only</option>
            </select>
          </div>
        </div>

        {learners.length === 0 ? (
          <div className="mentor-dashboard__empty">
            <p>No learners found with the selected filter.</p>
          </div>
        ) : (
          <div className="mentor-dashboard__learners-table">
            <table>
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Package</th>
                  <th>Mentor Hours</th>
                  <th>Tests</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {learners.map((learner) => (
                  <tr key={learner.id}>
                    <td>
                      <div className="learner-info">
                        <div className="learner-avatar">
                          {learner.avatar ? (
                            <img src={learner.avatar} alt={learner.fullName} />
                          ) : (
                            <div className="learner-avatar-placeholder">
                              {learner.fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="learner-name">{learner.fullName}</div>
                          <div className="learner-email">{learner.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`package-badge package-badge--${learner.subscription.packageCode.toLowerCase()}`}>
                        {learner.subscription.packageName}
                      </span>
                    </td>
                    <td>
                      <div className="mentor-hours">
                        <div className="mentor-hours-bar">
                          <div 
                            className="mentor-hours-progress"
                            style={{ 
                              width: `${(learner.subscription.mentorHoursUsed / learner.subscription.mentorHoursTotal) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="mentor-hours-text">
                          {learner.subscription.mentorHoursUsed}/{learner.subscription.mentorHoursTotal}h
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="test-count">
                        {learner.completedTests}/{learner.assignedTests}
                      </span>
                    </td>
                    <td>
                      <span className="last-activity">
                        {learner.lastActivity 
                          ? new Date(learner.lastActivity).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-action btn-action--primary">
                        Assign Test
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Charts row */}
      <section className="mentor-dashboard__charts">
        <div className="glass-card mentor-dashboard__chart mentor-dashboard__chart--wide">
          <div className="mentor-dashboard__chart-header">
            <div className="mentor-dashboard__chart-title-wrap">
              <LineChart size={18} />
              <div>
                <h2 className="mentor-dashboard__chart-title">
                  Learner engagement trend
                </h2>
                <p className="mentor-dashboard__chart-subtitle">
                  Last 6 weeks · Check-ins & assessments completed.
                </p>
              </div>
            </div>
          </div>
          <div className="mentor-dashboard__chart-placeholder mentor-dashboard__chart-placeholder--line" />
        </div>

        <div className="glass-card mentor-dashboard__chart">
          <div className="mentor-dashboard__chart-header">
            <div className="mentor-dashboard__chart-title-wrap">
              <BarChart3 size={18} />
              <div>
                <h2 className="mentor-dashboard__chart-title">
                  Assessments by status
                </h2>
                <p className="mentor-dashboard__chart-subtitle">
                  Draft, scheduled, and completed assessments.
                </p>
              </div>
            </div>
          </div>
          <div className="mentor-dashboard__chart-placeholder mentor-dashboard__chart-placeholder--bar" />
        </div>
      </section>
    </div>
  );
};
