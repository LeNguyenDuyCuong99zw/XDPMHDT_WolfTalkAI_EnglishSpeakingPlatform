// src/presentation/pages/mentor/ConversationPracticePage/components/TopicSelector.tsx

import React, { useState } from 'react';
import { BookOpen, Search, Check } from 'lucide-react';
import './TopicSelector.css';

interface Topic {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface TopicSelectorProps {
  onSelectTopic: (topic: Topic) => void;
  selectedTopic?: Topic | null;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  onSelectTopic,
  selectedTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Mock data - thay bằng API call thực tế
  const topics: Topic[] = [
    {
      id: '1',
      name: 'Giới thiệu bản thân',
      description: 'Học cách giới thiệu tên, tuổi, nghề nghiệp và sở thích',
      level: 'beginner',
      category: 'Daily Life',
    },
    {
      id: '2',
      name: 'Đặt phòng khách sạn',
      description: 'Thực hành gọi điện đặt phòng, hỏi về giá và dịch vụ',
      level: 'intermediate',
      category: 'Travel',
    },
    {
      id: '3',
      name: 'Phỏng vấn xin việc',
      description: 'Chuẩn bị câu trả lời cho các câu hỏi phỏng vấn phổ biến',
      level: 'advanced',
      category: 'Business',
    },
    {
      id: '4',
      name: 'Mua sắm tại siêu thị',
      description: 'Hỏi giá, tìm sản phẩm và thanh toán',
      level: 'beginner',
      category: 'Shopping',
    },
    {
      id: '5',
      name: 'Thuyết trình công việc',
      description: 'Trình bày ý tưởng và dự án trước đội nhóm',
      level: 'advanced',
      category: 'Business',
    },
    {
      id: '6',
      name: 'Gọi món tại nhà hàng',
      description: 'Đọc menu, gọi món ăn và yêu cầu phục vụ',
      level: 'intermediate',
      category: 'Food & Dining',
    },
  ];

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === 'all' || topic.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: 'Cơ bản',
      intermediate: 'Trung cấp',
      advanced: 'Nâng cao',
    };
    return labels[level] || level;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'topic-selector__level--beginner',
      intermediate: 'topic-selector__level--intermediate',
      advanced: 'topic-selector__level--advanced',
    };
    return colors[level] || '';
  };

  return (
    <div className="topic-selector">
      {/* Header */}
      <div className="topic-selector__header">
        <div className="topic-selector__header-icon">
          <BookOpen size={20} />
        </div>
        <div>
          <h3 className="topic-selector__title">Chọn Chủ Đề Hội Thoại</h3>
          <p className="topic-selector__subtitle">
            Chọn chủ đề phù hợp với trình độ học viên
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="topic-selector__controls">
        <div className="topic-selector__search">
          <Search className="topic-selector__search-icon" size={18} />
          <input
            type="text"
            className="topic-selector__search-input"
            placeholder="Tìm kiếm chủ đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="topic-selector__filters">
          <button
            className={`topic-selector__filter-btn ${
              selectedLevel === 'all' ? 'topic-selector__filter-btn--active' : ''
            }`}
            onClick={() => setSelectedLevel('all')}
          >
            Tất cả
          </button>
          <button
            className={`topic-selector__filter-btn ${
              selectedLevel === 'beginner'
                ? 'topic-selector__filter-btn--active'
                : ''
            }`}
            onClick={() => setSelectedLevel('beginner')}
          >
            Cơ bản
          </button>
          <button
            className={`topic-selector__filter-btn ${
              selectedLevel === 'intermediate'
                ? 'topic-selector__filter-btn--active'
                : ''
            }`}
            onClick={() => setSelectedLevel('intermediate')}
          >
            Trung cấp
          </button>
          <button
            className={`topic-selector__filter-btn ${
              selectedLevel === 'advanced'
                ? 'topic-selector__filter-btn--active'
                : ''
            }`}
            onClick={() => setSelectedLevel('advanced')}
          >
            Nâng cao
          </button>
        </div>
      </div>

      {/* Topics list */}
      <div className="topic-selector__list">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className={`topic-selector__item ${
              selectedTopic?.id === topic.id
                ? 'topic-selector__item--selected'
                : ''
            }`}
            onClick={() => onSelectTopic(topic)}
          >
            {selectedTopic?.id === topic.id && (
              <div className="topic-selector__check-icon">
                <Check size={16} />
              </div>
            )}
            <div className="topic-selector__item-content">
              <div className="topic-selector__item-header">
                <h4 className="topic-selector__item-title">{topic.name}</h4>
                <span
                  className={`topic-selector__level ${getLevelColor(
                    topic.level
                  )}`}
                >
                  {getLevelLabel(topic.level)}
                </span>
              </div>
              <p className="topic-selector__item-description">
                {topic.description}
              </p>
              <span className="topic-selector__item-category">
                {topic.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="topic-selector__empty">
          <p>Không tìm thấy chủ đề phù hợp</p>
        </div>
      )}
    </div>
  );
};
