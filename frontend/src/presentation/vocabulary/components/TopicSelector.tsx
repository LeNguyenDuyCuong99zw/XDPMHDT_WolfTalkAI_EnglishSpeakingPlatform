import React from "react";
import type { TopicInfo } from "../../../services/vocabularyAPI";
import { FaCheck, FaLock } from "react-icons/fa";

interface TopicSelectorProps {
  topics: TopicInfo[];
  onSelectTopic: (topic: string) => void;
  selectedTopic?: string;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  onSelectTopic,
  selectedTopic,
}) => {
  const getTopicIcon = (topic: string): string => {
    const icons: { [key: string]: string } = {
      GREETINGS: "👋",
      FAMILY: "👨‍👩‍👧‍👦",
      FOOD: "🍔",
      NUMBERS: "🔢",
      COLORS: "🎨",
      ANIMALS: "🐶",
      WEATHER: "🌤️",
      BODY_PARTS: "👤",
      CLOTHES: "👕",
      TRANSPORTATION: "🚗",
      HOUSE: "🏠",
      SCHOOL: "🎓",
      WORK: "💼",
      TRAVEL: "✈️",
      HEALTH: "🏥",
      SPORTS: "⚽",
      TECHNOLOGY: "💻",
      NATURE: "🌳",
      EMOTIONS: "😊",
      TIME: "⏰",
      SHOPPING: "🛒",
      HOBBIES: "🎮",
      BUSINESS: "📊",
      SCIENCE: "🔬",
      CULTURE: "🎭",
    };
    return icons[topic] || "📚";
  };

  const getProgressColor = (progress: number): string => {
    if (progress === 100) return "#2ecc71";
    if (progress >= 50) return "#f39c12";
    return "#3498db";
  };

  return (
    <div className="vocab-topic-selector">
      <h2 className="vocab-topic-title">Chọn chủ đề để học</h2>
      <div className="vocab-topics-grid">
        {topics.map((topicInfo) => {
          const isCompleted = topicInfo.progress === 100;
          const isSelected = selectedTopic === topicInfo.topic;

          return (
            <div
              key={topicInfo.topic}
              className={`vocab-topic-card ${isSelected ? "selected" : ""} ${isCompleted ? "completed" : ""}`}
              onClick={() => onSelectTopic(topicInfo.topic)}
            >
              <div className="vocab-topic-icon">
                {getTopicIcon(topicInfo.topic)}
              </div>
              <div className="vocab-topic-content">
                <h3 className="vocab-topic-name">
                  {topicInfo.topicDisplayName}
                </h3>
                <div className="vocab-topic-stats">
                  <span className="vocab-words-count">
                    {topicInfo.masteredWords}/{topicInfo.totalWords} từ
                  </span>
                </div>
                <div className="vocab-topic-progress-bar">
                  <div
                    className="vocab-topic-progress-fill"
                    style={{
                      width: `${topicInfo.progress}%`,
                      backgroundColor: getProgressColor(topicInfo.progress),
                    }}
                  />
                </div>
              </div>
              {isCompleted && (
                <div className="vocab-completed-badge">
                  <FaCheck />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
