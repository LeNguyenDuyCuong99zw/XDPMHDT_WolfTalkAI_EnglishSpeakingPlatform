import React from "react";
import { useNavigate } from "react-router-dom";
import { initialAssessmentAPI } from "../services/initialAssessmentAPI";
import logoWolf from "../assets/wolftalk/logo_wolf.png";
import "./InitialAssessment.css";

const InitialAssessmentLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);
  const [hasCompleted, setHasCompleted] = React.useState(false);

  const handleGoBack = () => {
    navigate("/dashboard", { replace: true });
  };

  // Check if user has already completed the test
  React.useEffect(() => {
    const checkTestCompletion = async () => {
      try {
        const result = await initialAssessmentAPI.hasCompletedTest();
        setHasCompleted(result.hasCompleted);
      } catch (error) {
        console.error("Failed to check test completion:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkTestCompletion();
  }, [navigate]);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const assessment = await initialAssessmentAPI.startTest();
      // Navigate to questions
      navigate(`/initial-assessment/${assessment.id}/questions`);
    } catch (error) {
      console.error("Failed to start test:", error);
      alert("Không thể bắt đầu bài kiểm tra. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResults = () => {
    navigate("/initial-assessment/results");
  };

  // Show loading while checking if test is completed
  if (isChecking) {
    return (
      <div className="initial-assessment-container-dark">
        <div className="initial-assessment-card initial-assessment-landing">
          <div className="wolf-mascot-large">
            <img
              src={logoWolf}
              alt="WolfTalk Logo"
              className="wolf-logo-image"
            />
          </div>
          <p className="landing-subtitle">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="initial-assessment-container-dark">
      <button
        className="btn-back-top-left"
        onClick={handleGoBack}
        title="Quay lại"
      >
        ← Quay lại
      </button>
      <div className="initial-assessment-card initial-assessment-landing">
        <div className="wolf-mascot-large">
          <img src={logoWolf} alt="WolfTalk Logo" className="wolf-logo-image" />
        </div>

        <h1 className="landing-title">Đánh Giá Trình Độ Tiếng Anh!</h1>

        <p className="landing-subtitle">
          Hãy hoàn thành bài kiểm tra để chúng tôi hiểu rõ trình độ tiếng Anh
          hiện tại của bạn
          <br />
          và tạo lộ trình học tập phù hợp nhất!
        </p>

        <div className="landing-features">
          <div className="feature-item">
            <span className="feature-icon">⏱️</span>
            <span className="feature-text">Chỉ mất 10-15 phút</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">20 câu hỏi đa dạng</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Kết quả chính xác</span>
          </div>
        </div>

        {hasCompleted ? (
          <div className="completed-section">
            <div className="completed-message">
              <span className="completed-icon">✅</span>
              <p>Bạn đã hoàn thành bài đánh giá!</p>
            </div>
            <div className="completed-buttons">
              <button
                className="btn-start-test"
                onClick={handleViewResults}
                disabled={isLoading}
              >
                📊 Xem Kết Quả
              </button>
              <button
                className="btn-secondary"
                onClick={handleStart}
                disabled={isLoading}
              >
                {isLoading ? "Đang bắt đầu..." : "🔄 Làm Lại"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              className="btn-start-test"
              onClick={handleStart}
              disabled={isLoading}
            >
              {isLoading ? "Đang bắt đầu..." : "Bắt Đầu Kiểm Tra"}
            </button>

            <p className="landing-hint">
              💡 Tip: Hãy trả lời thật lòng để có kết quả chính xác nhất!
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default InitialAssessmentLanding;
