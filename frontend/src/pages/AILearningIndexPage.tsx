import React from 'react';
import { Link } from 'react-router-dom';

const AILearningIndexPage: React.FC = () => {
  const features = [
    {
      path: '/ai/grammar',
      icon: '✍️',
      title: 'Grammar Checker',
      description: 'Check your grammar with AI assistance and get detailed feedback',
      color: '#3b82f6',
    },
    {
      path: '/ai/conversation',
      icon: '💬',
      title: 'AI Conversation',
      description: 'Practice conversations with AI at different difficulty levels',
      color: '#10b981',
    },
    {
      path: '/ai/vocabulary',
      icon: '📚',
      title: 'Vocabulary Learning',
      description: 'Learn new words with context-based flashcards and AI examples',
      color: '#f59e0b',
    },
    {
      path: '/ai/writing',
      icon: '📝',
      title: 'Writing Practice',
      description: 'Write essays and emails, get AI scoring and detailed feedback',
      color: '#8b5cf6',
    },
    {
      path: '/ai/reading',
      icon: '📰',
      title: 'Reading Comprehension',
      description: 'Practice reading with AI-generated passages and questions',
      color: '#ec4899',
    },
    {
      path: '/ai/exercises',
      icon: '📋',
      title: 'Grammar Exercises',
      description: 'Solve AI-generated grammar exercises by topic with instant feedback',
      color: '#14b8a6',
    },
  ];

  return (
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
            style={{ borderTopColor: feature.color }}
          >
            <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
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
        <p>Choose your preferred AI or let the system automatically select the best one for you!</p>
      </div>

      <style>{`
        .ai-index-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .hero-section h1 {
          font-size: 56px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 16px 0;
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
          color: #3b82f6;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .feature-card {
          background: white;
          border-radius: 16px;
          border-top: 4px solid;
          padding: 32px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin-bottom: 20px;
        }

        .feature-card h2 {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 12px 0;
        }

        .feature-card p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
          flex: 1;
        }

        .card-footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #f3f4f6;
        }

        .try-btn {
          font-weight: 600;
          font-size: 14px;
          transition: transform 0.2s;
          display: inline-block;
        }

        .feature-card:hover .try-btn {
          transform: translateX(4px);
        }

        .ai-info-section {
          background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
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
          gap: 8px;
          padding: 12px 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-weight: 600;
          color: #374151;
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

