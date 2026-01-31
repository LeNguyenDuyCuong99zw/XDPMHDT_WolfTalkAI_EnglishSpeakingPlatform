import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { InitialAssessmentQuestion } from "../services/initialAssessmentAPI";
import { initialAssessmentAPI } from "../services/initialAssessmentAPI";
import logoWolf from "../assets/wolftalk/logo_wolf.png";
import "./InitialAssessment.css";

/* eslint-disable @typescript-eslint/no-explicit-any */

const InitialAssessmentQuestions: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<InitialAssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio & Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [audioPhase, setAudioPhase] = useState<"question" | "content" | null>(
    null,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<unknown>(null);

  const handleGoBack = () => {
    navigate("/initial-assessment", { replace: true });
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    const windowObj = window as any;
    const SpeechRecognition =
      windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current as any;

    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log("Speech recognized:", transcript);
        setRecordedAudio(transcript);
        setSelectedAnswers((prev: any) => ({
          ...prev,
          [currentQuestion?.id]: transcript,
        }));
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        (recognitionRef.current as any).stop?.();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [initializeSpeechRecognition]);

  // Load questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (!assessmentId) {
          setError("Invalid assessment ID");
          return;
        }

        const qs = await initialAssessmentAPI.getQuestions(
          parseInt(assessmentId),
        );
        setQuestions(qs);
      } catch (err) {
        setError((err as Error).message || "Failed to load questions");
        console.error("Error loading questions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [assessmentId]);

  // Play audio for LISTENING questions - Sequential playback
  const playAudio = async (
    questionText?: string,
    audioUrl?: string,
    phase: "question" | "content" = "question",
  ) => {
    try {
      setIsPlayingAudio(true);
      setAudioPhase(phase);

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Determine what text to play
      let textToPlay = questionText;

      if (phase === "content" && audioUrl && !audioUrl.startsWith("/")) {
        // Play content from audioUrl (the listening audio text)
        textToPlay = audioUrl;
      }

      // If audioUrl is a file path, use it directly
      if (audioUrl && audioUrl.startsWith("/audio/")) {
        const fullUrl = `http://localhost:8080${audioUrl}`;
        console.log("Playing audio from URL:", fullUrl);
        audioRef.current = new Audio(fullUrl);
        audioRef.current.volume = 1.0;

        audioRef.current.onended = () => {
          setIsPlayingAudio(false);
          setAudioPhase(null);
        };
        audioRef.current.onerror = (e) => {
          console.error("Audio playback error:", e);
          setIsPlayingAudio(false);
          setAudioPhase(null);
          // Fallback to browser TTS
          if (textToPlay) {
            playBrowserTTS(textToPlay);
          }
        };

        await audioRef.current.play();
        return;
      }

      // Otherwise, use TTS API to generate audio
      if (textToPlay) {
        console.log(`Generating audio for ${phase}:`, textToPlay);
        const token = localStorage.getItem("accessToken");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `http://localhost:8080/api/audio/generate?text=${encodeURIComponent(
            textToPlay,
          )}&lang=en-US`,
          {
            method: "GET",
            headers: headers,
            credentials: "omit",
          },
        );

        // If TTS service not configured (503), use browser fallback
        if (response.status === 503) {
          console.log("Backend TTS not available, using browser TTS");
          playBrowserTTS(textToPlay);
          return;
        }

        if (!response.ok) {
          console.error("Audio generation failed:", response.status);
          playBrowserTTS(textToPlay);
          return;
        }

        const audioBlob = await response.blob();
        console.log("Audio blob received:", audioBlob.size, "bytes");

        if (audioBlob.size === 0) {
          console.log("Empty audio blob, using browser TTS");
          playBrowserTTS(textToPlay);
          return;
        }

        const audioObjectUrl = URL.createObjectURL(audioBlob);
        audioRef.current = new Audio(audioObjectUrl);
        audioRef.current.volume = 1.0;

        audioRef.current.onended = () => {
          setIsPlayingAudio(false);
          setAudioPhase(null);
          URL.revokeObjectURL(audioObjectUrl);
        };

        audioRef.current.onerror = (e) => {
          console.error("Audio playback error:", e);
          setIsPlayingAudio(false);
          setAudioPhase(null);
          URL.revokeObjectURL(audioObjectUrl);
          playBrowserTTS(textToPlay);
        };

        await audioRef.current.play();
        console.log("Audio playing successfully");
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
      setAudioPhase(null);

      // Fallback to browser TTS
      if (questionText) {
        console.log("Error occurred, falling back to browser TTS");
        playBrowserTTS(questionText);
      }
    }
  };

  // Browser's built-in Text-to-Speech (fallback)
  const playBrowserTTS = (text: string | undefined) => {
    try {
      if (!text || !("speechSynthesis" in window)) {
        console.error("Browser TTS not supported");
        setIsPlayingAudio(false);
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en-") ||
          voice.lang === "en" ||
          voice.name.includes("English"),
      );

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => {
        console.log("Browser TTS started:", text);
        setIsPlayingAudio(true);
      };

      utterance.onend = () => {
        console.log("Browser TTS ended");
        setIsPlayingAudio(false);
      };

      utterance.onerror = (event) => {
        console.error("Browser TTS error:", event);
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error with browser TTS:", error);
      setIsPlayingAudio(false);
    }
  };

  // Handle microphone recording for SPEAKING questions
  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      setRecordedAudio(null);
      (recognitionRef.current as any).start?.();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      (recognitionRef.current as any).stop?.();
      setIsRecording(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = async () => {
    // For SPEAKING questions, validate recording
    if (currentQuestion.answerFormat === "SPEAKING_RECORD") {
      if (!recordedAudio) {
        alert("Vui lòng ghi âm câu trả lời trước khi tiếp tục!");
        return;
      }
    } else {
      // For MULTIPLE_CHOICE questions
      if (!selectedAnswers[currentQuestion.id]) {
        alert("Vui lòng chọn một câu trả lời trước khi tiếp tục!");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      // Submit current answer
      await initialAssessmentAPI.submitAnswer({
        assessmentId: parseInt(assessmentId!),
        questionId: currentQuestion.id,
        answer: selectedAnswers[currentQuestion.id] || recordedAudio || "",
      });

      // Reset recording
      setRecordedAudio(null);

      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions answered, complete test
        completeTest();
      }
    } catch (err) {
      setError((err as Error).message || "Failed to submit answer");
      console.error("Error submitting answer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeTest = async () => {
    try {
      setIsSubmitting(true);
      await initialAssessmentAPI.completeTest(parseInt(assessmentId!));
      // Navigate to completion page
      navigate(`/initial-assessment/${assessmentId}/complete`);
    } catch (err) {
      setError((err as Error).message || "Failed to complete test");
      console.error("Error completing test:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="initial-assessment-container-dark">
        <div className="initial-assessment-card initial-assessment-step">
          <div className="wolf-mascot-large">
            <img
              src={logoWolf}
              alt="WolfTalk Logo"
              className="wolf-logo-image"
            />
          </div>
          <p>Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="initial-assessment-container-dark">
        <div className="initial-assessment-card initial-assessment-step">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <h2>Lỗi</h2>
            <p>{error}</p>
            <button
              className="btn-retry"
              onClick={() => window.location.reload()}
            >
              Thử Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="initial-assessment-container-dark">
        <div className="initial-assessment-card initial-assessment-step">
          <p>Không có câu hỏi nào.</p>
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
      <div className="initial-assessment-card initial-assessment-step">
        {/* Progress Section */}
        <div className="assessment-progress-section">
          <div className="progress-header">
            <span className="progress-text">
              Câu hỏi {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="answers-count">
              Đã trả lời: {answeredCount}/{questions.length}
            </span>
          </div>
          <div className="progress-bar">
            {/* Dynamic width for progress - intentional inline style */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <div
              className="progress-fill"
              style={{ width: `${progress}%` } as any}
            />
          </div>
        </div>

        {/* Question Section */}
        <div className="question-content">
          <div className="skill-badge">{currentQuestion.skillType}</div>

          <h2 className="question-text">{currentQuestion.questionText}</h2>

          {/* Audio player for LISTENING questions */}
          {currentQuestion.skillType === "LISTENING" && (
            <div className="listening-section">
              <button
                className={`btn-play-audio ${
                  isPlayingAudio && audioPhase === "question" ? "playing" : ""
                }`}
                onClick={() =>
                  playAudio(
                    currentQuestion.questionText,
                    currentQuestion.audioUrl,
                    "question",
                  )
                }
                disabled={isPlayingAudio || isSubmitting}
                title="Nhấp để nghe câu hỏi"
              >
                <span className="audio-icon">🔊</span>
                {isPlayingAudio && audioPhase === "question"
                  ? "Đang phát câu hỏi..."
                  : "Nghe câu hỏi"}
              </button>

              {currentQuestion.audioUrl &&
                !currentQuestion.audioUrl.startsWith("/audio/") && (
                  <button
                    className={`btn-play-audio ${
                      isPlayingAudio && audioPhase === "content"
                        ? "playing"
                        : ""
                    }`}
                    onClick={() =>
                      playAudio(
                        currentQuestion.questionText,
                        currentQuestion.audioUrl,
                        "content",
                      )
                    }
                    disabled={isPlayingAudio || isSubmitting}
                    title="Nhấp để nghe nội dung"
                  >
                    <span className="audio-icon">🔊</span>
                    {isPlayingAudio && audioPhase === "content"
                      ? "Đang phát nội dung..."
                      : "Phát lại nội dung"}
                  </button>
                )}
            </div>
          )}

          {currentQuestion.imageUrl && (
            <div className="question-image">
              <img src={currentQuestion.imageUrl} alt="Question" />
            </div>
          )}

          {/* SPEAKING_RECORD handler */}
          {currentQuestion.answerFormat === "SPEAKING_RECORD" && (
            <div className="speaking-section">
              <div className="recording-controls">
                {!isRecording ? (
                  <button
                    className="btn-record"
                    onClick={startRecording}
                    disabled={isSubmitting || isPlayingAudio}
                    title="Nhấp để bắt đầu ghi âm"
                  >
                    <span className="record-icon">🎤</span>
                    Bắt đầu ghi âm
                  </button>
                ) : (
                  <button
                    className="btn-record recording"
                    onClick={stopRecording}
                    title="Nhấp để kết thúc ghi âm"
                  >
                    <span className="record-icon recording-pulse">🎤</span>
                    Dừng ghi âm
                  </button>
                )}
              </div>
              {recordedAudio && (
                <div className="recorded-text">
                  <p>
                    <strong>Câu trả lời:</strong> {recordedAudio}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Multiple Choice Options */}
          {currentQuestion.options &&
            Array.isArray(currentQuestion.options) &&
            currentQuestion.options.length > 0 && (
              <div className="options-container">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${
                      selectedAnswers[currentQuestion.id] === option
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={isSubmitting}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button
            className="btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || isSubmitting}
          >
            ← Trước
          </button>

          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={isSubmitting || !selectedAnswers[currentQuestion.id]}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : currentQuestionIndex === questions.length - 1
                ? "Hoàn Thành"
                : "Tiếp Tục →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialAssessmentQuestions;
