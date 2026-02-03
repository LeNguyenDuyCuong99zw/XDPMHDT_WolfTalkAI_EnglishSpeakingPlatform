import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChallengeCard.css";

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

interface ChallengeCardProps {
  challenge: Challenge;
  onSubmit: (answer: string, timeSpent: number) => void;
  isLoading?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onSubmit,
  isLoading = false,
}) => {
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [feedback, setFeedback] = useState<string>("");

  // Reset state when challenge changes
  useEffect(() => {
    setUserAnswer("");
    setSelectedOption(null);
    setTimeSpent(0);
    setIsActive(true);
    setFeedback("");
  }, [challenge.id]);

  // Timer for the challenge
  useEffect(() => {
    if (!isActive || !challenge) return;

    const interval = setInterval(() => {
      setTimeSpent((prev) => {
        if (prev >= challenge.timeLimit) {
          setIsActive(false);
          return challenge.timeLimit;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, challenge]);

  const handleOptionSelect = (index: number) => {
    if (!isActive || isLoading) return;
    setSelectedOption(index);
    setFeedback("");
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserAnswer(e.target.value);
    setFeedback("");
  };

  const handleSubmit = () => {
    const answer =
      selectedOption !== null ? selectedOption.toString() : userAnswer;
    if (!answer.trim()) {
      setFeedback("Vui lòng nhập câu trả lời");
      return;
    }

    setIsActive(false);
    setFeedback("");
    onSubmit(answer, timeSpent);
  };

  const getLevelColor = (level: number): string => {
    const colors = ["#4CAF50", "#2196F3", "#FF9800", "#F44336", "#9C27B0"];
    return colors[Math.min(level - 1, 4)];
  };

  const timePercentage = (timeSpent / challenge.timeLimit) * 100;
  const isTimeWarning = timePercentage > 80;

  return (
    <div className="challenge-card">
      {/* Header */}
      <div className="challenge-header">
        <div className="challenge-meta">
          <span className="challenge-type">{challenge.type}</span>
          <span
            className="challenge-level"
            style={{ backgroundColor: getLevelColor(challenge.level) }}
          >
            Level {challenge.level}
          </span>
        </div>
        <div className="challenge-timer">
          <div className={`timer-bar ${isTimeWarning ? "warning" : ""}`}>
            <div
              className="timer-progress"
              style={{ width: `${Math.min(timePercentage, 100)}%` }}
            ></div>
          </div>
          <span className={`timer-text ${isTimeWarning ? "warning" : ""}`}>
            {Math.floor(timeSpent / 60)}:
            {String(timeSpent % 60).padStart(2, "0")} / {challenge.timeLimit}s
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="challenge-content">
        <h3 className="challenge-title">{challenge.title}</h3>
        <p className="challenge-description">{challenge.description}</p>

        {/* Main content based on type */}
        {challenge.type === "LISTENING" && challenge.audioUrl && (
          <div className="challenge-media">
            <audio controls className="audio-player">
              <source src={challenge.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {(challenge.type === "READING" || challenge.type === "VOCABULARY") && (
          <div className="challenge-text-content">
            <p className="content-text">{challenge.content}</p>
          </div>
        )}

        {challenge.type === "WRITING" && challenge.imageUrl && (
          <div className="challenge-media">
            <img
              src={challenge.imageUrl}
              alt="Challenge"
              className="challenge-image"
            />
          </div>
        )}

        {/* Options (Multiple Choice) */}
        {challenge.options && challenge.options.length > 0 && (
          <div className="challenge-options">
            {challenge.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedOption === index ? "selected" : ""} ${isLoading ? "disabled" : ""}`}
                onClick={() => handleOptionSelect(index)}
                disabled={isLoading || !isActive}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        )}

        {/* Text Input (Speaking, Writing) */}
        {(challenge.type === "SPEAKING" || challenge.type === "WRITING") &&
          !challenge.options && (
            <div className="challenge-input">
              <textarea
                placeholder={`Enter your answer here (${challenge.type === "WRITING" ? "100-300 characters" : "speak or write"})`}
                value={userAnswer}
                onChange={handleTextChange}
                disabled={isLoading || !isActive}
                className="answer-textarea"
                maxLength={500}
              />
              <span className="char-count">{userAnswer.length}/500</span>
            </div>
          )}

        {/* Grammar Input */}
        {challenge.type === "GRAMMAR" && !challenge.options && (
          <div className="challenge-input">
            <input
              type="text"
              placeholder="Type your answer"
              value={userAnswer}
              onChange={handleTextChange}
              disabled={isLoading || !isActive}
              className="answer-input"
            />
          </div>
        )}
      </div>

      {/* Feedback */}
      {feedback && <div className="challenge-feedback error">{feedback}</div>}

      {/* Footer */}
      <div className="challenge-footer">
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={
            isLoading ||
            !isActive ||
            (selectedOption === null && !userAnswer.trim())
          }
        >
          {isLoading ? "Đang gửi..." : "Gửi câu trả lời"}
        </button>
        {!isActive && timeSpent >= challenge.timeLimit && (
          <span className="time-expired">Hết giờ!</span>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
