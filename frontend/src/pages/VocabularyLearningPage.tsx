import React, { useState } from "react";
import aiLearningService from "../services/aiLearningService";
import AIProviderSelector from "../components/AIProviderSelector";
import Sidebar from "../components/Sidebar";
import { AIProvider } from "../types/aiLearning";

interface VocabularyCard {
  word: string;
  definition: string;
  example: string;
  isFlipped: boolean;
}

const VocabularyLearningPage: React.FC = () => {
  const [context, setContext] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "intermediate",
  );
  const [provider, setProvider] = useState<AIProvider>("auto");
  const [loading, setLoading] = useState(false);
  const [vocabulary, setVocabulary] = useState<VocabularyCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    if (!context.trim()) {
      setError("Please enter a context");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await aiLearningService.suggestVocabulary(
        { context, level },
        provider,
      );

      // Parse response into vocabulary cards
      const cards: VocabularyCard[] = response.map((item) => {
        // Expected format: "word | definition | example"
        const parts = item.split("|").map((p) => p.trim());
        return {
          word: parts[0] || "",
          definition: parts[1] || "",
          example: parts[2] || "",
          isFlipped: false,
        };
      });

      setVocabulary(cards);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to get suggestions. Please try again.",
      );
      console.error("Vocabulary error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (index: number) => {
    setVocabulary((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, isFlipped: !card.isFlipped } : card,
      ),
    );
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="duolingo-dashboard">
      <Sidebar />
      <div className="vocabulary-page">
        <div className="page-header">
          <h1>📚 Vocabulary Learning</h1>
          <p>Learn new words based on context with AI assistance</p>
        </div>

        <div className="controls-section">
          <div className="input-group">
            <label>Context</label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., business meeting, travel, cooking..."
              className="context-input"
            />
          </div>

          <div className="input-group">
            <label>Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="level-select"
            >
              <option value="beginner">🟢 Beginner</option>
              <option value="intermediate">🟡 Intermediate</option>
              <option value="advanced">🔴 Advanced</option>
            </select>
          </div>

          <AIProviderSelector value={provider} onChange={setProvider} />

          <button
            onClick={handleGetSuggestions}
            disabled={loading || !context.trim()}
            className="get-button"
          >
            {loading ? "🔄 Loading..." : "✨ Get Vocabulary"}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {vocabulary.length > 0 && (
          <div className="vocabulary-grid">
            {vocabulary.map((card, index) => (
              <div
                key={index}
                className={`vocab-card ${card.isFlipped ? "flipped" : ""}`}
                onClick={() => toggleFlip(index)}
              >
                <div className="card-inner">
                  {/* Front */}
                  <div className="card-front">
                    <div className="card-header">
                      <h3 className="word">{card.word}</h3>
                      <button
                        className="speak-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(card.word);
                        }}
                      >
                        🔊
                      </button>
                    </div>
                    <p className="tap-hint">Tap to see definition</p>
                  </div>

                  {/* Back */}
                  <div className="card-back">
                    <div className="definition-section">
                      <strong>Definition:</strong>
                      <p>{card.definition}</p>
                    </div>
                    <div className="example-section">
                      <strong>Example:</strong>
                      <p className="example-text">{card.example}</p>
                    </div>
                    <p className="tap-hint">Tap to flip back</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {vocabulary.length === 0 && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <h3>No vocabulary yet</h3>
            <p>Enter a context and click "Get Vocabulary" to start learning!</p>
          </div>
        )}

        <style>{`
        .vocabulary-page {
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
          color: #111827;
          margin: 0 0 8px 0;
        }

        .page-header p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .controls-section {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          align-items: flex-end;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .context-input {
          width: 300px;
          padding: 10px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .context-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .level-select {
          padding: 10px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        .get-button {
          padding: 10px 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .get-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .get-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          padding: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .vocabulary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .vocab-card {
          height: 250px;
          perspective: 1000px;
          cursor: pointer;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .vocab-card.flipped .card-inner {
          transform: rotateY(180deg);
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .card-front {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          justify-content: center;
          align-items: center;
        }

        .card-back {
          background: white;
          transform: rotateY(180deg);
          justify-content: space-between;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .word {
          font-size: 32px;
          font-weight: 700;
          margin: 0;
        }

        .speak-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .speak-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .tap-hint {
          font-size: 12px;
          opacity: 0.8;
          margin: 0;
        }

        .card-front .tap-hint {
          color: white;
        }

        .card-back .tap-hint {
          color: #9ca3af;
          text-align: center;
        }

        .definition-section,
        .example-section {
          margin-bottom: 16px;
        }

        .definition-section strong,
        .example-section strong {
          display: block;
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .definition-section p,
        .example-section p {
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
          margin: 0;
        }

        .example-text {
          font-style: italic;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #9ca3af;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          margin: 0 0 8px 0;
          color: #6b7280;
        }

        .empty-state p {
          font-size: 14px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }

          .context-input {
            width: 100%;
          }

          .vocabulary-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default VocabularyLearningPage;
