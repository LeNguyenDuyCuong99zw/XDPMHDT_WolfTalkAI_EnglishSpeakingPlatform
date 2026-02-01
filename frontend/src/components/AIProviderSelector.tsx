import React from 'react';
import { AIProvider } from '../types/aiLearning';

interface AIProviderSelectorProps {
  value: AIProvider;
  onChange: (provider: AIProvider) => void;
  className?: string;
}

const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const providers: { value: AIProvider; label: string; icon: string }[] = [
    { value: 'auto', label: 'Auto (Gemini)', icon: '🤖' },
    { value: 'gemini', label: 'Google Gemini', icon: '✨' },
  ];

  return (
    <div className={`ai-provider-selector ${className}`}>
      <label className="provider-label">AI Provider:</label>
      <div className="provider-buttons">
        {providers.map((provider) => (
          <button
            key={provider.value}
            onClick={() => onChange(provider.value)}
            className={`provider-btn ${value === provider.value ? 'active' : ''}`}
          >
            <span className="provider-icon">{provider.icon}</span>
            <span className="provider-name">{provider.label}</span>
          </button>
        ))}
      </div>
      <style>{`
        .ai-provider-selector {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .provider-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .provider-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .provider-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .provider-btn:hover {
          border-color: #3b82f6;
          background: #f9fafb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .provider-btn.active {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1e40af;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .provider-icon {
          font-size: 20px;
        }

        .provider-name {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .provider-buttons {
            flex-direction: column;
          }
          
          .provider-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AIProviderSelector;
