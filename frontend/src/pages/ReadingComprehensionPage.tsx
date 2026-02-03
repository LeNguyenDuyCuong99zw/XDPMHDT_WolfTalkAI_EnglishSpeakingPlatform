import React, { useState } from "react";
import aiLearningService from "../services/aiLearningService";
import AIProviderSelector from "../components/AIProviderSelector";
import Sidebar from "../components/Sidebar";
import { AIProvider } from "../types/aiLearning";

interface Question {
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface VocabularyItem {
  word: string;
  definition: string;
  example: string;
}

interface ReadingPassage {
  passage: string;
  questions: Question[];
  vocabulary: VocabularyItem[];
  topic: string;
  level: string;
}

const ReadingComprehensionPage: React.FC = () => {
  const [provider, setProvider] = useState<AIProvider>("auto");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "intermediate",
  );
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [loading, setLoading] = useState(false);
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setPassage(null);
    setAnswers({});
    setShowResults(false);

    try {
      const data = await aiLearningService.generateReadingPassage(
        topic || undefined,
        level,
        length,
        provider,
      );

      if (!data || !data.passage || !data.questions) {
        throw new Error("AI returned invalid passage data");
      }

      setPassage(data);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate passage";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!passage) return 0;
    let correct = 0;
    passage.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    return Math.round((correct / passage.questions.length) * 100);
  };

  return (
    <div className="duolingo-dashboard">
      <Sidebar />
      <div className="reading-page">
        <div className="page-header">
          <h1>📰 Reading Comprehension</h1>
          <p>Practice reading with AI-generated passages and questions</p>
        </div>

        <AIProviderSelector value={provider} onChange={setProvider} />

        <div className="settings-bar">
          <div className="setting-group">
            <label>Topic (optional):</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., technology, environment"
              className="setting-input"
            />
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
            <label>Length:</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value as any)}
              className="setting-select"
            >
              <option value="short">Short (~200 words)</option>
              <option value="medium">Medium (~300 words)</option>
              <option value="long">Long (~400 words)</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="generate-btn"
          >
            {loading ? "⏳ Generating..." : "✨ Generate Passage"}
          </button>
        </div>

        {passage && (
          <div className="content-grid">
            <div className="passage-section">
              <h2>📖 Reading Passage</h2>
              <div className="passage-card">
                <p>
                  {passage.passage.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < passage.passage.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              {passage.vocabulary.length > 0 && (
                <div className="vocab-card">
                  <h3>📚 Key Vocabulary</h3>
                  {passage.vocabulary.map((item, i) => (
                    <div key={i} className="vocab-item">
                      <strong>{item.word}:</strong> {item.definition}
                      <div className="vocab-example">"{item.example}"</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="questions-section">
              <h2>❓ Questions</h2>
              {passage.questions.map((q, i) => (
                <div key={i} className="question-card">
                  <h4>Question {i + 1}</h4>
                  <p>{q.question}</p>

                  {q.type === "multiple_choice" && q.options && (
                    <div className="options">
                      {q.options.map((opt, j) => (
                        <label key={j} className="option-label">
                          <input
                            type="radio"
                            name={`q${i}`}
                            value={opt}
                            checked={answers[i] === opt}
                            onChange={() =>
                              setAnswers({ ...answers, [i]: opt })
                            }
                            disabled={showResults}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {showResults && (
                    <div
                      className={`result ${answers[i] === q.correctAnswer ? "correct" : "incorrect"}`}
                    >
                      {answers[i] === q.correctAnswer
                        ? "✅ Correct!"
                        : `❌ Incorrect. Answer: ${q.correctAnswer}`}
                      <div className="explanation">{q.explanation}</div>
                    </div>
                  )}
                </div>
              ))}

              {!showResults ? (
                <button onClick={handleSubmit} className="submit-btn">
                  📝 Submit Answers
                </button>
              ) : (
                <div className="score-banner">
                  <h3>Your Score: {calculateScore()}%</h3>
                  <button onClick={handleGenerate} className="retry-btn">
                    🔄 Try Another Passage
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <style>{`
        .reading-page {
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

        .setting-select,
        .setting-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .setting-input {
          width: 250px;
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

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .passage-card,
        .vocab-card,
        .question-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .passage-card {
          background: #f0f9ff;
        }

        .passage-card p {
          line-height: 1.8;
          color: #1e293b;
          font-size: 16px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .vocab-card {
          margin-top: 16px;
        }

        .vocab-card h3 {
          margin: 0 0 16px 0;
          color: #1e293b;
        }

        .vocab-item {
          margin-bottom: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .vocab-example {
          margin-top: 4px;
          font-style: italic;
          color: #6b7280;
          font-size: 14px;
        }

        .questions-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .question-card h4 {
          margin: 0 0 8px 0;
          color: #3b82f6;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
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
        }

        .submit-btn,
        .retry-btn {
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
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }

        .score-banner h3 {
          margin: 0 0 16px 0;
          color: #1e40af;
          font-size: 24px;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default ReadingComprehensionPage;
