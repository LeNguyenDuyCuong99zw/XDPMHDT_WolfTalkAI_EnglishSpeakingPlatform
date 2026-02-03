import React, { useState, useEffect, useRef } from "react";
import aiLearningService from "../services/aiLearningService";
import AIProviderSelector from "../components/AIProviderSelector";
import Sidebar from "../components/Sidebar";
import { AIProvider, GrammarCheckResponse } from "../types/aiLearning";

const GrammarCheckerPage: React.FC = () => {
  const [text, setText] = useState("");
  const [provider, setProvider] = useState<AIProvider>("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrammarCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  const handleCheck = async () => {
    if (!text.trim()) {
      setError("Please enter some text to check");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const userId = 1; // TODO: Get from auth context
      const response = await aiLearningService.checkGrammar(
        text,
        userId,
        provider,
      );

      // Validate AI response
      if (!response || !response.correctedText) {
        throw new Error("AI returned invalid response");
      }

      setResult(response);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to check grammar. Please try again.";
      setError(errorMsg);
      console.error("Grammar check error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 90) return "#10b981";
    if (score >= 70) return "#3b82f6";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  // Helper function to split text into sentences
  const splitIntoSentences = (text: string): string[] => {
    return text.match(/[^.!?]+[.!?]+/g) || [text];
  };

  // Extract actual error words from explanation text
  const extractErrorFromExplanation = (
    explanation: string,
  ): { incorrect: string; correct: string } | null => {
    // Pattern: "**word** should be **word**" or similar
    const match1 = explanation.match(
      /\*\*([^*]+)\*\*\s+should\s+be\s+\*\*([^*]+)\*\*/i,
    );
    if (match1) {
      return { incorrect: match1[1].trim(), correct: match1[2].trim() };
    }

    // Pattern: "Although... but" is redundant
    const match2 = explanation.match(/\*\*([^*]+)\*\*/);
    if (match2 && explanation.toLowerCase().includes("redundant")) {
      return { incorrect: match2[1].trim(), correct: "" };
    }

    return null;
  };

  // Helper function to check if a sentence has errors
  const getSentenceStatus = (
    sentence: string,
    errors: any[],
  ): "correct" | "error" => {
    const sentenceLower = sentence.toLowerCase().trim();

    // Check if sentence contains any error words mentioned in explanations
    for (const error of errors) {
      const errorInfo = extractErrorFromExplanation(error.explanation || "");
      if (errorInfo) {
        const incorrectWord = errorInfo.incorrect.toLowerCase();
        // Check if the incorrect word is in this specific sentence
        if (sentenceLower.includes(incorrectWord)) {
          return "error";
        }
      }
    }
    return "correct";
  };

  // Helper function to get errors for a specific sentence
  const getErrorsForSentence = (sentence: string, errors: any[]): any[] => {
    const sentenceLower = sentence.toLowerCase().trim();

    return errors
      .filter((error) => {
        const errorInfo = extractErrorFromExplanation(error.explanation || "");
        if (errorInfo) {
          const incorrectWord = errorInfo.incorrect.toLowerCase();
          return sentenceLower.includes(incorrectWord);
        }
        return false;
      })
      .map((error) => {
        // Enhance error with extracted words
        const errorInfo = extractErrorFromExplanation(error.explanation || "");
        return {
          ...error,
          actualIncorrect: errorInfo?.incorrect || error.incorrectText,
          actualCorrect: errorInfo?.correct || error.correctText,
        };
      });
  };

  return (
    <div className="duolingo-dashboard">
      <Sidebar />
      <div className="grammar-checker-page">
        <div className="page-header">
          <h1>✍️ Grammar Checker</h1>
          <p>Check your grammar with AI-powered assistance</p>
        </div>

        <div className="controls">
          <AIProviderSelector value={provider} onChange={setProvider} />
        </div>

        <div className="content-grid">
          {/* Input Section */}
          <div className="input-section">
            <h2>Your Text</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here to check for grammar errors..."
              className="text-input"
              rows={10}
            />
            <button
              onClick={handleCheck}
              disabled={loading || !text.trim()}
              className="check-button"
            >
              {loading ? "🔄 Checking..." : "✅ Check Grammar"}
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="results-section">
              <div className="loading-skeleton">
                <div className="skeleton-header"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && !loading && (
            <div className="results-section" ref={resultsRef}>
              {/* Sentence-by-Sentence Analysis */}
              <div className="sentence-analysis-card">
                <h2>📝 Sentence Analysis</h2>
                <div className="sentences-list">
                  {splitIntoSentences(result.originalText).map(
                    (sentence, index) => {
                      const status = getSentenceStatus(sentence, result.errors);
                      const sentenceErrors = getErrorsForSentence(
                        sentence,
                        result.errors,
                      );

                      return (
                        <div key={index} className={`sentence-item ${status}`}>
                          <div className="sentence-number">
                            Sentence {index + 1}
                          </div>
                          <div className="sentence-content">
                            {status === "correct" ? (
                              <>
                                <div className="sentence-status correct">
                                  <span className="status-icon">✓</span>
                                  <span className="status-text">Correct</span>
                                </div>
                                <div className="sentence-text correct">
                                  {sentence.trim()}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="sentence-status error">
                                  <span className="status-icon">✗</span>
                                  <span className="status-text">
                                    Has Errors
                                  </span>
                                </div>
                                <div className="sentence-text error">
                                  {sentence.trim()}
                                </div>
                                <div className="sentence-errors">
                                  {sentenceErrors.map((error, errIdx) => (
                                    <div key={errIdx} className="mini-error">
                                      <span className="error-label">
                                        ❌ {error.actualIncorrect}
                                      </span>
                                      <span className="arrow">→</span>
                                      <span className="correct-label">
                                        ✅ {error.actualCorrect}
                                      </span>
                                      {error.explanation && (
                                        <div className="mini-explanation">
                                          {error.explanation}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="corrected-text-card">
                <h2>✨ Corrected Text</h2>
                <div className="corrected-text">
                  {result.correctedText.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < result.correctedText.split("\n").length - 1 && (
                        <br />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {result.similarityScore !== undefined && (
                  <div className="similarity-score">
                    <span>Similarity Score:</span>
                    <span
                      className="score-value"
                      style={{
                        color: getSimilarityColor(result.similarityScore),
                      }}
                    >
                      {result.similarityScore.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              {result.errors.length > 0 && (
                <div className="errors-card">
                  <h2>🔍 Errors Found ({result.errors.length})</h2>
                  <div className="errors-list">
                    {result.errors.map((error, index) => {
                      const errorInfo = extractErrorFromExplanation(
                        error.explanation || "",
                      );
                      const displayIncorrect =
                        errorInfo?.incorrect || error.incorrectText;
                      const displayCorrect =
                        errorInfo?.correct || error.correctText;

                      return (
                        <div key={index} className="error-item">
                          <div className="error-number">Error #{index + 1}</div>
                          <div className="error-type-badge">
                            <span className="badge">{error.type}</span>
                          </div>
                          <div className="error-comparison">
                            <div className="comparison-row incorrect">
                              <span className="label">❌ Wrong:</span>
                              <span className="text-highlight">
                                {displayIncorrect}
                              </span>
                            </div>
                            <div className="comparison-row correct">
                              <span className="label">✅ Correct:</span>
                              <span className="text-highlight">
                                {displayCorrect || "(remove this)"}
                              </span>
                            </div>
                          </div>
                          {error.explanation && (
                            <div className="error-explanation">
                              <strong>💡 Why:</strong> {error.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div className="suggestions-card">
                  <h2>💡 Suggestions</h2>
                  <ul className="suggestions-list">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="feedback-card">
                <h2>📝 Overall Feedback</h2>
                <p>{result.overallFeedback}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        <style>{`
        * {
          scroll-behavior: smooth;
        }

        .grammar-checker-page {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 24px 32px;
          overflow-y: auto;
          overflow-x: hidden;
          height: 100vh;
          background: #f9fafb;
          
          /* Hide scrollbar but keep functionality */
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .grammar-checker-page::-webkit-scrollbar {
          width: 6px;
        }

        .grammar-checker-page::-webkit-scrollbar-track {
          background: transparent;
        }

        .grammar-checker-page::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .grammar-checker-page::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
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

        .controls {
          margin-bottom: 24px;
          display: flex;
          justify-content: flex-end;
        }

        .content-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 40px;
        }

        .input-section,
        .results-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .input-section h2,
        .results-section h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 12px 0;
        }

        .text-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .text-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .check-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .check-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .check-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .corrected-text-card,
        .errors-card,
        .suggestions-card,
        .feedback-card,
        .sentence-analysis-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .sentence-analysis-card h2 {
          margin-bottom: 16px;
        }

        .sentences-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sentence-item {
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .sentence-item.correct {
          background: #f0fdf4;
          border: 2px solid #86efac;
        }

        .sentence-item.error {
          background: #fef2f2;
          border: 2px solid #fca5a5;
        }

        .sentence-number {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sentence-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sentence-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
        }

        .sentence-status.correct {
          color: #059669;
        }

        .sentence-status.error {
          color: #dc2626;
        }

        .sentence-status .status-icon {
          font-size: 18px;
        }

        .sentence-text {
          padding: 12px;
          border-radius: 8px;
          font-size: 15px;
          line-height: 1.7;
        }

        .sentence-text.correct {
          background: #d1fae5;
          color: #065f46;
          border-left: 4px solid #059669;
        }

        .sentence-text.error {
          background: #fee2e2;
          color: #991b1b;
          border-left: 4px solid #dc2626;
        }

        .sentence-errors {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .mini-error {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
          font-size: 13px;
        }

        .error-label {
          color: #dc2626;
          font-weight: 600;
          background: #fee2e2;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .arrow {
          color: #64748b;
          font-weight: bold;
        }

        .correct-label {
          color: #059669;
          font-weight: 600;
          background: #d1fae5;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .mini-explanation {
          width: 100%;
          margin-top: 4px;
          padding: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          color: #475569;
          font-size: 12px;
          line-height: 1.5;
        }

        .corrected-text {
          padding: 16px;
          background: #f0f9ff;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.8;
          color: #1e293b;
          margin-bottom: 12px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .similarity-score {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
        }

        .score-value {
          font-size: 24px;
        }

        .errors-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .error-item {
          padding: 20px;
          background: #ffffff;
          border: 2px solid #fee2e2;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .error-item:hover {
          border-color: #fca5a5;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
        }

        .error-number {
          display: inline-block;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .error-type-badge {
          margin-bottom: 12px;
        }

        .error-type-badge .badge {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .error-comparison {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .comparison-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 8px 0;
        }

        .comparison-row .label {
          flex-shrink: 0;
          font-weight: 700;
          font-size: 14px;
          min-width: 90px;
        }

        .comparison-row.incorrect .label {
          color: #dc2626;
        }

        .comparison-row.correct .label {
          color: #059669;
        }

        .comparison-row .text-highlight {
          flex: 1;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.6;
        }

        .comparison-row.incorrect .text-highlight {
          background: #fee2e2;
          color: #991b1b;
          border-left: 3px solid #dc2626;
        }

        .comparison-row.correct .text-highlight {
          background: #d1fae5;
          color: #065f46;
          border-left: 3px solid #059669;
        }

        .error-explanation {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          padding: 12px;
          background: #f1f5f9;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .error-explanation strong {
          color: #1e293b;
        }

        .suggestions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .suggestions-list li {
          padding: 12px;
          background: #f0f9ff;
          border-left: 3px solid #3b82f6;
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #1e293b;
        }

        .feedback-card p {
          font-size: 14px;
          line-height: 1.6;
          color: #1e293b;
          margin: 0;
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

        .error-icon {
          font-size: 20px;
        }

        .loading-skeleton {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .skeleton-header {
          height: 24px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 16px;
          width: 60%;
        }

        .skeleton-text {
          height: 16px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .skeleton-text.short {
          width: 70%;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @media (max-width: 1024px) {
          .grammar-checker-page {
            margin-left: 0;
            padding: 16px;
          }
        }

        @media (max-width: 768px) {
          .grammar-checker-page {
            margin-left: 0;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default GrammarCheckerPage;
