// src/presentation/pages/mentor/VocabularyManagementPage/components/VocabByTopic.tsx

import React, { useState } from 'react';
import { FolderTree, ChevronDown, ChevronRight, Plus, Edit2, Eye } from 'lucide-react';
import './VocabByTopic.css';

interface VocabTopic {
  id: string;
  name: string;
  icon: string;
  wordCount: number;
  color: string;
  subtopics?: VocabTopic[];
  expanded?: boolean;
}

interface VocabByTopicProps {
  onSelectTopic?: (topic: VocabTopic) => void;
}

export const VocabByTopic: React.FC<VocabByTopicProps> = ({ onSelectTopic }) => {
  const [topics, setTopics] = useState<VocabTopic[]>([
    {
      id: '1',
      name: 'Daily Life',
      icon: '🏠',
      wordCount: 45,
      color: '#ec4899',
      subtopics: [
        { id: '1-1', name: 'Home & Family', icon: '👨‍👩‍👧', wordCount: 15, color: '#ec4899' },
        { id: '1-2', name: 'Shopping', icon: '🛒', wordCount: 12, color: '#ec4899' },
        { id: '1-3', name: 'Transportation', icon: '🚗', wordCount: 18, color: '#ec4899' },
      ],
      expanded: false,
    },
    {
      id: '2',
      name: 'Technology',
      icon: '💻',
      wordCount: 32,
      color: '#0ea5e9',
      subtopics: [
        { id: '2-1', name: 'Internet & Web', icon: '🌐', wordCount: 14, color: '#0ea5e9' },
        { id: '2-2', name: 'Software', icon: '📱', wordCount: 10, color: '#0ea5e9' },
        { id: '2-3', name: 'Hardware', icon: '⚙️', wordCount: 8, color: '#0ea5e9' },
      ],
      expanded: false,
    },
    {
      id: '3',
      name: 'Business',
      icon: '💼',
      wordCount: 28,
      color: '#8b5cf6',
      subtopics: [
        { id: '3-1', name: 'Finance', icon: '💰', wordCount: 12, color: '#8b5cf6' },
        { id: '3-2', name: 'Marketing', icon: '📊', wordCount: 9, color: '#8b5cf6' },
        { id: '3-3', name: 'Management', icon: '👔', wordCount: 7, color: '#8b5cf6' },
      ],
      expanded: false,
    },
    {
      id: '4',
      name: 'Education',
      icon: '📚',
      wordCount: 24,
      color: '#10b981',
      subtopics: [
        { id: '4-1', name: 'School Subjects', icon: '📖', wordCount: 10, color: '#10b981' },
        { id: '4-2', name: 'Learning Tools', icon: '✏️', wordCount: 8, color: '#10b981' },
        { id: '4-3', name: 'Academic Life', icon: '🎓', wordCount: 6, color: '#10b981' },
      ],
      expanded: false,
    },
    {
      id: '5',
      name: 'Health & Fitness',
      icon: '💪',
      wordCount: 19,
      color: '#f59e0b',
      subtopics: [
        { id: '5-1', name: 'Exercise', icon: '🏃', wordCount: 8, color: '#f59e0b' },
        { id: '5-2', name: 'Nutrition', icon: '🥗', wordCount: 7, color: '#f59e0b' },
        { id: '5-3', name: 'Medical', icon: '🏥', wordCount: 4, color: '#f59e0b' },
      ],
      expanded: false,
    },
    {
      id: '6',
      name: 'Travel & Tourism',
      icon: '✈️',
      wordCount: 22,
      color: '#06b6d4',
      subtopics: [
        { id: '6-1', name: 'Accommodation', icon: '🏨', wordCount: 8, color: '#06b6d4' },
        { id: '6-2', name: 'Destinations', icon: '🗺️', wordCount: 9, color: '#06b6d4' },
        { id: '6-3', name: 'Activities', icon: '🎯', wordCount: 5, color: '#06b6d4' },
      ],
      expanded: false,
    },
  ]);

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setTopics(
      topics.map((topic) =>
        topic.id === id ? { ...topic, expanded: !topic.expanded } : topic
      )
    );
  };

  const handleSelectTopic = (topic: VocabTopic) => {
    setSelectedTopicId(topic.id);
    onSelectTopic?.(topic);
  };

  const totalWords = topics.reduce((sum, topic) => sum + topic.wordCount, 0);
  const totalTopics = topics.length;
  const totalSubtopics = topics.reduce(
    (sum, topic) => sum + (topic.subtopics?.length || 0),
    0
  );

  return (
    <div className="vocab-by-topic">
      {/* Header */}
      <div className="vocab-by-topic__header">
        <div className="vocab-by-topic__header-icon">
          <FolderTree size={20} />
        </div>
        <div>
          <h3 className="vocab-by-topic__title">Từ Vựng Theo Chủ Đề</h3>
          <p className="vocab-by-topic__subtitle">
            Phân loại từ vựng theo lĩnh vực và chủ đề
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="vocab-by-topic__summary">
        <div className="vocab-by-topic__summary-item">
          <span className="vocab-by-topic__summary-value">{totalWords}</span>
          <span className="vocab-by-topic__summary-label">Từ vựng</span>
        </div>
        <div className="vocab-by-topic__summary-item">
          <span className="vocab-by-topic__summary-value">{totalTopics}</span>
          <span className="vocab-by-topic__summary-label">Chủ đề chính</span>
        </div>
        <div className="vocab-by-topic__summary-item">
          <span className="vocab-by-topic__summary-value">{totalSubtopics}</span>
          <span className="vocab-by-topic__summary-label">Chủ đề con</span>
        </div>
      </div>

      {/* Add button */}
      <button className="vocab-by-topic__add-btn">
        <Plus size={16} />
        <span>Thêm Chủ Đề Mới</span>
      </button>

      {/* Topics tree */}
      <div className="vocab-by-topic__tree">
        {topics.map((topic) => (
          <div key={topic.id} className="vocab-by-topic__topic-group">
            {/* Main topic */}
            <div
              className={`vocab-by-topic__topic ${
                selectedTopicId === topic.id
                  ? 'vocab-by-topic__topic--selected'
                  : ''
              }`}
              onClick={() => handleSelectTopic(topic)}
            >
              <div className="vocab-by-topic__topic-left">
                {topic.subtopics && topic.subtopics.length > 0 && (
                  <button
                    className="vocab-by-topic__expand-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(topic.id);
                    }}
                  >
                    {topic.expanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                )}
                <span
                  className="vocab-by-topic__icon"
                  style={{ backgroundColor: `${topic.color}20` }}
                >
                  {topic.icon}
                </span>
                <div className="vocab-by-topic__info">
                  <span className="vocab-by-topic__name">{topic.name}</span>
                  <span className="vocab-by-topic__count">
                    {topic.wordCount} từ
                  </span>
                </div>
              </div>

              <div className="vocab-by-topic__actions">
                <button
                  className="vocab-by-topic__action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Xem từ vựng: ${topic.name}`);
                  }}
                  title="Xem từ vựng"
                >
                  <Eye size={14} />
                </button>
                <button
                  className="vocab-by-topic__action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Chỉnh sửa: ${topic.name}`);
                  }}
                  title="Chỉnh sửa"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            </div>

            {/* Subtopics */}
            {topic.expanded && topic.subtopics && (
              <div className="vocab-by-topic__subtopics">
                {topic.subtopics.map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className={`vocab-by-topic__subtopic ${
                      selectedTopicId === subtopic.id
                        ? 'vocab-by-topic__subtopic--selected'
                        : ''
                    }`}
                    onClick={() => handleSelectTopic(subtopic)}
                  >
                    <span
                      className="vocab-by-topic__subtopic-icon"
                      style={{ backgroundColor: `${subtopic.color}20` }}
                    >
                      {subtopic.icon}
                    </span>
                    <div className="vocab-by-topic__info">
                      <span className="vocab-by-topic__name">{subtopic.name}</span>
                      <span className="vocab-by-topic__count">
                        {subtopic.wordCount} từ
                      </span>
                    </div>

                    <div className="vocab-by-topic__actions">
                      <button
                        className="vocab-by-topic__action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Xem từ vựng: ${subtopic.name}`);
                        }}
                        title="Xem từ vựng"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
