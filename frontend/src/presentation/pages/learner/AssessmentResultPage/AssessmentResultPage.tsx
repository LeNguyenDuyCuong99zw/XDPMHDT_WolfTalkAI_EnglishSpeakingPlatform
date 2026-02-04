// src/presentation/pages/learner/AssessmentResultPage/AssessmentResultPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowLeft,
  Award,
  BarChart2
} from 'lucide-react';
import { learnerAssessmentAPI, AssessmentResultDTO } from '../../../../services/learnerAssessmentAPI';
import './AssessmentResultPage.css';

export const AssessmentResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResultDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attemptId) {
      fetchResult(parseInt(attemptId));
    }
  }, [attemptId]);

  const fetchResult = async (id: number) => {
    try {
      setLoading(true);
      const data = await learnerAssessmentAPI.getResult(id);
      setResult(data);
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="result-loading">Loading result...</div>;
  if (!result) return <div className="result-error">Result not found.</div>;

  const isPassed = (result.totalScore || 0) >= 50; // Example pass threshold

  return (
    <div className="result-page">
      <div className="result-card glass-card">
        <div className="result-header">
          {isPassed ? (
            <div className="icon-wrapper success">
              <Award size={48} />
            </div>
          ) : (
            <div className="icon-wrapper fail">
              <BarChart2 size={48} />
            </div>
          )}
          <h1>Assessment Completed!</h1>
          <p>Here is how you performed on <strong>{result.assessmentTitle}</strong></p>
        </div>

        <div className="score-summary">
          <div className="score-main">
            <span className="score-value">{result.totalScore}</span>
            <span className="score-total">/ 10</span>
          </div>
          <div className="level-badge">{result.levelResult}</div>
        </div>

        <div className="feedback-section">
          <h3>Feedback</h3>
          <p>{result.overallFeedback || "Great effort! Keep practicing to improve your score."}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="label">Time Spent</span>
            <span className="value">{result.timeSpentMinutes} min</span>
          </div>
          <div className="stat-item">
             <span className="label">Completion Date</span>
             <span className="value">{new Date(result.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="breakdown-section">
           <h3>Section Breakdown</h3>
           <div className="breakdown-list">
             {result.breakdown && Object.entries(result.breakdown).map(([section, data]) => (
               <div key={section} className="breakdown-item">
                 <span>{section}</span>
                 <span className="section-score">{data.score} / {data.maxScore} pts</span>
               </div>
             ))}
           </div>
        </div>

        <div className="action-footer">
          <button className="back-btn" onClick={() => navigate('/learner/dashboard')}>
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
