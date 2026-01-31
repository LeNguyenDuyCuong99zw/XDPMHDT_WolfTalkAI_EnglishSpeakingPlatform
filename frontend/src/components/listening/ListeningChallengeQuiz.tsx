import React, { useState, useEffect, useRef } from "react";
import "./ListeningChallengeQuiz.css";
import { apiClient } from "../../services/api";

interface Challenge {
  id: number;
  title: string;
  audioUrl: string;
  englishText: string;
  vietnameseText: string;
  basePoints: number;
  difficultyLevel: number;
  durationSeconds: number;
}

interface ListeningChallengeQuizProps {
  challenge: Challenge;
  onComplete: () => void;
  onBack: () => void;
}

// apiClient handles all the configuration and token injection

const ListeningChallengeQuiz: React.FC<ListeningChallengeQuizProps> = ({
  challenge,
  onComplete,
  onBack,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Start timer
    timerRef.current = window.setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const playAudio = () => {
    if (audioRef.current) {
      setIsPlayingAudio(true);
      audioRef.current.play();
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      alert("Vui lòng nhập câu trả lời");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post<any>("/api/listening/submit", {
        challengeId: challenge.id,
        userAnswer: userAnswer.trim(),
        timeTaken: timeTaken * 1000,
      });

      setResult(response);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (error: any) {
      alert("Lỗi khi gửi câu trả lời. Vui lòng thử lại.");
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    const isCorrect = result.completed;
    return (
      <div className="listening-quiz-result">
        <div className="result-container">
          {isCorrect ? (
            <>
              <div className="success-icon">🎉</div>
              <h2>Chính xác!</h2>
              <p className="result-text">Bạn đã trả lời đúng!</p>
            </>
          ) : (
            <>
              <div className="error-icon">❌</div>
              <h2>Chưa chính xác</h2>
              <p className="result-text">Hãy cố gắng lần tới!</p>
            </>
          )}

          <div className="result-details">
            <div className="detail-item">
              <span className="label">Câu gốc:</span>
              <span className="value">{challenge.englishText}</span>
            </div>
            <div className="detail-item">
              <span className="label">Dịch:</span>
              <span className="value">{challenge.vietnameseText}</span>
            </div>
            <div className="detail-item">
              <span className="label">Câu trả lời của bạn:</span>
              <span className={`value ${isCorrect ? "correct" : "incorrect"}`}>
                {userAnswer}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Điểm:</span>
              <span className="value points">+{result.pointsEarned}</span>
            </div>
            <div className="detail-item">
              <span className="label">Chuỗi học:</span>
              <span className="value streak">🔥 {result.currentStreak}</span>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn btn-next" onClick={onComplete}>
              ← Tiếp tục
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="listening-quiz-container">
      <div className="quiz-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <div className="header-info">
          <span className="difficulty">
            {"⭐".repeat(challenge.difficultyLevel)}
          </span>
          <span className="time">⏱️ {formatTime(timeTaken)}</span>
        </div>
      </div>

      <div className="quiz-content">
        <div className="quiz-card">
          <h2>{challenge.title}</h2>

          <div className="audio-section">
            <audio
              ref={audioRef}
              src={challenge.audioUrl}
              onEnded={() => setIsPlayingAudio(false)}
            />
            <button
              className="audio-btn"
              onClick={playAudio}
              disabled={isPlayingAudio}
            >
              {isPlayingAudio ? "🔊 Đang phát..." : "🔊 Nghe"}
            </button>
            <span className="audio-hint">
              Nhấp nút trên để nghe và dịch những gì bạn nghe
            </span>
          </div>

          <div className="answer-section">
            <label htmlFor="answer">Dịch thành Tiếng Anh:</label>
            <textarea
              id="answer"
              className="answer-input"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Nhập câu dịch của bạn..."
              disabled={isSubmitting}
            />
          </div>

          <div className="hint-section">
            <button className="hint-btn" onClick={() => setShowHint(!showHint)}>
              {showHint ? "📖 Ẩn gợi ý" : "📖 Xem gợi ý"}
            </button>
            {showHint && (
              <div className="hint-content">
                <p>
                  <strong>Gợi ý:</strong> {challenge.vietnameseText}
                </p>
              </div>
            )}
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || !userAnswer.trim()}
          >
            {isSubmitting ? "Đang kiểm tra..." : "Gửi câu trả lời"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListeningChallengeQuiz;
