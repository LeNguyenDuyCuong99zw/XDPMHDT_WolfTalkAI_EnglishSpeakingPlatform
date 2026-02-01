import React, { useState } from "react";
import type {
  LearningSession,
  AnswerResult,
} from "../../../services/vocabularyAPI";
import { FaVolumeUp, FaCheck, FaTimes, FaStar, FaTrophy } from "react-icons/fa";

interface VocabularyQuizProps {
  session: LearningSession;
  onSubmitAnswer: (wordId: number, answer: string) => Promise<AnswerResult>;
  onNext: () => void;
}

export const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({
  session,
  onSubmitAnswer,
  onNext,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectAnswer = async (answer: string) => {
    if (result || isSubmitting) return; // Already answered or submitting

    setSelectedAnswer(answer);
    setIsSubmitting(true);

    try {
      const answerResult = await onSubmitAnswer(session.word.id, answer);
      setResult(answerResult);
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại.");
      setSelectedAnswer(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setResult(null);
    onNext();
  };

  const playAudio = () => {
    if (session.word.audioUrl) {
      const audio = new Audio(session.word.audioUrl);
      audio.play();
    } else {
      alert("Chưa có audio cho từ này");
    }
  };

  const getSessionTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
      LEARN: "📚 Học mới",
      REVIEW: "🔄 Ôn tập",
      PRACTICE: "💪 Luyện tập",
    };
    return labels[type] || type;
  };

  return (
    <div className="vocab-quiz-main">
      <div className="vocab-quiz-header">
        <span className="vocab-session-type-badge">
          {getSessionTypeLabel(session.sessionType)}
        </span>
        <div className="vocab-quiz-progress">
          <span className="vocab-level-badge">
            Level {session.currentLevel}
          </span>
          <span className="vocab-words-learned">
            {session.totalWordsLearned} từ đã học
          </span>
        </div>
      </div>

      <div className="vocab-word-display">
        <div className="word-main">
          <h1 className="vocab-word-text">{session.word.word}</h1>
          {session.word.phonetic && (
            <div className="vocab-word-phonetic">{session.word.phonetic}</div>
          )}
          {session.word.audioUrl && (
            <button className="vocab-audio-button" onClick={playAudio}>
              <FaVolumeUp /> Nghe phát âm
            </button>
          )}
        </div>

        {session.word.wordType && (
          <div className="vocab-word-type">{session.word.wordType}</div>
        )}
      </div>

      <div className="vocab-quiz-question">
        <h2>Chọn nghĩa đúng của từ:</h2>
      </div>

      <div className="vocab-options-grid">
        {session.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = result && option === result.correctAnswer;
          const isWrong = result && isSelected && !result.correct;

          let className = "vocab-option-card";
          if (isSelected && !result) className += " selected";
          if (isCorrect) className += " correct";
          if (isWrong) className += " wrong";
          if (result && !isCorrect && !isWrong) className += " disabled";

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleSelectAnswer(option)}
              disabled={!!result || isSubmitting}
            >
              <span className="vocab-option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="vocab-option-text">{option}</span>
              {isCorrect && (
                <FaCheck className="vocab-option-icon vocab-correct-icon" />
              )}
              {isWrong && (
                <FaTimes className="vocab-option-icon vocab-wrong-icon" />
              )}
            </button>
          );
        })}
      </div>

      {result && (
        <div
          className={`vocab-result-panel ${result.correct ? "correct" : "wrong"}`}
        >
          <div className="vocab-result-header">
            {result.correct ? (
              <>
                <FaCheck className="vocab-result-icon" />
                <h3>Chính xác! 🎉</h3>
              </>
            ) : (
              <>
                <FaTimes className="vocab-result-icon" />
                <h3>Chưa đúng</h3>
              </>
            )}
          </div>

          <div className="vocab-result-details">
            {!result.correct && (
              <div className="vocab-correct-answer">
                <strong>Đáp án đúng:</strong> {result.correctAnswer}
              </div>
            )}

            {session.word.example && (
              <div className="vocab-word-example">
                <strong>Ví dụ:</strong> {session.word.example}
              </div>
            )}

            {session.word.usageNote && (
              <div className="vocab-word-usage">
                <strong>Ghi chú:</strong> {session.word.usageNote}
              </div>
            )}

            <div className="vocab-result-stats">
              <div className="vocab-stat-item">
                <FaStar className="stat-icon" />
                <span>+{result.xpEarned} XP</span>
              </div>
              <div className="vocab-stat-item">
                <span>Độ thành thạo: {result.masteryScore}%</span>
              </div>
            </div>

            {result.justMastered && (
              <div className="vocab-mastery-badge">
                <FaCheck /> Đã thành thạo từ này!
              </div>
            )}

            {result.leveledUp && (
              <div className="vocab-levelup-animation">
                <FaTrophy className="trophy-icon" />
                <h2>Chúc mừng!</h2>
                <p>Bạn đã lên Level {result.newLevel}! 🎊</p>
              </div>
            )}
          </div>

          <button className="vocab-next-button" onClick={handleNext}>
            Tiếp theo →
          </button>
        </div>
      )}
    </div>
  );
};
