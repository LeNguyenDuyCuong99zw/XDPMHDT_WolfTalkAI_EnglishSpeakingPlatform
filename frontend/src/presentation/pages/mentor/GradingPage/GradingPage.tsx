// src/presentation/pages/mentor/GradingPage/GradingPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  User, 
  FileText, 
  Video, 
  Mic, 
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { learnerAssessmentAPI, SubmissionDetailDTO, GradeSubmissionRequest } from '../../../../services/learnerAssessmentAPI';
import './GradingPage.css';

export const GradingPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState<SubmissionDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Grading state
  const [grades, setGrades] = useState<Record<number, { score: number; feedback: string }>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [levelResult, setLevelResult] = useState('B1'); // Default

  useEffect(() => {
    if (attemptId) {
      fetchSubmission(parseInt(attemptId));
    }
  }, [attemptId]);

  const fetchSubmission = async (id: number) => {
    try {
      setLoading(true);
      const data = await learnerAssessmentAPI.getSubmissionDetail(id);
      setSubmission(data);
      
      // Initialize grades state
      const initialGrades: Record<number, { score: number; feedback: string }> = {};
      data.answers.forEach(ans => {
        initialGrades[ans.answerId] = {
          score: ans.score || 0,
          feedback: ans.feedback || ''
        };
      });
      setGrades(initialGrades);
      
    } catch (error) {
      console.error("Error fetching submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (answerId: number, field: 'score' | 'feedback', value: any) => {
    setGrades(prev => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        [field]: value
      }
    }));
  };

  const calculateTotalScore = () => {
    // Simple sum or average logic - depends on requirement. 
    // Here we just let mentor input total score manually or auto-sum
    // Let's implementation auto-sum for convenience, but editable
    const sum = Object.values(grades).reduce((acc, curr) => acc + Number(curr.score), 0);
    setTotalScore(sum);
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    
    setSubmitting(true);
    try {
      const request: GradeSubmissionRequest = {
        answers: Object.entries(grades).map(([key, val]) => ({
          answerId: parseInt(key),
          score: val.score,
          feedback: val.feedback
        })),
        totalScore: totalScore,
        levelResult: levelResult
      };

      await learnerAssessmentAPI.gradeSubmission(parseInt(attemptId), request);
      alert('Grading submitted successfully!');
      navigate('/mentor/assessment');
    } catch (error) {
      console.error("Error submitting grades:", error);
      alert('Failed to submit grades');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading submission...</div>;
  if (!submission) return <div className="p-8 text-center">Submission not found</div>;

  return (
    <div className="grading-page">
      <header className="grading-header glass-card">
        <button className="back-btn" onClick={() => navigate('/mentor/assessment')}>
          <ChevronLeft size={20} />
          Back
        </button>
        <div className="header-info">
          <h1>Grading: {submission.assessment.title}</h1>
          <div className="learner-meta">
            <span className="learner-name">
              <User size={16} /> {submission.learner.name}
            </span>
            <span className="submitted-at">
              <Clock size={16} /> {new Date(submission.submittedAt).toLocaleString()}
            </span>
          </div>
        </div>
        <button 
          className="save-btn btn-primary" 
          onClick={handleSubmit}
          disabled={submitting}
        >
          <Save size={18} />
          {submitting ? 'Saving...' : 'Submit Grades'}
        </button>
      </header>

      <div className="grading-content">
        <div className="questions-column">
          {submission.answers.map((answer, index) => (
            <div key={answer.answerId} className="question-card glass-card">
              <div className="question-header">
                <span className="q-number">Q{index + 1}</span>
                <span className="q-type">{answer.questionType}</span>
                <span className="q-section">{answer.section}</span>
              </div>
              
              <div className="question-body">
                <p className="q-text">{answer.questionText}</p>
                
                <div className="learner-answer">
                  <h4>Learner's Answer:</h4>
                  {answer.questionType === 'MULTIPLE_CHOICE' && (
                     <div className={`mc-answer ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                       {answer.answerText}
                       {answer.isCorrect ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                     </div>
                  )}
                  
                  {answer.questionType === 'ESSAY' && (
                    <div className="essay-answer">{answer.answerText}</div>
                  )}

                  {(answer.questionType === 'SPEAKING' || answer.questionType === 'PRONUNCIATION') && answer.videoUrl && (
                    <div className="media-answer">
                      <video src={answer.videoUrl} controls className="video-player" />
                    </div>
                  )}
                   {(answer.questionType === 'SPEAKING' || answer.questionType === 'PRONUNCIATION') && answer.audioUrl && (
                    <div className="media-answer">
                      <audio src={answer.audioUrl} controls className="audio-player" />
                    </div>
                  )}
                </div>

                {answer.questionType === 'MULTIPLE_CHOICE' && !answer.isCorrect && (
                   <div className="correct-answer-hint">
                     Correct answer: <strong>{answer.correctAnswer}</strong>
                   </div>
                )}
              </div>

              <div className="grading-section">
                <div className="grade-input-group">
                  <label>Score (0-10)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="10"
                    value={grades[answer.answerId]?.score || 0}
                    onChange={(e) => handleGradeChange(answer.answerId, 'score', parseFloat(e.target.value))}
                  />
                </div>
                <div className="grade-input-group full-width">
                  <label>Feedback</label>
                  <input 
                    type="text" 
                    placeholder="Enter feedback..."
                    value={grades[answer.answerId]?.feedback || ''}
                    onChange={(e) => handleGradeChange(answer.answerId, 'feedback', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="summary-column">
          <div className="summary-card glass-card sticky-card">
            <h3>Assessment Summary</h3>
            
            <div className="summary-form">
              <div className="form-group">
                <label>Total Score</label>
                <div className="score-calculator">
                   <input 
                      type="number" 
                      value={totalScore} 
                      onChange={(e) => setTotalScore(parseFloat(e.target.value))}
                   />
                   <button className="calc-btn" onClick={calculateTotalScore}>
                     Recalculate
                   </button>
                </div>
              </div>

              <div className="form-group">
                <label>Proficiency Level</label>
                <select 
                  value={levelResult} 
                  onChange={(e) => setLevelResult(e.target.value)}
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficient</option>
                </select>
              </div>

              <div className="summary-stats">
                 <div className="stat-row">
                   <span>Questions</span>
                   <span>{submission.answers.length}</span>
                 </div>
                 <div className="stat-row">
                   <span>Time Spent</span>
                   <span>{submission.timeSpentMinutes} min</span>
                 </div>
              </div>
            </div>

            <button 
              className="submit-all-btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Complete Grading'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
