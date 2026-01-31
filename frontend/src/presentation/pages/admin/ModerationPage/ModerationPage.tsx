import React from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Star,
  Flag,
  Eye,
  Clock,
  TrendingUp,
} from "lucide-react";
import "./ModerationPage.css";

export const ModerationPage: React.FC = () => {
  const features = [
    {
      icon: <MessageSquare size={24} strokeWidth={2} />,
      title: "Review Comments",
      description: "Moderate user comments and feedback",
      color: "#0056D2",
    },
    {
      icon: <Star size={24} strokeWidth={2} />,
      title: "Rating Reviews",
      description: "Approve or reject user ratings",
      color: "#f59e0b",
    },
    {
      icon: <Flag size={24} strokeWidth={2} />,
      title: "Flagged Content",
      description: "Handle reported inappropriate content",
      color: "#ef4444",
    },
    {
      icon: <Eye size={24} strokeWidth={2} />,
      title: "Content Preview",
      description: "Preview before publishing",
      color: "#8b5cf6",
    },
    {
      icon: <CheckCircle size={24} strokeWidth={2} />,
      title: "Auto-Approval",
      description: "Set rules for automatic approval",
      color: "#22c55e",
    },
    {
      icon: <TrendingUp size={24} strokeWidth={2} />,
      title: "Analytics",
      description: "Track moderation metrics",
      color: "#06b6d4",
    },
  ];

  return (
    <div className="moderation-page">
      {/* Header */}
      <div className="moderation-page__header">
        <div className="moderation-page__header-content">
          <div className="moderation-page__icon-wrapper">
            <Shield size={48} strokeWidth={2} />
          </div>
          <div>
            <h1 className="moderation-page__title">Content Moderation</h1>
            <p className="moderation-page__subtitle">
              Review and moderate user-generated content
            </p>
          </div>
        </div>
        <div className="moderation-page__status">
          <Clock size={20} strokeWidth={2} />
          <span>Coming Soon</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="moderation-card">
        <div className="moderation-card__badge">
          <AlertTriangle size={20} strokeWidth={2} />
          <span>In Development</span>
        </div>

        <div className="moderation-card__content">
          <div className="moderation-card__icon">
            <Shield size={80} strokeWidth={1.5} />
          </div>
          <h2 className="moderation-card__title">Content Moderation System</h2>
          <p className="moderation-card__description">
            This powerful feature is currently under development. Soon you'll be
            able to review, approve, or reject user-generated content, manage
            reviews, handle flagged content, and maintain a safe community
            environment.
          </p>

          <div className="moderation-card__actions">
            <button className="action-btn action-btn--primary" disabled>
              <CheckCircle size={20} strokeWidth={2} />
              <span>Approve Content</span>
            </button>
            <button className="action-btn action-btn--secondary" disabled>
              <XCircle size={20} strokeWidth={2} />
              <span>Reject Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="moderation-features">
        <h3 className="moderation-features__title">Upcoming Features</h3>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="feature-card__icon"
                style={{
                  backgroundColor: `${feature.color}15`,
                  color: feature.color,
                }}
              >
                {feature.icon}
              </div>
              <h4 className="feature-card__title">{feature.title}</h4>
              <p className="feature-card__description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
