import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../services/api";
import "./LearningExercise.css";

interface Challenge {
  id: number;
  type: string;
  level: number;
  title: string;
  description: string;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  options?: string[];
  correctOptionIndex?: number;
  timeLimit: number;
}

interface SubmissionResult {
  id: number;
  isCorrect: boolean;
  xpEarned: number;
  accuracy: number;
}

type ChallengeType =
  | "LISTENING"
  | "SPEAKING"
  | "READING"
  | "WRITING"
  | "VOCABULARY"
  | "GRAMMAR";

const CHALLENGE_CONFIG: Record<
  ChallengeType,
  { icon: string; label: string; color: string; lottieUrl: string }
> = {
  LISTENING: {
    icon: "🎧",
    label: "Nghe",
    color: "#1cb0f6",
    lottieUrl:
      "https://lottie.host/9969033f-f8de-4af7-9187-d4a0465778d2/Q6f2rMKt2s.lottie",
  },
  SPEAKING: {
    icon: "🎤",
    label: "Nói",
    color: "#ff4b4b",
    lottieUrl:
      "https://lottie.host/f0883faa-adaa-4dad-94d5-fbce26830ef0/f020gA23G0.lottie",
  },
  READING: {
    icon: "📖",
    label: "Đọc",
    color: "#58cc02",
    lottieUrl:
      "https://lottie.host/0e8b40bd-a525-4cd9-a73a-8c0e329b7b9a/wNsM9BlL0R.lottie",
  },
  WRITING: {
    icon: "✍️",
    label: "Viết",
    color: "#ce82ff",
    lottieUrl:
      "https://lottie.host/615e707a-88a0-4592-8fa5-6d8e5d42ba17/5SfKw1QFOv.lottie",
  },
  VOCABULARY: {
    icon: "📚",
    label: "Từ vựng",
    color: "#ff9600",
    lottieUrl:
      "https://lottie.host/a1bb86d7-a5e1-4ea5-930d-77e9e5d87c6b/GvHaYeAJoa.lottie",
  },
  GRAMMAR: {
    icon: "📝",
    label: "Ngữ pháp",
    color: "#00b8a9",
    lottieUrl:
      "https://lottie.host/6ae70e7a-de29-4fb7-a7f0-5ce521b5decc/utGdKj6KDg.lottie",
  },
};

interface LearningExerciseProps {
  onXpEarned?: (xp: number) => void;
  onClose?: () => void;
}

const LearningExercise: React.FC<LearningExerciseProps> = ({
  onXpEarned,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<ChallengeType | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showComplete, setShowComplete] = useState(false);

  const currentChallenge = challenges[currentIndex];

  const loadChallenges = useCallback(async () => {
    if (!selectedType) return;

    try {
      setLoading(true);
      setError(null);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setResult(null);
      setTotalXp(0);
      setCorrectCount(0);
      setShowComplete(false);

      // Use progressive API to get challenges ordered by level (level 1, 2, 3...)
      const response = await apiClient.get<any>(
        `/challenges/progressive/${selectedType}?limit=5`,
      );

      if (response.success && Array.isArray(response.challenges)) {
        setChallenges(response.challenges);
        setStartTime(Date.now());
      } else if (
        response.data?.success &&
        Array.isArray(response.data.challenges)
      ) {
        setChallenges(response.data.challenges);
        setStartTime(Date.now());
      } else {
        setError("Không thể tải bài tập");
      }
    } catch (err) {
      console.error("Error loading challenges:", err);
      setError("Không thể tải bài tập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  // Only load challenges when started
  useEffect(() => {
    if (isStarted && selectedType) {
      loadChallenges();
    }
  }, [isStarted, selectedType, loadChallenges]);

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentChallenge) return;

    try {
      setIsSubmitting(true);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const response = await apiClient.post<any>("/challenges/submit", {
        challengeId: currentChallenge.id,
        userAnswer: selectedAnswer.toString(),
        timeSpent,
      });

      const submission = response.submission || response.data?.submission;
      if (submission) {
        setResult(submission);
        if (submission.isCorrect) {
          setCorrectCount((prev) => prev + 1);
          setTotalXp((prev) => prev + submission.xpEarned);
          onXpEarned?.(submission.xpEarned);
        }
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Không thể gửi câu trả lời");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setResult(null);
      setStartTime(Date.now());
    } else {
      setShowComplete(true);
    }
  };

  const handleTypeChange = (type: ChallengeType) => {
    setSelectedType(type);
    setIsStarted(false);
    setChallenges([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResult(null);
    setTotalXp(0);
    setCorrectCount(0);
    setShowComplete(false);
  };

  const handleStartExercise = () => {
    setIsStarted(true);
  };

  const handleRestart = () => {
    loadChallenges();
  };

  // Complete screen
  if (showComplete && selectedType) {
    return (
      <div className="learning-exercise">
        <div className="exercise-complete">
          <div className="complete-icon">🎉</div>
          <h2>Xuất sắc!</h2>
          <p>
            Bạn đã hoàn thành bài tập {CHALLENGE_CONFIG[selectedType].label}
          </p>

          <div className="complete-stats">
            <div className="stat-item">
              <span className="stat-value">
                {correctCount}/{challenges.length}
              </span>
              <span className="stat-label">Câu đúng</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">+{totalXp}</span>
              <span className="stat-label">XP kiếm được</span>
            </div>
          </div>

          <div className="complete-actions">
            <button className="btn-restart" onClick={handleRestart}>
              Làm lại
            </button>
            <button
              className="btn-new-type"
              onClick={() => {
                setIsStarted(false);
                setSelectedType(null);
                setChallenges([]);
                setShowComplete(false);
              }}
            >
              Loại khác
            </button>
            {onClose && (
              <button className="btn-close" onClick={onClose}>
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-exercise">
      {/* Type Selector */}
      <div className="type-selector">
        {(Object.keys(CHALLENGE_CONFIG) as ChallengeType[]).map((type) => (
          <button
            key={type}
            className={`type-btn ${selectedType === type ? "active" : ""}`}
            onClick={() => handleTypeChange(type)}
            style={
              {
                "--type-color": CHALLENGE_CONFIG[type].color,
              } as React.CSSProperties
            }
          >
            <span className="type-icon">
              <dotlottie-wc
                src={CHALLENGE_CONFIG[type].lottieUrl}
                autoplay
                loop
                style={{ width: "56px", height: "56px" }}
              />
            </span>
            <span className="type-label">{CHALLENGE_CONFIG[type].label}</span>
          </button>
        ))}
      </div>

      {/* Welcome/Start Screen - when type selected but not started */}
      {selectedType && !isStarted && !loading && (
        <div className="exercise-start-screen">
          <div className="start-screen-content">
            <div className="start-icon">
              <dotlottie-wc
                src={CHALLENGE_CONFIG[selectedType].lottieUrl}
                autoplay
                loop
                style={{ width: "120px", height: "120px" }}
              />
            </div>
            <h2 className="start-title">
              Bài tập {CHALLENGE_CONFIG[selectedType].label}
            </h2>
            <p className="start-description">
              {selectedType === "LISTENING" &&
                "Luyện nghe và hiểu tiếng Anh qua các đoạn audio"}
              {selectedType === "SPEAKING" &&
                "Luyện phát âm và giao tiếp tiếng Anh"}
              {selectedType === "READING" &&
                "Đọc hiểu văn bản và trả lời câu hỏi"}
              {selectedType === "WRITING" &&
                "Luyện viết câu và đoạn văn tiếng Anh"}
              {selectedType === "VOCABULARY" &&
                "Học từ vựng mới và ôn tập từ đã học"}
              {selectedType === "GRAMMAR" && "Ôn luyện ngữ pháp tiếng Anh"}
            </p>
            <div className="start-info">
              <div className="info-item">
                <span className="info-icon">📝</span>
                <span>5 câu hỏi</span>
              </div>
              <div className="info-item">
                <span className="info-icon">⭐</span>
                <span>Nhận XP</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🎯</span>
                <span>Theo cấp độ</span>
              </div>
            </div>
            <button
              className="btn-start-exercise"
              onClick={handleStartExercise}
              style={{ backgroundColor: CHALLENGE_CONFIG[selectedType].color }}
            >
              <span className="play-icon">▶</span>
              BẮT ĐẦU
            </button>
          </div>
        </div>
      )}

      {/* No type selected - show welcome message */}
      {!selectedType && (
        <div className="exercise-welcome">
          <div className="welcome-icon">👆</div>
          <h2>Chọn loại bài tập</h2>
          <p>Chọn một loại bài tập ở trên để bắt đầu luyện tập</p>
        </div>
      )}

      {/* Progress Bar - only show when started */}
      {isStarted && challenges.length > 0 && selectedType && (
        <div className="exercise-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentIndex + (result ? 1 : 0)) / challenges.length) * 100}%`,
                backgroundColor: CHALLENGE_CONFIG[selectedType].color,
              }}
            />
          </div>
          <span className="progress-text">
            {currentIndex + 1} / {challenges.length}
          </span>
        </div>
      )}

      {/* Loading State */}
      {isStarted && loading && (
        <div className="exercise-loading">
          <div className="loading-spinner" />
          <p>Đang tải bài tập...</p>
        </div>
      )}

      {/* Error State */}
      {isStarted && error && !loading && (
        <div className="exercise-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={loadChallenges}>Thử lại</button>
        </div>
      )}

      {/* Challenge Content */}
      {isStarted && !loading && !error && currentChallenge && selectedType && (
        <div className="exercise-content">
          {/* Challenge Header */}
          <div className="challenge-header">
            <span
              className="challenge-type-badge"
              style={{ backgroundColor: CHALLENGE_CONFIG[selectedType].color }}
            >
              {CHALLENGE_CONFIG[selectedType].icon}{" "}
              {CHALLENGE_CONFIG[selectedType].label}
            </span>
            <span className="challenge-level">
              Cấp độ {currentChallenge.level}
            </span>
          </div>

          {/* Challenge Title */}
          <h2 className="challenge-title">{currentChallenge.title}</h2>
          <p className="challenge-description">
            {currentChallenge.description}
          </p>

          {/* Challenge Content */}
          <div className="challenge-content-box">
            {currentChallenge.audioUrl && (
              <div className="audio-player">
                <button className="play-audio-btn">🔊 Nghe</button>
              </div>
            )}
            <p className="challenge-text">{currentChallenge.content}</p>
          </div>

          {/* Answer Options */}
          <div className="answer-options">
            {currentChallenge.options?.map((option, index) => {
              let optionClass = "option-btn";
              if (selectedAnswer === index) {
                optionClass += " selected";
              }
              if (result) {
                if (index === currentChallenge.correctOptionIndex) {
                  optionClass += " correct";
                } else if (selectedAnswer === index && !result.isCorrect) {
                  optionClass += " incorrect";
                }
              }

              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => !result && setSelectedAnswer(index)}
                  disabled={!!result}
                >
                  <span className="option-number">{index + 1}</span>
                  <span className="option-text">{option}</span>
                  {result && index === currentChallenge.correctOptionIndex && (
                    <span className="option-check">✓</span>
                  )}
                  {result && selectedAnswer === index && !result.isCorrect && (
                    <span className="option-cross">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Feedback */}
          {result && (
            <div
              className={`result-feedback ${result.isCorrect ? "correct" : "incorrect"}`}
            >
              <span className="result-icon">
                {result.isCorrect ? "🎉" : "😢"}
              </span>
              <span className="result-text">
                {result.isCorrect
                  ? `Chính xác! +${result.xpEarned} XP`
                  : "Sai rồi! Hãy thử lại nhé"}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="exercise-actions">
            {!result ? (
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={selectedAnswer === null || isSubmitting}
                style={{
                  backgroundColor: CHALLENGE_CONFIG[selectedType].color,
                }}
              >
                {isSubmitting ? "Đang kiểm tra..." : "KIỂM TRA"}
              </button>
            ) : (
              <button
                className="btn-next"
                onClick={handleNext}
                style={{
                  backgroundColor: CHALLENGE_CONFIG[selectedType].color,
                }}
              >
                {currentIndex < challenges.length - 1
                  ? "TIẾP TỤC"
                  : "HOÀN THÀNH"}
              </button>
            )}
          </div>

          {/* XP Counter */}
          <div className="xp-counter">
            <span className="xp-icon">⭐</span>
            <span className="xp-value">+{totalXp} XP</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {isStarted && !loading && !error && challenges.length === 0 && (
        <div className="exercise-empty">
          <span className="empty-icon">📭</span>
          <p>Không có bài tập nào</p>
          <button onClick={loadChallenges}>Tải lại</button>
        </div>
      )}
    </div>
  );
};

export default LearningExercise;
