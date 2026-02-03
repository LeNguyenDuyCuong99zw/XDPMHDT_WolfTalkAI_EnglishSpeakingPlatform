import React, { useState } from "react";
import aiLearningService from "../services/aiLearningService";
import AIProviderSelector from "../components/AIProviderSelector";
import Sidebar from "../components/Sidebar";
import { AIProvider } from "../types/aiLearning";

interface Exercise {
  id: number;
  type: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  options?: string[];
}

interface ExerciseSet {
  topic: string;
  level: string;
  exercises: Exercise[];
}

const GrammarExercisesPage: React.FC = () => {
  const [provider, setProvider] = useState<AIProvider>("auto");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "intermediate",
  );
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [exerciseSet, setExerciseSet] = useState<ExerciseSet | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const grammarTopics = [
    "Present Simple",
    "Past Simple",
    "Present Perfect",
    "Future Tenses",
    "Conditionals",
    "Passive Voice",
    "Modal Verbs",
    "Prepositions",
    "Articles",
    "Relative Clauses",
  ];

  const handleGenerate = async () => {
    if (!topic) {
      alert("Please select a topic");
      return;
    }

    setLoading(true);
    setExerciseSet(null);
    setAnswers({});
    setShowResults(false);

    try {
      const data = await aiLearningService.generateGrammarExercises(
        topic,
        level,
        count,
        provider,
      );

      if (!data || !data.exercises || data.exercises.length === 0) {
        throw new Error("AI returned invalid exercises");
      }

      setExerciseSet(data);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate exercises";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!exerciseSet) return 0;
    let correct = 0;
    exerciseSet.exercises.forEach((ex) => {
      if (answers[ex.id] === ex.correctAnswer) correct++;
    });
    return Math.round((correct / exerciseSet.exercises.length) * 100);
  };

  return (
    <div className="duolingo-dashboard">
      <Sidebar />
      <div className="exercises-page">
        <div className="page-header">
          <h1>📚 Grammar Exercises</h1>
          <p>Practice grammar with AI-generated exercises</p>
        </div>

        <AIProviderSelector value={provider} onChange={setProvider} />

        <div className="settings-bar">
          <div className="setting-group">
            <label>Grammar Topic:</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="setting-select"
            >
              <option value="">Select a topic...</option>
              {grammarTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label>Level:</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="setting-select"
            >
              <option value="beginner">🟢 Beginner</option>
              <option value="intermediate">🟡 Intermediate</option>
              <option value="advanced">🔴 Advanced</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Number of Exercises:</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="setting-select"
            >
              <option value={5}>5 exercises</option>
              <option value={10}>10 exercises</option>
              <option value={15}>15 exercises</option>
              <option value={20}>20 exercises</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="generate-btn"
          >
            {loading ? "⏳ Generating..." : "✨ Generate Exercises"}
          </button>
        </div>

        {exerciseSet && (
          <div className="exercises-container">
            <div className="exercises-header">
              <h2>
                📝 {exerciseSet.topic} - {exerciseSet.level} Level
              </h2>
              <p>{exerciseSet.exercises.length} Exercises</p>
            </div>

            <div className="exercises-list">
              {exerciseSet.exercises.map((ex) => (
                <div key={ex.id} className="exercise-card">
                  <div className="exercise-header">
                    <span className="exercise-number">Exercise {ex.id}</span>
                    <span className="exercise-type">
                      {ex.type.replace("_", " ")}
                    </span>
                  </div>

                  <p className="exercise-question">{ex.question}</p>

                  {ex.type === "multiple_choice" && ex.options && (
                    <div className="options">
                      {ex.options.map((opt, i) => (
                        <label key={i} className="option-label">
                          <input
                            type="radio"
                            name={`ex${ex.id}`}
                            value={opt}
                            checked={answers[ex.id] === opt}
                            onChange={() =>
                              setAnswers({ ...answers, [ex.id]: opt })
                            }
                            disabled={showResults}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {ex.type === "fill_blank" && (
                    <input
                      type="text"
                      value={answers[ex.id] || ""}
                      onChange={(e) =>
                        setAnswers({ ...answers, [ex.id]: e.target.value })
                      }
                      placeholder="Your answer..."
                      className="answer-input"
                      disabled={showResults}
                    />
                  )}

                  {showResults && (
                    <div
                      className={`result ${answers[ex.id] === ex.correctAnswer ? "correct" : "incorrect"}`}
                    >
                      {answers[ex.id] === ex.correctAnswer ? (
                        "✅ Correct!"
                      ) : (
                        <>
                          ❌ Incorrect. Correct answer:{" "}
                          <strong>{ex.correctAnswer}</strong>
                        </>
                      )}
                      <div className="explanation">💡 {ex.explanation}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showResults ? (
              <button onClick={handleSubmit} className="submit-btn">
                📝 Submit Answers
              </button>
            ) : (
              <div className="score-banner">
                <h3>Your Score: {calculateScore()}%</h3>
                <p>
                  {calculateScore() >= 80
                    ? "🎉 Excellent work!"
                    : calculateScore() >= 60
                      ? "👍 Good job! Keep practicing."
                      : "💪 Keep practicing to improve!"}
                </p>
                <button onClick={handleGenerate} className="retry-btn">
                  🔄 Try More Exercises
                </button>
              </div>
            )}
          </div>
        )}

        <style>{`
        .exercises-page {
          flex: 1;
          padding: 24px 32px;
          overflow-y: auto;
          overflow-x: hidden;
          height: 100vh;
          background: #f9fafb;
        }

        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .page-header p {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 24px 0;
        }

        .settings-bar {
          display: flex;
          gap: 16px;
          margin: 24px 0;
          flex-wrap: wrap;
          align-items: flex-end;
        }

        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .setting-group label {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .setting-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          min-width: 180px;
        }

        .generate-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .exercises-container {
          margin-top: 24px;
        }

        .exercises-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .exercises-header h2 {
          margin: 0 0 8px 0;
          color: #1e293b;
        }

        .exercises-header p {
          margin: 0;
          color: #6b7280;
        }

        .exercises-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .exercise-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .exercise-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .exercise-number {
          font-weight: 600;
          color: #3b82f6;
        }

        .exercise-type {
          font-size: 12px;
          padding: 4px 8px;
          background: #f3f4f6;
          border-radius: 4px;
          color: #6b7280;
          text-transform: capitalize;
        }

        .exercise-question {
          font-size: 16px;
          color: #1e293b;
          margin: 0 0 16px 0;
          font-weight: 500;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .option-label {
          padding: 12px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-label:hover {
          background: #f3f4f6;
          border-color: #3b82f6;
        }

        .option-label input {
          margin-right: 8px;
        }

        .answer-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .answer-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .result {
          margin-top: 12px;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
        }

        .result.correct {
          background: #d1fae5;
          color: #065f46;
        }

        .result.incorrect {
          background: #fee2e2;
          color: #991b1b;
        }

        .explanation {
          margin-top: 8px;
          font-weight: normal;
          font-size: 14px;
          color: #374151;
        }

        .submit-btn,
        .retry-btn {
          width: 100%;
          padding: 12px 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .submit-btn:hover,
        .retry-btn:hover {
          transform: translateY(-2px);
        }

        .score-banner {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          padding: 24px;
          border-radius: 12px;
          text-align: center;
        }

        .score-banner h3 {
          margin: 0 0 8px 0;
          color: #1e40af;
          font-size: 28px;
        }

        .score-banner p {
          margin: 0 0 16px 0;
          color: #374151;
          font-size: 16px;
        }
      `}</style>
      </div>
    </div>
  );
};

export default GrammarExercisesPage;
