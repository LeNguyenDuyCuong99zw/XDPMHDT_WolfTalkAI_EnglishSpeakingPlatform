import React from 'react';
import Sidebar from '../components/Sidebar';
import FluencyCard from './FluencyCard';
import WeakAreasCard from './WeakAreasCard';
import StatsCard from './StatsCard';
import SkillBalanceCard from './SkillBalanceCard';
import TravelGoalCard from './TravelGoalCard';
import './ProgressPage.css';

const ProgressPage: React.FC = () => {
  // Dữ liệu mẫu
  const fluencyData = [
    { month: 'Apr', value: 300 },
    { month: 'May', value: 400 },
    { month: 'Jun', value: 500 },
    { month: 'Jul', value: 650 },
    { month: 'Aug', value: 740 },
    { month: 'Sep', value: 840 },
  ];
  const weakAreas = [
    { title: 'Conditionals Type 2 & 3', label: 'Grammar', accuracy: '42% Accuracy' },
    { title: 'Business Vocabulary', label: 'Vocabulary', accuracy: '58% Accuracy' },
  ];
  const skills = [
    { name: 'Listening', value: '85/100' },
    { name: 'Speaking', value: '62/100', bad: true },
    { name: 'Reading', value: '90/100' },
    { name: 'Writing', value: '74/100' },
  ];
  return (
    <div className="progress-main">
      <Sidebar />
      <main className="progress-content">
        <div className="progress-header-row">
          <div>
            <h1 className="progress-title">Progress Tracking</h1>
            <div className="progress-desc">Analyze your learning journey, track fluency improvements, and overcome weak areas.</div>
          </div>
          <div className="progress-header-actions">
            <button className="progress-btn-switch active">Weekly</button>
            <button className="progress-btn-switch">Monthly</button>
            <button className="progress-btn-export">Export Report</button>
          </div>
        </div>
        <div className="progress-ai-prediction">
          <div className="progress-ai-badge">AI Coach Prediction <span className="beta">BETA</span></div>
          <div className="progress-ai-desc">Keep it up! Based on your current pace of <b>45 mins/day</b>, you are projected to reach <b>Level B1</b> by <b>October 15th</b>. That's 2 weeks ahead of schedule!</div>
          <button className="progress-btn-goal">Adjust Goals</button>
        </div>
        <div className="progress-main-row">
          <div className="progress-main-left">
            <FluencyCard data={fluencyData} />
            <WeakAreasCard areas={weakAreas} />
            <TravelGoalCard />
          </div>
          <div className="progress-main-right">
            <StatsCard streak={14} time="42h 15m" words={1240} />
            <SkillBalanceCard skills={skills} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
