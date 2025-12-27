import React from 'react';
import Sidebar from '../components/Sidebar';
import WelcomeHeader from './WelcomeHeader';
import VocabularyCard from './VocabularyCard';
import AiCoachCard from './AiCoachCard';
import DailyGoalsCard from './DailyGoalsCard';
import TravelCard from './TravelCard';
import WeakWordsCard from './WeakWordsCard';
import SkillBreakdownCard from './SkillBreakdownCard';
import SpeedChallengeCard from './SpeedChallengeCard';
import DidYouKnowCard from './DidYouKnowCard';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-main">
      <Sidebar />
      <main className="dashboard-content">
        <WelcomeHeader name={(localStorage.getItem('firstName') || 'Van A') + ' ' + (localStorage.getItem('lastName') || 'Nguyen')} />
        <div className="dashboard-row dashboard-row-top">
          <VocabularyCard />
          <AiCoachCard />
        </div>
        <div className="dashboard-row dashboard-row-mid">
          <DailyGoalsCard />
          <TravelCard />
          <WeakWordsCard />
        </div>
        <div className="dashboard-row dashboard-row-bottom">
          <SkillBreakdownCard />
          <SpeedChallengeCard />
          <DidYouKnowCard />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
