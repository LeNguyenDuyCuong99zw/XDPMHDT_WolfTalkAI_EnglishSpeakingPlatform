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
  const [correctAnswer, setCorrectAnswer] = useState<string>("");

  useEffect(() => {
    loadQuestionsAndProgress();
  }, []);

  const loadQuestionsAndProgress = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // Load questions
      const questionsResponse = await axios.get(
        `http://localhost:8080/api/placement-test/${testId}/questions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      let loadedQuestions = questionsResponse.data;

      // Load progress
      const progressResponse = await axios.get(
        `http://localhost:8080/api/placement-test/${testId}/progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const currentIndex = progressResponse.data.currentQuestionIndex || 0;

      // Shuffle options for questions after index 6 (after 7/7)
      loadedQuestions = loadedQuestions.map(
        (q: PlacementQuestion, index: number) => {
          if (index > 6) {
            const shuffledOptions = [...q.options].sort(
              () => Math.random() - 0.5,
            );
            return { ...q, options: shuffledOptions };
          }
          return q;
        },
      );

      setQuestions(loadedQuestions);
      setCurrentQuestionIndex(currentIndex);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load questions:", error);
      alert("Không thể tải câu hỏi. Vui lòng thử lại!");
    }
  };

  const handleCheckAnswer = async () => {
    if (!userAnswer && selectedWords.length === 0) {
      alert("Vui lòng chọn câu trả lời!");
      return;
    }

    setIsChecking(true);
    const currentQuestion = questions[currentQuestionIndex];
    const answerToSubmit =
      currentQuestion.type === "WORD_ORDER" ||
      currentQuestion.type === "TRANSLATE"
        ? selectedWords.join(" ")
        : userAnswer;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:8080/api/placement-test/submit-answer",
        {
          testId: Number(testId),
          questionId: Number(currentQuestion.id),
          userAnswer: answerToSubmit,
          timeSpentSeconds: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const correct = response.data.isCorrect;
      setIsCorrect(correct);

      if (correct) {
        setCorrectCount(correctCount + 1);
      } else {
        setHearts(hearts - 1);
        // Set correct answer for display (from backend or current question)
        setCorrectAnswer(
          response.data.correctAnswer || currentQuestion.questionText,
        );
      }

      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        handleNext();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to submit answer:", error);
      console.error("Error details:", error.response?.data);
      alert(
        `Lỗi khi gửi câu trả lời: ${
          error.response?.data?.error || error.message
        }`,
      );
      setIsChecking(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setSelectedWords([]);
      setIsCorrect(null);
      setIsChecking(false);
    } else {
      // Navigate to results page
      navigate(`/placement-test/${testId}/complete`);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleReset = () => {
    setUserAnswer("");
    setSelectedWords([]);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];

    if (question.type === "LISTEN_TYPE") {
      return (
        <div className="question-content-modern">
          <div className="question-header">
            <span className="question-type-badge">🎧 TỪ VỰNG MỚI</span>
            <h2 className="question-title-modern">Nghe và điền</h2>
          </div>
          {question.audioUrl && (
            <div className="audio-section">
              <button
                className="audio-button-modern"
                onClick={() => playAudio(question.audioUrl!)}
              >
                <span className="audio-icon">🔊</span>
              </button>
              <button
                className="audio-button-slow"
                onClick={() => playAudio(question.audioUrl!)}
              >
                <span className="turtle-icon">🐢</span>
              </button>
            </div>
          )}
          <div className="answer-area">
            <div className="selected-words-box">
              {selectedWords.length > 0 ? (
                selectedWords.map((word, idx) => (
                  <span key={idx} className="selected-word-chip">
                    {word}
                  </span>
                ))
              ) : (
                <span className="placeholder-text">Chọn các từ phía dưới</span>
              )}
            </div>
          </div>
          <div className="word-bank-modern">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={`word-chip ${
                  selectedWords.includes(option.optionText) ? "selected" : ""
                }`}
                onClick={() => toggleWord(option.optionText)}
              >
                {option.optionText}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === "TRANSLATE") {
      return (
        <div className="question-content-modern">
          <div className="question-header">
            <span className="question-type-badge">✏️ TỪ VỰNG MỚI</span>
            <h2 className="question-title-modern">Viết lại bằng tiếng Việt</h2>
          </div>
          <div className="translation-prompt">
            {question.audioUrl && (
              <button
                className="word-audio-button"
                onClick={() => playAudio(question.audioUrl!)}
              >
                <span className="speaker-icon">🔊</span>
                <span className="word-to-translate">
                  {question.questionText}
                </span>
              </button>
            )}
            {!question.audioUrl && (
              <div className="word-display">
                <span className="word-to-translate">
                  {question.questionText}
                </span>
              </div>
            )}
          </div>
          <div className="answer-area">
            <div className="selected-words-box">
              {selectedWords.length > 0 ? (
                selectedWords.map((word, idx) => (
                  <span key={idx} className="selected-word-chip">
                    {word}
                  </span>
                ))
              ) : (
                <span className="placeholder-text">Chọn các từ phía dưới</span>
              )}
            </div>
          </div>
          <div className="word-bank-modern">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={`word-chip ${
                  selectedWords.includes(option.optionText) ? "selected" : ""
                }`}
                onClick={() => toggleWord(option.optionText)}
              >
                {option.optionText}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === "MULTIPLE_CHOICE") {
      return (
        <div className="question-content-modern">
          <div className="question-header">
            <h2 className="question-title-modern">Chọn nghĩa đúng</h2>
          </div>
          <div className="prompt-with-image">
            {question.imageUrl && (
              <div className="character-container">
                <img
                  src={question.imageUrl}
                  alt="Character"
                  className="character-image"
                />
                <div className="speech-bubble">{question.questionText}</div>
              </div>
            )}
            {!question.imageUrl && (
              <p className="prompt-text">{question.questionText}</p>
            )}
          </div>
          <div className="choice-options">
            {question.options.map((option, index) => (
              <button
                key={option.id}
                className={`choice-button ${
                  userAnswer === option.optionText ? "selected" : ""
                }`}
                onClick={() => setUserAnswer(option.optionText)}
              >
                <span className="choice-number">{index + 1}</span>
                <span className="choice-text">{option.optionText}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === "IMAGE_MATCH") {
      return (
        <div className="question-content-modern">
          <div className="question-header">
            <span className="question-type-badge">🖼️ TỪ VỰNG MỚI</span>
            <h2 className="question-title-modern">{question.questionText}</h2>
          </div>
          <div className="image-grid">
            {question.options.map((option, index) => (
              <button
                key={option.id}
                className={`image-card ${
                  userAnswer === option.optionText ? "selected" : ""
                }`}
                onClick={() => setUserAnswer(option.optionText)}
              >
                {option.imageUrl && (
                  <div className="image-wrapper">
                    <img
                      src={option.imageUrl}
                      alt={option.optionText}
                      className="option-image-modern"
                    />
                  </div>
                )}
                <span className="image-label">{option.optionText}</span>
                <span className="choice-number-badge">{index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === "WORD_ORDER") {
      return (
        <div className="question-content-modern">
          <div className="question-header">
            <h2 className="question-title-modern">Sắp xếp từ thành câu đúng</h2>
          </div>
          <p className="prompt-text">{question.questionText}</p>
          <div className="answer-area">
            <div className="selected-words-box">
              {selectedWords.length > 0 ? (
                selectedWords.map((word, idx) => (
                  <span key={idx} className="selected-word-chip">
                    {word}
                  </span>
                ))
              ) : (
                <span className="placeholder-text">
                  Chọn các từ theo thứ tự
                </span>
              )}
            </div>
          </div>
          <div className="word-bank-modern">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={`word-chip ${
                  selectedWords.includes(option.optionText) ? "selected" : ""
                }`}
                onClick={() => toggleWord(option.optionText)}
              >
                {option.optionText}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="placement-test-container">
        <div className="loading">Đang tải câu hỏi...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="placement-test-container">
        <div className="no-questions">Không có câu hỏi nào.</div>
      </div>
    );
  }

  return (
    <div className="placement-test-container-dark">
      <div className="test-header-top">
        <button className="close-button" onClick={() => navigate(-1)}>
          ✕
        </button>
        <div className="progress-bar-top">
          <div
            className="progress-fill-top"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>
        <div className="hearts-container-top">
          <span className="heart-icon">❤️</span>
          <span className="heart-count">{hearts}</span>
        </div>
      </div>

      <div className="question-card">
        {renderQuestion()}

        <div className="bottom-section">
          {isCorrect !== null && (
            <div
              className={`feedback-banner ${
                isCorrect ? "correct" : "incorrect"
              }`}
            >
              <div className="feedback-content">
                <div className="feedback-icon">
                  {isCorrect ? (
                    <div className="check-circle">✓</div>
                  ) : (
                    <div className="x-circle">✗</div>
                  )}
                </div>
                <div className="feedback-text">
                  <h3>{isCorrect ? "Giỏi quá!" : "Đáp án đúng:"}</h3>
                  {!isCorrect && (
                    <p className="correct-answer">{correctAnswer}</p>
                  )}
                  {isCorrect && (
                    <p className="correct-message">Nghĩa là: Chào mừng.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="button-container">
            {!isChecking &&
              isCorrect === null &&
              (userAnswer || selectedWords.length > 0) && (
                <button className="reset-button" onClick={handleReset}>
                  <span className="reset-icon">↺</span>
                </button>
              )}
            {!isChecking && !isCorrect && (
              <button className="skip-button" onClick={handleNext}>
                BỎ QUA
              </button>
            )}
            <button
              className={`check-button ${
                (userAnswer || selectedWords.length > 0) && !isChecking
                  ? "active"
                  : "disabled"
              }`}
              onClick={handleCheckAnswer}
              disabled={
                (!userAnswer && selectedWords.length === 0) || isChecking
              }
            >
              {isChecking ? "..." : "KIỂM TRA"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementTestQuestions;
