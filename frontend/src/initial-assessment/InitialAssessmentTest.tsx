import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type {
  InitialAssessmentQuestion,
  InitialAssessmentDTO,
} from "../services/initialAssessmentAPI";
import { initialAssessmentAPI } from "../services/initialAssessmentAPI";
import "./InitialAssessmentTest.css";

const InitialAssessmentTest: React.FC = () => {
  const navigate = useNavigate();
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<InitialAssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<InitialAssessmentDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start test on component mount
  useEffect(() => {
    startTest();
  }, []);

  const startTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const assessment = await initialAssessmentAPI.startTest();
      setAssessmentId(assessment.id);

      // Get questions
      const qs = await initialAssessmentAPI.getQuestions(assessment.id);
      setQuestions(qs);
    } catch (err: any) {
      setError(err.message || "Failed to start test");
      console.error("Error starting test:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    if (!assessmentId) return;

    try {
      setLoading(true);
      const question = questions[currentQuestionIndex];

      // Submit answer
      await initialAssessmentAPI.submitAnswer({
        assessmentId,
        questionId: question.id,
        answer,
      });

      // Move to next question or complete
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        completeTest();
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit answer");
      console.error("Error submitting answer:", err);
    } finally {
      setLoading(false);
    }
  };

  const completeTest = async () => {
    if (!assessmentId) return;

    try {
      setLoading(true);
      const testResult = await initialAssessmentAPI.completeTest(assessmentId);
      setResult(testResult);
    } catch (err: any) {
      setError(err.message || "Failed to complete test");
      console.error("Error completing test:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !result) {
    return (
      <div className="initial-assessment-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="initial-assessment-container">
        <div className="error-card">
          <h2>⚠️ Lỗi</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/dashboard")}>
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return <ResultView result={result} navigate={navigate} />;
  }

  if (questions.length === 0) {
    return (
      <div className="initial-assessment-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang chuẩn bị câu hỏi...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="initial-assessment-container">
      <div className="test-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Quay lại
        </button>
        <h1>Bài Kiểm Tra Đánh Giá Trình Độ</h1>
        <div className="progress-info">
          <span>
            Câu {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="question-card">
        <QuestionView
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          onAnswer={submitAnswer}
          loading={loading}
        />
      </div>
    </div>
  );
};

// Question View Component
const QuestionView: React.FC<{
  question: InitialAssessmentQuestion;
  questionNumber: number;
  onAnswer: (answer: string) => void;
  loading: boolean;
}> = ({ question, questionNumber, onAnswer, loading }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  const getSkillEmoji = (skillType: string) => {
    switch (skillType) {
      case "LISTENING":
        return "👂";
      case "SPEAKING":
        return "🎤";
      case "WRITING":
        return "✍️";
      case "READING":
        return "📖";
      default:
        return "❓";
    }
  };

  return (
    <div className="question-view">
      <div className="skill-badge">
        {getSkillEmoji(question.skillType)} {question.skillType}
      </div>

      <h2 className="question-text">{question.questionText}</h2>

      {question.audioUrl && question.skillType === "LISTENING" && (
        <div className="audio-player">
          <audio controls>
            <source src={question.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {question.imageUrl && (
        <div className="image-display">
          <img src={question.imageUrl} alt="Question image" />
        </div>
      )}

      {question.answerFormat === "MULTIPLE_CHOICE" && question.options ? (
        <div className="options-grid">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                selectedAnswer === option ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer(option)}
              disabled={loading}
            >
              {option}
            </button>
          ))}
        </div>
      ) : question.answerFormat === "SPEAKING_RECORD" ? (
        <SpeakingRecorder onAnswer={onAnswer} disabled={loading} />
      ) : null}

      {question.answerFormat === "MULTIPLE_CHOICE" && (
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!selectedAnswer || loading}
        >
          {loading ? "Đang xử lý..." : "Tiếp tục"}
        </button>
      )}

      {question.explanation && (
        <div className="explanation-note">
          <strong>💡 Giải thích:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};

// Speaking Recorder Component
const SpeakingRecorder: React.FC<{
  onAnswer: (answer: string) => void;
  disabled: boolean;
}> = ({ onAnswer, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAnswer, setRecordedAnswer] = useState<string | null>(null);

  const handleRecord = async () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        setRecordedAnswer(
          "Audio recorded: " + new Date().toISOString().substring(0, 19),
        );
      }, 3000);
    }
  };

  const handleSubmitSpeaking = () => {
    if (recordedAnswer) {
      onAnswer(recordedAnswer);
      setRecordedAnswer(null);
    }
  };

  return (
    <div className="speaking-recorder">
      <button
        className={`record-btn ${isRecording ? "recording" : ""}`}
        onClick={handleRecord}
        disabled={disabled}
      >
        {isRecording ? "🔴 Đang ghi âm..." : "🎤 Ghi âm câu trả lời"}
      </button>
      {recordedAnswer && (
        <div className="recorded-status">
          <p>✅ {recordedAnswer}</p>
          <button
            className="submit-btn"
            onClick={handleSubmitSpeaking}
            disabled={disabled}
          >
            {disabled ? "Đang xử lý..." : "Gửi câu trả lời"}
          </button>
        </div>
      )}
    </div>
  );
};

// Result View Component
const ResultView: React.FC<{
  result: InitialAssessmentDTO;
  navigate: any;
}> = ({ result, navigate }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "#FF6B6B";
      case "ELEMENTARY":
        return "#FFA500";
      case "INTERMEDIATE":
        return "#FFD700";
      case "UPPER_INTERMEDIATE":
        return "#90EE90";
      case "ADVANCED":
        return "#32CD32";
      default:
        return "#999";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "Người Mới Bắt Đầu";
      case "ELEMENTARY":
        return "Cơ Bản";
      case "INTERMEDIATE":
        return "Trung Cấp";
      case "UPPER_INTERMEDIATE":
        return "Trung Cấp Cao";
      case "ADVANCED":
        return "Nâng Cao";
      default:
        return level;
    }
  };

  return (
    <div className="initial-assessment-container">
      <div className="result-view">
        <div className="result-header">
          <h1>🎉 Hoàn thành bài kiểm tra!</h1>
          <p>Kết quả đánh giá của bạn</p>
        </div>

        <div className="level-display">
          <div
            className="level-badge"
            style={{ backgroundColor: getLevelColor(result.assessmentLevel) }}
          >
            <div className="level-text">
              <span className="level-score">{result.totalScore}/100</span>
              <span className="level-name">
                {getLevelLabel(result.assessmentLevel)}
              </span>
            </div>
          </div>
        </div>

        <div className="score-breakdown">
          <h3>📊 Điểm chi tiết theo kỹ năng</h3>
          <div className="skill-scores">
            <div className="skill-score-item">
              <span>👂 Nghe (Listening)</span>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${(result.listeningScore / 25) * 100}%`,
                    backgroundColor: "#FF6B6B",
                  }}
                ></div>
              </div>
              <span className="score-number">{result.listeningScore}/25</span>
            </div>

            <div className="skill-score-item">
              <span>🎤 Nói (Speaking)</span>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${(result.speakingScore / 25) * 100}%`,
                    backgroundColor: "#FFA500",
                  }}
                ></div>
              </div>
              <span className="score-number">{result.speakingScore}/25</span>
            </div>

            <div className="skill-score-item">
              <span>✍️ Viết (Writing)</span>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${(result.writingScore / 25) * 100}%`,
                    backgroundColor: "#90EE90",
                  }}
                ></div>
              </div>
              <span className="score-number">{result.writingScore}/25</span>
            </div>

            <div className="skill-score-item">
              <span>📖 Đọc (Reading)</span>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${(result.readingScore / 25) * 100}%`,
                    backgroundColor: "#87CEEB",
                  }}
                ></div>
              </div>
              <span className="score-number">{result.readingScore}/25</span>
            </div>
          </div>
        </div>

        <div className="analysis-section">
          <div className="analysis-card strengths">
            <h4>💪 Điểm Mạnh</h4>
            <p>{result.strengths || "Bạn đã tỏ ra khá tốt!"}</p>
          </div>

          <div className="analysis-card weaknesses">
            <h4>📈 Điểm Cần Cải Thiện</h4>
            <p>{result.weaknesses || "Hãy tiếp tục luyện tập!"}</p>
          </div>
        </div>

        <div className="recommendation-section">
          <h3>🎯 Khuyến Nghị Của Chúng Tôi</h3>
          <div className="recommendation-box">
            <p>{result.recommendation}</p>
          </div>
        </div>

        <div className="result-actions">
          <button
            className="action-btn primary"
            onClick={() => navigate("/learning")}
          >
            ➡️ Bắt Đầu Học Tập
          </button>
          <button
            className="action-btn secondary"
            onClick={() => navigate("/dashboard")}
          >
            ⬅️ Quay Lại Dashboard
          </button>
        </div>

        <div className="test-info">
          <p>
            ✓ Đã hoàn thành {result.correctAnswers}/{result.totalQuestions} câu
            đúng
          </p>
          <p>
            📅 Ngày: {new Date(result.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InitialAssessmentTest;
