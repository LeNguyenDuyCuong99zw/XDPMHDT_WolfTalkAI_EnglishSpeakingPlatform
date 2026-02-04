// src/presentation/pages/mentor/AssessmentPage/AssessmentPage.tsx
import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  User,
  ChevronRight,
  FileText,
  AlertCircle
} from 'lucide-react';
import './AssessmentPage.css';
import { learnerAssessmentAPI, SubmissionDTO, Assessment } from '../../../../services/learnerAssessmentAPI';
import { AssignAssessmentModal } from './components/AssignAssessmentModal';

export const AssessmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'assignments'>('submissions');
  const [submissions, setSubmissions] = useState<SubmissionDTO[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'submissions') {
        const data = await learnerAssessmentAPI.getSubmissions(filterStatus);
        setSubmissions(data);
      } else {
        const data = await learnerAssessmentAPI.getAllAssessments();
        setAssessments(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeClick = (submissionId: number) => {
    window.location.href = `/mentor/assessment/${submissionId}/grade`;
  };

  const handleAssignClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="assessment-page">
      {/* Header */}
      <header className="assessment-page__header glass-card">
        <div className="assessment-page__header-main">
          <div className="assessment-page__header-icon">
            <ClipboardList size={22} />
          </div>
          <div>
            <h1 className="assessment-page__title">Assessments</h1>
            <p className="assessment-page__subtitle">
              Manage learner assessments and grading.
            </p>
          </div>
        </div>

        <div className="assessment-page__actions">
          <div className="assessment-tabs">
            <button 
              className={`assessment-tab ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </button>
            <button 
              className={`assessment-tab ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              Assignments Library
            </button>
          </div>
        </div>
      </header>

      {/* Filters (Only for submissions) */}
      {activeTab === 'submissions' && (
        <div className="filters-bar glass-card">
          <div className="search-wrapper">
            <Search size={18} />
            <input type="text" placeholder="Search learner..." />
          </div>
          <div className="filter-wrapper">
            <Filter size={18} />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="GRADED">Graded</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="assessment-page__content">
        {loading ? (
           <div className="loading-state glass-card">Loading...</div>
        ) : activeTab === 'submissions' ? (
          <div className="submissions-list">
            {submissions.length === 0 ? (
              <div className="empty-state glass-card">
                <CheckCircle2 size={48} className="text-gray-400 mb-4" />
                <h3>No submissions found</h3>
                <p>Wait for learners to submit their assessments.</p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.attemptId} className="submission-card glass-card hover-effect" onClick={() => handleGradeClick(sub.attemptId)}>
                  <div className="submission-header">
                    <div className="learner-info">
                      <div className="avatar-placeholder">
                        <User size={20} />
                      </div>
                      <div>
                        <h4>{sub.learnerName}</h4>
                        <span className="email">{sub.learnerEmail}</span>
                      </div>
                    </div>
                    <div className={`status-badge ${sub.status.toLowerCase()}`}>
                      {sub.status}
                    </div>
                  </div>
                  
                  <div className="submission-details">
                    <div className="detail-item">
                      <FileText size={16} />
                      <span>{sub.assessmentTitle}</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="submission-footer">
                    <div className="score-info">
                      {sub.status === 'GRADED' ? (
                        <span className="grade-result">Result: {sub.totalAnswered}/{sub.totalQuestions}</span>
                      ) : (
                        <span className="waiting-grade">Needs Grading</span>
                      )}
                    </div>
                    <ChevronRight size={20} className="arrow-icon" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="assessments-list">
             {assessments.map((assessment) => (
               <div key={assessment.id} className="assessment-item glass-card">
                 <div className="assessment-info">
                   <h3>{assessment.title}</h3>
                   <p>{assessment.level} • {assessment.durationMinutes} mins</p>
                 </div>
                 <button 
                   className="btn btn-primary btn-sm"
                   onClick={() => handleAssignClick(assessment)}
                 >
                   Assign to Learner
                 </button>
               </div>
             ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {selectedAssessment && (
        <AssignAssessmentModal 
          isOpen={isAssignModalOpen} 
          onClose={() => setIsAssignModalOpen(false)}
          assessmentId={selectedAssessment.id}
          assessmentTitle={selectedAssessment.title}
        />
      )}
    </div>
  );
};
