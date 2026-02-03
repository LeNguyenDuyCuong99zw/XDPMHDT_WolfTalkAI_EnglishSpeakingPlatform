import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AILearningIndexPage: React.FC = () => {
  const features = [
    {
      path: "/ai/grammar",
      icon: "✍️",
      title: "Grammar Checker",
      description:
        "Check your grammar with AI assistance and get detailed feedback",
      color: "#3b82f6",
    },
    {
      path: "/ai/conversation",
      icon: "💬",
      title: "AI Conversation",
      description:
        "Practice conversations with AI at different difficulty levels",
      color: "#10b981",
    },
    {
      path: "/ai/vocabulary",
      icon: "📚",
      title: "Vocabulary Learning",
      description:
        "Learn new words with context-based flashcards and AI examples",
      color: "#f59e0b",
    },
    {
      path: "/ai/writing",
      icon: "📝",
      title: "Writing Practice",
      description:
        "Write essays and emails, get AI scoring and detailed feedback",
      color: "#8b5cf6",
    },
    {
      path: "/ai/reading",
      icon: "📰",
      title: "Reading Comprehension",
      description: "Practice reading with AI-generated passages and questions",
      color: "#ec4899",
    },
    {
      path: "/ai/exercises",
      icon: "📋",
      title: "Grammar Exercises",
      description:
        "Solve AI-generated grammar exercises by topic with instant feedback",
      color: "#14b8a6",
    },
  ];

  return (
    <div className="duolingo-dashboard">
      <Sidebar />
      <div className="ai-index-page">
        <div className="hero-section">
          <h1>🤖 AI-Powered Learning</h1>
          <p>Master English with cutting-edge artificial intelligence</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">6+</span>
              <span className="stat-label">AI Features</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">AI Providers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="feature-card"
              style={
                {
                  "--card-color": feature.color,
                  "--card-color-light": `${feature.color}40`,
                } as React.CSSProperties
              }
            >
              <div
                className="feature-icon"
                style={{
                  background: `${feature.color}20`,
                  color: feature.color,
                }}
              >
                {feature.icon}
              </div>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
              <div className="card-footer">
                <span className="try-btn" style={{ color: feature.color }}>
                  Try Now →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="ai-info-section">
          <h2>🚀 Powered by Advanced AI</h2>
          <div className="ai-providers">
            <div className="provider-badge">
              <span>✨</span>
              <span>Google Gemini Pro</span>
            </div>
            <div className="provider-badge">
              <span>🤖</span>
              <span>Auto-Select</span>
            </div>
          </div>
          <p>
            Choose your preferred AI or let the system automatically select the
            best one for you!
          </p>
        </div>
      </div>

      <style>{`
        .ai-index-page {
          flex: 1;
          overflow-y: auto;
          padding: 48px 24px;
          background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 50%, #fff5f5 100%);
        }

        .ai-index-page > * {
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .hero-section h1 {
          font-size: 56px;
          font-weight: 800;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 25%, #c44569 50%, #a8385d 75%, #7c2d57 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .hero-section p {
          font-size: 20px;
          color: #6b7280;
          margin: 0 0 32px 0;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #ff6b6b, #c44569);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }

        .feature-card {
          background: white;
          border-radius: 16px;
          border: 2px solid transparent;
          background-clip: padding-box;
          padding: 24px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--card-color), var(--card-color-light));
          opacity: 0.8;
        }

        .feature-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
          border-color: var(--card-color);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin-bottom: 18px;
          transition: transform 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .feature-card h2 {
          font-size: 19px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 10px 0;
          letter-spacing: -0.3px;
        }

        .feature-card p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
          flex: 1;
        }

        .card-footer {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
        }

        .try-btn {
          font-weight: 600;
          font-size: 13px;
          transition: transform 0.2s;
          display: inline-block;
        }

        .feature-card:hover .try-btn {
          transform: translateX(4px);
        }

        .ai-info-section {
          background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 50%, #ffd4d4 100%);
          border-radius: 24px;
          padding: 48px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(255, 107, 107, 0.1);
          border: 2px solid rgba(255, 107, 107, 0.1);
        }

        .ai-info-section h2 {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 24px 0;
        }

        .ai-providers {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .provider-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.15);
          font-weight: 600;
          color: #374151;
          border: 2px solid rgba(255, 107, 107, 0.2);
          transition: all 0.3s ease;
        }

        .provider-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 107, 107, 0.25);
        }

        .provider-badge span:first-child {
          font-size: 20px;
        }

        .ai-info-section p {
          color: #6b7280;
          margin: 0;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 36px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .hero-stats {
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default AILearningIndexPage;
