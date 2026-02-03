import React, { useState } from "react";
import aiLearningService from "../services/aiLearningService";
import AIProviderSelector from "../components/AIProviderSelector";
import Sidebar from "../components/Sidebar";
import { AIProvider } from "../types/aiLearning";

interface WritingAnalysisResponse {
  originalText: string;
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: {
    vocabulary: string[];
    grammar: string[];
    structure: string[];
  };
  overallFeedback: string;
  correctedText: string;
}

const WritingPracticePage: React.FC = () => {
  const [text, setText] = useState("");
  const [provider, setProvider] = useState<AIProvider>("auto");
  const [type, setType] = useState<"essay" | "email" | "article">("essay");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WritingAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatingPrompt, setGeneratingPrompt] = useState(false);

  const handleGeneratePrompt = async () => {
    setGeneratingPrompt(true);
    setError(null);

    try {
      const generated = await aiLearningService.generateWritingPrompt(
        type,
        topic || undefined,
        "intermediate",
        provider,
      );

      if (!generated || generated.trim() === "") {
        throw new Error("AI returned empty prompt");
      }

      setPrompt(generated);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate prompt";
      setError(errorMsg);
    } finally {
      setGeneratingPrompt(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await aiLearningService.analyzeWriting(
        text,
        type,
        topic,
        provider,
      );

      if (!response || !response.overallFeedback) {
        throw new Error("AI returned invalid analysis");
      }

      setResult(response);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to analyze writing";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10b981";
    if (score >= 75) return "#3b82f6";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="duolingo-dashboard">
      <Sidebar />
      <div className="writing-practice-page">
        <div className="page-header">
          <h1>📝 Writing Practice</h1>
          <p>Improve your writing skills with AI-powered feedback</p>
        </div>

        <AIProviderSelector value={provider} onChange={setProvider} />

        <div className="settings-bar">
          <div className="setting-group">
            <label>Writing Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="setting-select"
            >
              <option value="essay">Essay</option>
              <option value="email">Email</option>
              <option value="article">Article</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Topic (optional):</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., climate change"
              className="setting-input"
            />
          </div>

          <button
            onClick={handleGeneratePrompt}
            disabled={generatingPrompt}
            className="generate-btn"
          >
            {generatingPrompt ? "⏳ Generating..." : "✨ Generate Prompt"}
          </button>
        </div>

        {prompt && (
          <div className="prompt-card">
            <h3>📋 Writing Prompt:</h3>
            <p>{prompt}</p>
          </div>
        )}

        <div className="content-grid">
          <div className="editor-section">
            <h2>Your Writing</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing here..."
              className="writing-editor"
              rows={15}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="analyze-btn"
            >
              {loading ? "🔄 Analyzing..." : "🎯 Analyze Writing"}
            </button>
          </div>

          {result && (
            <div className="results-section">
              <div className="score-card">
                <h2>Overall Score</h2>
                <div
                  className="score-circle"
                  style={{ borderColor: getScoreColor(result.score) }}
                >
                  <span
                    className="score-value"
                    style={{ color: getScoreColor(result.score) }}
                  >
                    {result.score}
                  </span>
                  <span className="score-label">/100</span>
                </div>
              </div>

              <div className="feedback-card">
                <h3>💪 Strengths</h3>
                <ul>
                  {result.strengths.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="feedback-card">
                <h3>📈 Areas to Improve</h3>
                <ul>
                  {result.improvements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="suggestions-card">
                <h3>💡 Suggestions</h3>
                {Object.entries(result.suggestions).map(([category, items]) => (
                  <div key={category} className="suggestion-category">
                    <h4>
                      {category.charAt(0).toUpperCase() + category.slice(1)}:
                    </h4>
                    <ul>
                      {items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="feedback-card">
                <h3>📝 Overall Feedback</h3>
                <p>
                  {result.overallFeedback.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < result.overallFeedback.split("\n").length - 1 && (
                        <br />
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}
        </div>

        <style>{`
        .writing-practice-page {
          flex: 1;
          padding: 24px 32px;
          overflow-y: auto;
          overflow-x: hidden;
          height: 100vh;
          background: #f9fafb;
        }

        .page-header {
          margin-bottom: 24px;
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
          margin: 0;
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
          width: 200px;
        }

        .generate-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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

        .prompt-card {
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .prompt-card h3 {
          margin: 0 0 8px 0;
          color: #1e40af;
        }

        .prompt-card p {
          margin: 0;
          color: #1e293b;
          line-height: 1.8;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .editor-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .writing-editor {
          width: 100%;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }

        .writing-editor:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .analyze-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .analyze-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .results-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .score-card,
        .feedback-card,
        .suggestions-card {
          background: white;
          border-radius: 1px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border: 8px solid;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 16px auto;
        }

        .score-value {
          font-size: 36px;
          font-weight: 700;
        }

        .score-label {
          font-size: 14px;
          color: #6b7280;
        }

        .feedback-card h3,
        .suggestions-card h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
        }

        .feedback-card ul,
        .suggestions-card ul {
          margin: 0;
          padding-left: 20px;
        }

        .feedback-card li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .suggestion-category {
          margin-bottom: 12px;
        }

        .suggestion-category h4 {
          margin: 0 0 8px 0;
          color: #3b82f6;
          font-size: 14px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .error-message {
          grid-column: 1 / -1;
          padding: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 8px;
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

export default WritingPracticePage;
