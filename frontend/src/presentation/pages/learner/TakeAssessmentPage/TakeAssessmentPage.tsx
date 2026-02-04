// src/presentation/pages/learner/TakeAssessmentPage/TakeAssessmentPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  HelpCircle,
  Upload,
  Mic,
  Video,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { learnerAssessmentAPI, AssessmentQuestion } from '../../../../services/learnerAssessmentAPI';
import './TakeAssessmentPage.css';

export const TakeAssessmentPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(60 * 60); // 60 mins default

  useEffect(() => {
    if (assessmentId) {
      startAssessmentFlow(parseInt(assessmentId));
    }
  }, [assessmentId]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startAssessmentFlow = async (id: number) => {
    try {
      setLoading(true);
      // 1. Start attempt API
      const startRes = await learnerAssessmentAPI.startAssessment(id);
      setAttemptId(startRes.attemptId);
      
      // 2. Fetch questions
      const qData = await learnerAssessmentAPI.getAssessmentQuestions(id);
      setQuestions(qData);
    } catch (error) {
      console.error("Error starting assessment:", error);
      alert("Could not start assessment. Please try again.");
      navigate('/learner/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSaveAnswer = async (questionId: number) => {
    if (!attemptId) return;
    const answerText = answers[questionId];
    if (!answerText) return;

    try {
      await learnerAssessmentAPI.saveAnswer(attemptId, questionId, answerText);
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, questionId: number, type: 'video' | 'audio') => {
    if (!attemptId || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    try {
      await learnerAssessmentAPI.uploadFile(attemptId, questionId, file, type);
      alert(`${type} uploaded successfully!`);
      // Update local answer state to show uploaded status
      setAnswers(prev => ({ ...prev, [questionId]: `[UPLOADED_${type.toUpperCase()}]` }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed.");
    }
  };

  const handleSubmitAssessment = async () => {
    if (!attemptId) return;
    if (!confirm("Are you sure you want to submit? You cannot change your answers after submission.")) return;

    setSubmitting(true);
    try {
      await learnerAssessmentAPI.submitAssessment(attemptId);
      navigate(`/learner/assessment/${attemptId}/result`);
    } catch (error) {
      console.error("Err submission:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    // Auto-save current answer
    const currentQ = questions[currentQuestionIndex];
    handleSaveAnswer(currentQ.id);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) return <div className="loading-screen">Starting assessment...</div>;

  const currentQ = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="take-assessment-page">
      <header className="assessment-header">
        <button className="exit-btn" onClick={() => navigate('/learner/dashboard')}>
          <ArrowLeft size={20} /> Exit
        </button>
        <div className="timer-badge">
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
        <button 
           className="submit-btn" 
           onClick={handleSubmitAssessment}
           disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </header>

      <div className="assessment-main-layout">
        {/* Sidebar Question Nav */}
        <aside className="question-nav glass-card">
          <h3>Questions</h3>
          <div className="questions-grid">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                className={`q-nav-btn ${idx === currentQuestionIndex ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestionIndex(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Question Area */}
        <main className="question-area glass-card">
          {currentQ && (
            <>
              <div className="question-header-content">
                 <span className="q-tag">{currentQ.questionType}</span>
                 <span className="q-tag section">{currentQ.section}</span>
                 <span className="q-idx">Question {currentQuestionIndex + 1} of {questions.length}</span>
              </div>

              {currentQ.readingPassage && (
                <div className="reading-passage">
                  <h4>Reading Passage</h4>
                  <p>{currentQ.readingPassage}</p>
                </div>
              )}

              <h2 className="question-text">{currentQ.questionText}</h2>

              <div className="answer-section">
                {currentQ.questionType === 'MULTIPLE_CHOICE' && currentQ.options && (
                  <div className="options-list">
                    {currentQ.options.map(opt => (
                      <label key={opt.id} className={`option-label ${answers[currentQ.id] === opt.optionText ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name={`q-${currentQ.id}`}
                          value={opt.optionText}
                          checked={answers[currentQ.id] === opt.optionText}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        />
                        <span className="radio-circle"></span>
                        <span className="option-text">{opt.optionText}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQ.questionType === 'ESSAY' && (
                  <textarea
                    className="essay-input"
                    placeholder="Type your answer here..."
                    rows={10}
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    onBlur={() => handleSaveAnswer(currentQ.id)}
                  />
                )}

                {(currentQ.questionType === 'SPEAKING' || currentQ.questionType === 'PRONUNCIATION') && (
                  <div className="upload-section">
                    <p className="upload-hint">
                      Please record your answer and upload the {currentQ.questionType === 'SPEAKING' ? 'video' : 'audio'} file.
                    </p>
                    <div className="upload-buttons">
                      <label className="upload-btn">
                        <Video size={20} />
                        Upload Video
                        <input 
                           type="file" 
                           accept="video/*" 
                           hidden 
                           onChange={(e) => handleFileUpload(e, currentQ.id, 'video')}
                        />
                      </label>
                      <label className="upload-btn secondary">
                        <Mic size={20} />
                         Upload Audio
                        <input 
                           type="file" 
                           accept="audio/*" 
                           hidden
                           onChange={(e) => handleFileUpload(e, currentQ.id, 'audio')}
                        />
                      </label>
                    </div>
                    {answers[currentQ.id] && answers[currentQ.id].includes('UPLOADED') && (
                      <div className="upload-success">
                        <CheckCircle size={16} /> File uploaded successfully
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="nav-footer">
                <button 
                  className="nav-btn prev" 
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft size={20} /> Previous
                </button>
                <button 
                  className="nav-btn next" 
                  onClick={nextQuestion}
                >
                  {isLastQuestion ? 'Review' : 'Next'} <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
