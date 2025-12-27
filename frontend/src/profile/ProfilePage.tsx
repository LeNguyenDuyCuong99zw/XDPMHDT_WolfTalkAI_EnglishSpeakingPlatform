import React, { useState, useRef } from 'react';
import './ProfilePage.css';

const defaultAvatar = "/images/avatar-placeholder.png";

const countryOptions = [
  "Vietnamese",
  "English",
  "Japanese",
  "Korean",
  "Chinese"
];

const goalOptions = [
  "Professional Fluency",
  "Conversational",
  "Travel",
  "Exam Preparation"
];

const ProfilePage: React.FC = () => {
  const [avatar, setAvatar] = useState<string>(defaultAvatar);
  const [firstName, setFirstName] = useState<string>(() => localStorage.getItem('firstName') || "Van A");
  const [lastName, setLastName] = useState<string>(() => localStorage.getItem('lastName') || "Nguyen");
  const [email, setEmail] = useState<string>("nguyen.vana@example.com");
  const [nativeLanguage, setNativeLanguage] = useState<string>(countryOptions[0]);
  const [learningGoal, setLearningGoal] = useState<string>(goalOptions[0]);
  const [dailyCommitment, setDailyCommitment] = useState<number>(30);
  const [coachPersona, setCoachPersona] = useState<string>('friendly');
  const [twoFactor, setTwoFactor] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    // Save logic: in real app, call API here
    alert(`Saved!\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}\nNative Language: ${nativeLanguage}\nLearning Goal: ${learningGoal}\nDaily Commitment: ${dailyCommitment} mins/day`);
  };

  return (
    <div className="profile-main-only">
      <div className="profile-content-wrapper">
        {/* Header Section */}
        <div className="profile-header">
          <div>
            <h1 className="profile-header-title">Hồ Sơ Cá Nhân</h1>
            <div className="profile-header-sub">Manage your profile details and preferences</div>
          </div>
          <div className="profile-header-actions">
            <button className="btn-cancel" type="button">Cancel</button>
            <button className="btn-save" type="submit" onClick={handleSave}>Save Changes</button>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="profile-summary-card">
          <div className="profile-summary-avatar" onClick={() => fileInputRef.current?.click()} style={{cursor:'pointer'}}>
            <img src={avatar} alt="Avatar" />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
            <div className="profile-summary-edit" title="Edit Avatar">
              <span role="img" aria-label="edit">✏️</span>
            </div>
          </div>
          <div className="profile-summary-main">
            <div className="profile-summary-name">{firstName} {lastName}</div>
            <div className="profile-summary-badges">
              <span className="badge-intermediate">Intermediate</span>
              <span className="badge-level">Level 4</span>
            </div>
          </div>
          <div className="profile-summary-stats">
            <div className="profile-summary-stat">
              <div className="profile-summary-stat-number">42</div>
              <div className="profile-summary-stat-label">Streak</div>
            </div>
            <div className="profile-summary-stat">
              <div className="profile-summary-stat-number">150</div>
              <div className="profile-summary-stat-label">Words</div>
            </div>
            <div className="profile-summary-stat">
              <div className="profile-summary-stat-number">12h</div>
              <div className="profile-summary-stat-label">Hours</div>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="profile-form-section">
          <div className="profile-form-grid">
            <div className="profile-form-group">
              <label className="profile-form-label">First Name</label>
              <input className="profile-form-input" type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} />
            </div>
            <div className="profile-form-group">
              <label className="profile-form-label">Last Name</label>
              <input className="profile-form-input" type="text" value={lastName} onChange={e=>setLastName(e.target.value)} />
            </div>
            <div className="profile-form-group" style={{gridColumn: '1/3'}}>
              <label className="profile-form-label">Email Address</label>
              <div className="profile-form-icon-input">
                <span className="profile-form-icon" role="img" aria-label="email">✉️</span>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
            </div>
            <div className="profile-form-group">
              <label className="profile-form-label">Native Language</label>
              <select className="profile-form-input" value={nativeLanguage} onChange={e=>setNativeLanguage(e.target.value)}>
                {countryOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="profile-form-group">
              <label className="profile-form-label">Learning Goal</label>
              <select className="profile-form-input" value={learningGoal} onChange={e=>setLearningGoal(e.target.value)}>
                {goalOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="profile-preferences-section">
          {/* Daily Commitment */}
          <div className="profile-preference-card">
            <div className="profile-preference-title"><span className="profile-preference-icon" style={{color:'#f59e42'}}>⏰</span> Daily Commitment</div>
            <div className="profile-commitment-value">{dailyCommitment} mins/day</div>
            <div className="profile-commitment-slider">
              <span>Casual</span>
              <input
                type="range"
                min={10}
                max={120}
                step={5}
                value={dailyCommitment}
                onChange={e => setDailyCommitment(Number(e.target.value))}
              />
              <span>Intense</span>
            </div>
            <div className="profile-commitment-labels">
              <span>Casual</span>
              <span style={{color:'#22C55E', fontWeight:600}}>Regular</span>
              <span>Intense</span>
            </div>
          </div>
          {/* Coach Persona */}
          <div className="profile-preference-card">
            <div className="profile-preference-title"><span className="profile-preference-icon" style={{color:'#a78bfa'}}>😊</span> Coach Persona</div>
            <div className="profile-coach-options">
              <div className={coachPersona === 'friendly' ? 'profile-coach-option selected' : 'profile-coach-option'} onClick={() => setCoachPersona('friendly')}>
                <span className="coach-check">{coachPersona === 'friendly' && '✔️'}</span>
                <div>
                  <strong>Friendly Guide</strong>
                  <p>Encouraging, celebrates small wins.</p>
                </div>
              </div>
              <div className={coachPersona === 'strict' ? 'profile-coach-option selected' : 'profile-coach-option'} onClick={() => setCoachPersona('strict')}>
                <span className="coach-check">{coachPersona === 'strict' && '✔️'}</span>
                <div>
                  <strong>Strict Teacher</strong>
                  <p>Focuses on accuracy and discipline.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account & Security */}
        <div className="profile-security-section">
          <div className="profile-security-row">
            <div>
              <div className="profile-security-label">Change Password</div>
              <div className="profile-security-desc">Last changed 3 months ago</div>
            </div>
            <button className="profile-security-link">Update</button>
          </div>
          <div className="profile-security-row">
            <div>
              <div className="profile-security-label">Two-Factor Authentication</div>
              <div className="profile-security-desc">Add a new layer of security</div>
            </div>
            <div className={twoFactor ? 'profile-security-toggle on' : 'profile-security-toggle'} onClick={()=>setTwoFactor(!twoFactor)}>
              <div className="profile-security-toggle-knob"></div>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="profile-progress-section">
          <div className="profile-progress-header">
            <div className="profile-progress-title">Weekly Progress</div>
            <select className="profile-progress-dropdown" defaultValue="Last 7 days">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="profile-progress-chart">
            {/* Example data, you can replace with real progress */}
            {(() => {
              const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
              const todayIdx = (new Date().getDay() + 6) % 7; // 0=Sun->6, 1=Mon->0, ...
              return days.map((day, idx) => (
                <div
                  key={day}
                  className={idx === todayIdx ? 'profile-progress-bar today' : 'profile-progress-bar'}
                  style={{height: idx === todayIdx ? 180 : 80+idx*10}}
                >
                  {idx === todayIdx && <div className="profile-progress-bar-label">Today</div>}
                  <div className="profile-progress-bar-day">{day}</div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
