import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./PlacementTest.css";

interface QuestionOption {
  id: number;
  optionText: string;
  imageUrl?: string;
  displayOrder: number;
}

interface PlacementQuestion {
  id: number;
  level: string;
  type: string;
  questionText: string;
  audioUrl?: string;
  imageUrl?: string;
  options: QuestionOption[];
  difficulty: number;
}

const PlacementTestQuestions: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hearts, setHearts] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/placement-test/${testId}/questions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load questions:", error);
      alert("Không thể tải câu hỏi. Vui lòng thử lại!");

  const handleCheckAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let userAnswer = selectedAnswer;

    if (currentQuestion.type === "word_bank") {
      userAnswer = wordBankAnswer.join(" ");
    }

    const correct =
      userAnswer.toLowerCase().trim() ===
      currentQuestion.correctAnswer.toLowerCase().trim();

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setStreak(streak + 1);
    } else {
      setHearts(hearts - 1);
      setStreak(0);
    }
  };

  const handleContinue = () => {
    if (hearts <= 0) {
      // Game over
      navigate(`/placement-test/${testId}/complete`);
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      // Next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setWordBankAnswer([]);
      setIsCorrect(null);
      setShowResult(false);
    } else {
      // All questions completed
      navigate(`/placement-test/${testId}/complete`);
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setWordBankAnswer([]);
      setIsCorrect(null);
      setShowResult(false);
    }
  };

  const addWordToBankAnswer = (word: string) => {
    setWordBankAnswer([...wordBankAnswer, word]);
  };

  const removeWordFromBankAnswer = (index: number) => {
    setWordBankAnswer(wordBankAnswer.filter((_, i) => i !== index));
  };

  const playAudio = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.audioUrl) {
      const audio = new Audio(currentQuestion.audioUrl);
      audio.play();
    }
  };

  if (isLoading) {
    return (
      <div className="placement-test-container">
        <div className="placement-test-step">
          <div className="loading-screen">
            <div className="wolf-mascot-large">
              <div className="wolf-circle">
                <span className="wolf-emoji">🐺</span>
              </div>
            </div>
            <h2>Đang chuẩn bị câu hỏi...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="placement-test-container">
        <div className="placement-test-step">
          <div className="error-screen">
            <h2>Không tìm thấy câu hỏi</h2>
            <button
              className="btn-start-test"
              onClick={() => navigate("/dashboard")}
            >
              Quay lại Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="questions-container">
      {/* Header with progress and hearts */}
      <div className="questions-header">
        <button className="exit-button" onClick={() => navigate("/dashboard")}>
          ✕
        </button>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="hearts-container">
          <span className="heart-icon">❤️</span>
          <span className="hearts-count">{hearts}</span>
        </div>
      </div>

      {streak >= 3 && !showResult && (
        <div className="streak-banner">🔥 {streak} LẦN LIÊN TIẾP</div>
      )}

      {/* Question Content */}
      <div className="question-content">
        {/* Multiple Choice */}
        {currentQuestion.type === "multiple_choice" && (
          <>
            <h2 className="question-title">{currentQuestion.question}</h2>
            {currentQuestion.imageUrl && (
              <div className="question-image-container">
                <img
                  src={currentQuestion.imageUrl}
                  alt="Question"
                  className="question-image"
                />
              </div>
            )}
            <div className="answer-options">
              {currentQuestion.options?.map((option, index) => (
                <div
                  key={index}
                  className={`answer-option ${
                    selectedAnswer === option ? "selected" : ""
                  }`}
                  onClick={() => !showResult && setSelectedAnswer(option)}
                >
                  <span className="option-number">{index + 1}</span>
                  <span className="option-text">{option}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Word Bank (Arrange words) */}
        {currentQuestion.type === "word_bank" && (
          <>
            <div className="question-badge">
              <span className="badge-icon">🔤</span>
              <span>TỪ VỰNG MỚI</span>
            </div>
            <h2 className="question-title">{currentQuestion.question}</h2>

            {currentQuestion.audioUrl && (
              <div className="audio-controls">
                <button className="audio-button primary" onClick={playAudio}>
                  🔊
                </button>
                <button className="audio-button secondary" onClick={playAudio}>
                  🐢
                </button>
              </div>
            )}

            {currentQuestion.imageUrl && (
              <div className="character-display">
                <img
                  src={currentQuestion.imageUrl}
                  alt="Character"
                  className="character-image"
                />
                <div className="speech-bubble">
                  {currentQuestion.correctAnswer}
                </div>
              </div>
            )}

            {/* Answer area */}
            <div className="word-bank-answer-area">
              {wordBankAnswer.length === 0 ? (
                <div className="empty-answer-placeholder"></div>
              ) : (
                wordBankAnswer.map((word, index) => (
                  <div
                    key={index}
                    className="word-chip selected"
                    onClick={() => removeWordFromBankAnswer(index)}
                  >
                    {word}
                  </div>
                ))
              )}
            </div>

            {/* Word bank */}
            <div className="word-bank">
              {currentQuestion.options
                ?.filter((opt) => !wordBankAnswer.includes(opt))
                .map((word, index) => (
                  <div
                    key={index}
                    className="word-chip"
                    onClick={() => addWordToBankAnswer(word)}
                  >
                    {word}
                  </div>
                ))}
            </div>
          </>
        )}

        {/* Listen and type/select */}
        {currentQuestion.type === "listen" && (
          <>
            <h2 className="question-title">Nghe và điền</h2>
            <div className="audio-controls">
              <button className="audio-button primary" onClick={playAudio}>
                🔊
              </button>
              <button className="audio-button secondary" onClick={playAudio}>
                🐢
              </button>
            </div>

            {currentQuestion.options && (
              <div className="answer-options">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`answer-option ${
                      selectedAnswer === option ? "selected" : ""
                    }`}
                    onClick={() => !showResult && setSelectedAnswer(option)}
                  >
                    <span className="option-text">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div
          className={`result-feedback ${isCorrect ? "correct" : "incorrect"}`}
        >
          <div className="result-icon">{isCorrect ? "✓" : "✗"}</div>
          <div className="result-text">
            <h3>{isCorrect ? "Giỏi quá!" : "Đáp án đúng:"}</h3>
            {!isCorrect && <p>{currentQuestion.correctAnswer}</p>}
            <button className="report-button">📢 BÁO CÁO</button>
          </div>
          <button className="btn-continue" onClick={handleContinue}>
            TIẾP TỤC
          </button>
        </div>
      )}

      {/* Bottom navigation */}
      {!showResult && (
        <div className="question-navigation">
          <button className="btn-skip" onClick={handleSkip}>
            BỎ QUA
          </button>
          <button
            className="btn-check"
            onClick={handleCheckAnswer}
            disabled={
              (currentQuestion.type === "word_bank" &&
                wordBankAnswer.length === 0) ||
              (currentQuestion.type !== "word_bank" && !selectedAnswer)
            }
          >
            KIỂM TRA
          </button>
        </div>
      )}
    </div>
  );
};

export default PlacementTestQuestions;
