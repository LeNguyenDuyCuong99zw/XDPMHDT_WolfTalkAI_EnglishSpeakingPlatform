// src/presentation/pages/learner/LearnerDashboardPage/LearnerDashboardPage.tsx
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  BookOpen,
  Trophy,
  Clock,
  Zap,
  Flame,
  Target,
  BarChart3,
  Calendar,
  ArrowRight
} from 'lucide-react';
import './LearnerDashboardPage.css';

export const LearnerDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="learner-dashboard1">
      {/* Header */}
      <header className="learner-dashboard__header1 glass-card1">
        <div className="learner-dashboard__header-main1">
          <h1 className="learner-dashboard__title1">
            Welcome back, {user?.fullName || 'Learner'}! 👋
          </h1>
          <p className="learner-dashboard__subtitle1">
            Keep up the momentum! You're making great progress today.
          </p>
        </div>
        
        {/* Quick Level Status */}
        <div className="learner-dashboard__level-badge1">
          <div className="level-ring1">
            <span className="level-number1">B1</span>
          </div>
          <div className="level-info1">
            <span className="level-label1">Current Level</span>
            <span className="level-xp1">Intermediate</span>
          </div>
        </div>
      </header>

      {/* Main Stats Row */}
      <section className="learner-dashboard__stats-grid1">
        <div className="glass-card1 stat-card1 accent-purple1">
          <div className="stat-icon1">
            <Flame size={24} />
          </div>
          <div className="stat-content1">
            <p className="stat-label1">Day Streak</p>
            <h3 className="stat-value1">5 Days</h3>
            <p className="stat-trend1 increasing1">+2 from last week</p>
          </div>
        </div>

        <div className="glass-card1 stat-card1 accent-blue1">
          <div className="stat-icon1">
            <Clock size={24} />
          </div>
          <div className="stat-content1">
            <p className="stat-label1">Learning Time</p>
            <h3 className="stat-value1">12.5h</h3>
            <p className="stat-trend1 increasing1">Top 10% learners</p>
          </div>
        </div>

        <div className="glass-card1 stat-card1 accent-green1">
          <div className="stat-icon1">
            <Trophy size={24} />
          </div>
          <div className="stat-content1">
            <p className="stat-label1">XP Earned</p>
            <h3 className="stat-value1">2,450</h3>
            <p className="stat-trend1 neutral1">On track</p>
          </div>
        </div>

        <div className="glass-card1 stat-card1 accent-orange1">
          <div className="stat-icon1">
            <BookOpen size={24} />
          </div>
          <div className="stat-content1">
            <p className="stat-label1">Words Learned</p>
            <h3 className="stat-value1">142</h3>
            <p className="stat-trend1 increasing1">New milestone!</p>
          </div>
        </div>
      </section>

      <div className="learner-dashboard__main-content1">
        {/* Left Column */}
        <div className="learner-dashboard__content-left1">
          
          {/* Next Lesson Card */}
          <section className="glass-card1 next-lesson-card1">
            <div className="card-header1">
              <div className="header-icon1">
                <Zap size={20} />
              </div>
              <div>
                <h3>Continue Learning</h3>
                <p>Pick up where you left off</p>
              </div>
              <button className="btn-continue1">
                Resume <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="lesson-progress-info1">
              <div className="lesson-details1">
                <span className="lesson-tag1">Unit 4 • Vocabulary</span>
                <h4>Travel & Airport Essentials</h4>
                <div className="progress-bar-container1">
                  <div className="progress-bar1" style={{ width: '65%' }}></div>
                </div>
                <span className="progress-text1">65% Completed</span>
              </div>
            </div>
          </section>

          {/* Recent Activity / Recommendations */}
          <section className="glass-card1 recent-activity1">
            <div className="section-header1">
              <h3><Target size={20} /> Recommended for you</h3>
              <a href="#" className="view-all1">View all</a>
            </div>
            
            <div className="activity-list1">
              <div className="activity-item1">
                <div className="activity-icon1 bg-blue-100 text-blue-600">
                  <BookOpen size={18} />
                </div>
                <div className="activity-info1">
                  <h4>Daily Conversation Practice</h4>
                  <p>Speak for 5 mins about your day</p>
                </div>
                <button className="btn-action1">Start</button>
              </div>

              <div className="activity-item1">
                <div className="activity-icon1 bg-purple-100 text-purple-600">
                  <Trophy size={18} />
                </div>
                <div className="activity-info1">
                  <h4>Weekly Quiz Challenge</h4>
                  <p>Test your knowledge from Unit 3</p>
                </div>
                <button className="btn-action1">Start</button>
              </div>
            </div>
          </section>

          {/* Learning Chart Placeholder */}
          <section className="glass-card1 learning-chart1">
            <div className="section-header1">
              <h3><BarChart3 size={20} /> Learning Activity</h3>
              <select className="chart-select1">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="chart-placeholder1">
              {/* Placeholder for a chart library like Recharts */}
              <div className="chart-bars1">
                {[40, 65, 30, 85, 50, 70, 45].map((height, i) => (
                  <div key={i} className="chart-bar-col1">
                    <div className="chart-bar1" style={{ height: `${height}%` }}></div>
                    <span className="chart-label1">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="learner-dashboard__content-right1">
          
          {/* Upcoming Sessions */}
          <section className="glass-card1 upcoming-sessions1">
            <div className="section-header1">
              <h3><Calendar size={20} /> Upcoming Sessions</h3>
            </div>
            
            <div className="sessions-list1">
              <div className="session-card1">
                <div className="session-date1">
                  <span className="date-day1">12</span>
                  <span className="date-month1">OCT</span>
                </div>
                <div className="session-details1">
                  <h4>1-on-1 Mentoring</h4>
                  <p>with Sarah Wilson</p>
                  <span className="session-time1">10:00 AM - 11:00 AM</span>
                </div>
              </div>
              
               <div className="session-empty-state1">
                  <p>No more sessions scheduled.</p>
                  <button className="btn-text1">Book a session →</button>
               </div>
            </div>
          </section>

          {/* Leaderboard Mini */}
          <section className="glass-card1 leaderboard-mini1">
            <div className="section-header1">
              <h3><Trophy size={20} /> Leaderboard</h3>
              <span className="rank-badge1">#42</span>
            </div>
            
            <div className="leaderboard-list1">
              {[1, 2, 3].map((rank) => (
                <div key={rank} className="leaderboard-item1">
                  <span className={`rank1 rank-${rank}1`}>{rank}</span>
                  <div className="user-avatar-small1"></div>
                  <span className="user-name1">User {rank}</span>
                  <span className="user-xp1">{3000 - rank * 100} XP</span>
                </div>
              ))}
              <div className="leaderboard-divider1">...</div>
              <div className="leaderboard-item1 current-user1">
                <span className="rank1">42</span>
                <div className="user-avatar-small1"></div>
                <span className="user-name1">You</span>
                <span className="user-xp1">2450 XP</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
