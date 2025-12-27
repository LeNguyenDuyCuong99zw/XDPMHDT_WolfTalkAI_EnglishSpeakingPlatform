import React from 'react';

const SkillBalanceCard: React.FC<{ skills: { name: string, value: string, bad?: boolean }[] }> = ({ skills }) => (
  <div className="progress-skill-balance-card">
    <div className="progress-skill-title">Skill Balance</div>
    <div className="progress-skill-list">
      {skills.map((s, idx) => (
        <div className="progress-skill-item" key={idx}>
          <span>{s.name}</span>
          <span className={s.bad ? 'progress-skill-bad' : ''}>{s.value}</span>
        </div>
      ))}
    </div>
    <div className="progress-skill-note">Your <b>Speaking</b> skill is lagging. Consider pronunciation exercises today.</div>
  </div>
);

export default SkillBalanceCard;
