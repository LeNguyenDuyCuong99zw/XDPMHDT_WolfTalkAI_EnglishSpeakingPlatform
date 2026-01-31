import React from 'react';
import { FaMedal, FaRedo, FaArrowRight, FaDumbbell } from 'react-icons/fa';
import '../styles/Learning.css';

interface SessionSummaryProps {
    scenarioName: string;
    vocabCount: number;
    grammarCount: number;
    score?: number;            // New prop
    maxScore?: number;         // New prop
    onHome: () => void;
    onRetry: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
    scenarioName,
    vocabCount,
    score = 0,
    maxScore = 100,
    onHome,
    onRetry
}) => {
    const percentage = Math.round((score / maxScore) * 100);

    let badge = { icon: <FaMedal />, label: "Đồng", color: "#cd7f32" };
    if (percentage >= 90) badge = { icon: <FaMedal />, label: "Vàng", color: "#ffd700" };
    else if (percentage >= 70) badge = { icon: <FaMedal />, label: "Bạc", color: "#c0c0c0" };

    return (
        <div className="summary-container">
            <div className="celebration-animation">🎉</div>
            <h2>Hoàn thành xuất sắc!</h2>
            <p className="summary-subtitle">Bạn vừa học xong bài: <strong>{scenarioName}</strong></p>

            <div className="score-ring-container">
                <div className="score-ring" style={{ border: `8px solid ${badge.color}` }}>
                    <span className="score-text">{score}</span>
                    <span className="score-total">/ {maxScore}</span>
                </div>
                <div className="badge-display" style={{ color: badge.color }}>
                    {badge.icon} <span>Huy chương {badge.label}</span>
                </div>
            </div>

            <div className="summary-stats-grid">
                <div className="summary-card xp">
                    <span className="summary-value">+{Math.floor(score / 2)}</span>
                    <span className="summary-label">KN đạt được</span>
                </div>
                <div className="summary-card words">
                    <span className="summary-value">{vocabCount}</span>
                    <span className="summary-label">Từ đã học</span>
                </div>
                <div className="summary-card accuracy">
                    <span className="summary-value">{percentage}%</span>
                    <span className="summary-label">Chính xác</span>
                </div>
            </div>

            <div className="summary-actions">
                <button className="secondary-btn" onClick={onHome}>
                    <FaArrowRight /> Về danh sách
                </button>
                <button className="secondary-btn" onClick={() => alert("Tính năng ôn tập từ yếu đang phát triển!")}>
                    <FaDumbbell /> Ôn từ yếu
                </button>
                <button className="primary-btn" onClick={onRetry}>
                    <FaRedo /> Học lại bài này
                </button>
            </div>
        </div>
    );
};

