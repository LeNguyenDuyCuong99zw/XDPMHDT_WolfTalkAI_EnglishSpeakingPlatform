import React, { useState } from 'react';
import aiLearningService from '../services/aiLearningService';
import AIProviderSelector from '../components/AIProviderSelector';
import { AIProvider, GrammarCheckResponse } from '../types/aiLearning';

const GrammarCheckerPage: React.FC = () => {
  const [text, setText] = useState('');
  const [provider, setProvider] = useState<AIProvider>('auto');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrammarCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) {
      setError('Please enter some text to check');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = 1; // TODO: Get from auth context
      const response = await aiLearningService.checkGrammar(text, userId, provider);
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check grammar. Please try again.');
      console.error('Grammar check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
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
            {loading ? '🔄 Checking...' : '✅ Check Grammar'}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="results-section">
            <div className="corrected-text-card">
              <h2>✨ Corrected Text</h2>
              <div className="corrected-text">{result.correctedText}</div>
              {result.similarityScore !== undefined && (
                <div className="similarity-score">
                  <span>Similarity Score:</span>
                  <span
                    className="score-value"
                    style={{ color: getSimilarityColor(result.similarityScore) }}
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
                  {result.errors.map((error, index) => (
                    <div key={index} className="error-item">
                      <div className="error-header">
                        <span className="error-type">{error.type}</span>
                        <span className="error-position">Position: {error.position}</span>
                      </div>
                      <div className="error-content">
                        <div className="error-original">
                          ❌ <strong>Original:</strong> {error.incorrectText}
                        </div>
                        <div className="error-correction">
                          ✅ <strong>Correction:</strong> {error.correctText}
                        </div>
                      </div>
                      <div className="error-explanation">{error.explanation}</div>
                    </div>
                  ))}
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
        .grammar-checker-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
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
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .input-section,
        .results-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-section h2,
        .results-section h2 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
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
          color: white;
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
        .feedback-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .corrected-text {
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.6;
          color: #111827;
          margin-bottom: 12px;
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
          gap: 12px;
        }

        .error-item {
          padding: 16px;
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          border-radius: 8px;
        }

        .error-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .error-type {
          font-weight: 600;
          color: #dc2626;
          text-transform: capitalize;
        }

        .error-position {
          font-size: 12px;
          color: #6b7280;
        }

        .error-content {
          margin-bottom: 8px;
        }

        .error-original,
        .error-correction {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .error-explanation {
          font-size: 13px;
          color: #6b7280;
          font-style: italic;
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
        }

        .feedback-card p {
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
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

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default GrammarCheckerPage;
