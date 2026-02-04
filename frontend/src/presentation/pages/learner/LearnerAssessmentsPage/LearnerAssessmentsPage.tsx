// src/presentation/pages/learner/LearnerAssessmentsPage/LearnerAssessmentsPage.tsx
import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  PlayCircle,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { learnerAssessmentAPI, LearnerAssessmentAssignment } from '../../../../services/learnerAssessmentAPI';
import './LearnerAssessmentsPage.css';

export const LearnerAssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<LearnerAssessmentAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const data = await learnerAssessmentAPI.getLearnerAssessments();
      setAssessments(data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = (assessment: LearnerAssessmentAssignment) => {
    if (assessment.status === 'ASSIGNED') {
      // Logic to show "Start" confirmation or directly go to take page
      // We'll navigate to take page which handles "Start" API call
      navigate(`/learner/assessment/${assessment.assessmentId}/take`);
    } else if (assessment.status === 'IN_PROGRESS') {
      // Continue
      navigate(`/learner/assessment/${assessment.assessmentId}/take`);
    } else if (assessment.status === 'GRADED') {
      // View result
      navigate(`/learner/assessment/${assessment.attemptId}/result`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ASSIGNED': return <span className="status-badge assigned">New</span>;
      case 'IN_PROGRESS': return <span className="status-badge progress">In Progress</span>;
      case 'SUBMITTED': return <span className="status-badge submitted">Under Review</span>;
      case 'GRADED': return <span className="status-badge graded">Graded</span>;
      default: return null;
    }
  };

  return (
    <div className="learner-assessments-page">
      <header className="page-header">
        <div className="header-icon">
          <BookOpen size={24} />
        </div>
        <div>
          <h1>My Assessments</h1>
          <p>Complete your assigned tasks to track your progress.</p>
        </div>
      </header>

      <div className="assessments-grid">
        {loading ? (
          <div className="loading-state">Loading your assessments...</div>
        ) : assessments.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={48} />
            <h3>All caught up!</h3>
            <p>You don't have any pending assessments.</p>
          </div>
        ) : (
          assessments.map((item) => (
            <div key={item.assignmentId} className="assessment-card glass-card">
              <div className="card-header">
                <div className="level-tag">{item.level}</div>
                {getStatusBadge(item.status)}
              </div>
              
              <div className="card-body">
                <h3 className="assessment-title">{item.title}</h3>
                <p className="assessment-desc">{item.description}</p>
                
                <div className="meta-info">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{item.durationMinutes} mins</span>
                  </div>
                  <div className="meta-item">
                    <FileText size={16} />
                    <span>{item.totalQuestions} Questions</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button 
                   className={`action-btn ${item.status === 'GRADED' ? 'secondary' : 'primary'}`}
                   onClick={() => handleStart(item)}
                   disabled={item.status === 'SUBMITTED'}
                >
                  {item.status === 'ASSIGNED' && <><PlayCircle size={18} /> Start Now</>}
                  {item.status === 'IN_PROGRESS' && <><PlayCircle size={18} /> Continue</>}
                  {item.status === 'SUBMITTED' && 'Waiting for Grade'}
                  {item.status === 'GRADED' && <><CheckCircle2 size={18} /> View Result</>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
