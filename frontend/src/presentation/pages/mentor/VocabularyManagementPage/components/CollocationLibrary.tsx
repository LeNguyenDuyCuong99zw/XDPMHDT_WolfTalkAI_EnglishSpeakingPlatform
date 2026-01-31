// src/presentation/pages/mentor/VocabularyManagementPage/components/CollocationLibrary.tsx

import React, { useState } from 'react';
import { Link2, Search, Plus, TrendingUp, BookOpen, Star } from 'lucide-react';
import './CollocationLibrary.css';

interface Collocation {
  id: string;
  phrase: string;
  type: 'verb+noun' | 'adj+noun' | 'adv+adj' | 'verb+prep' | 'noun+noun';
  meaning: string;
  example: string;
  frequency: 'common' | 'medium' | 'rare';
  relatedWords: string[];
}

interface CollocationLibraryProps {
  onSelect?: (collocation: Collocation) => void;
}

export const CollocationLibrary: React.FC<CollocationLibraryProps> = ({
  onSelect,
}) => {
  const [collocations] = useState<Collocation[]>([
    {
      id: '1',
      phrase: 'make a decision',
      type: 'verb+noun',
      meaning: 'Đưa ra quyết định',
      example: 'We need to make a decision by tomorrow.',
      frequency: 'common',
      relatedWords: ['decide', 'choose', 'determine'],
    },
    {
      id: '2',
      phrase: 'heavy rain',
      type: 'adj+noun',
      meaning: 'Mưa lớn',
      example: 'Heavy rain is expected this weekend.',
      frequency: 'common',
      relatedWords: ['storm', 'downpour', 'shower'],
    },
    {
      id: '3',
      phrase: 'pay attention',
      type: 'verb+noun',
      meaning: 'Chú ý, tập trung',
      example: 'Please pay attention to the instructions.',
      frequency: 'common',
      relatedWords: ['focus', 'concentrate', 'listen'],
    },
    {
      id: '4',
      phrase: 'fast food',
      type: 'adj+noun',
      meaning: 'Đồ ăn nhanh',
      example: 'Eating too much fast food is unhealthy.',
      frequency: 'common',
      relatedWords: ['junk food', 'takeout', 'quick meal'],
    },
    {
      id: '5',
      phrase: 'highly recommended',
      type: 'adv+adj',
      meaning: 'Được khuyến nghị cao',
      example: 'This restaurant is highly recommended by locals.',
      frequency: 'medium',
      relatedWords: ['suggested', 'advised', 'endorsed'],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFrequency, setSelectedFrequency] = useState('all');

  const collocationTypes = [
    { value: 'all', label: 'Tất cả loại' },
    { value: 'verb+noun', label: 'Động từ + Danh từ' },
    { value: 'adj+noun', label: 'Tính từ + Danh từ' },
    { value: 'adv+adj', label: 'Trạng từ + Tính từ' },
    { value: 'verb+prep', label: 'Động từ + Giới từ' },
    { value: 'noun+noun', label: 'Danh từ + Danh từ' },
  ];

  const filteredCollocations = collocations.filter((collocation) => {
    const matchesSearch =
      collocation.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collocation.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === 'all' || collocation.type === selectedType;
    const matchesFrequency =
      selectedFrequency === 'all' || collocation.frequency === selectedFrequency;
    return matchesSearch && matchesType && matchesFrequency;
  });

  const getFrequencyColor = (frequency: string) => {
    const colors: Record<string, string> = {
      common: 'collocation-library__frequency--common',
      medium: 'collocation-library__frequency--medium',
      rare: 'collocation-library__frequency--rare',
    };
    return colors[frequency] || '';
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      common: 'Phổ biến',
      medium: 'Trung bình',
      rare: 'Hiếm',
    };
    return labels[frequency] || frequency;
  };

  const getTypeLabel = (type: string) => {
    const item = collocationTypes.find((t) => t.value === type);
    return item?.label || type;
  };

  return (
    <div className="collocation-library">
      {/* Header */}
      <div className="collocation-library__header">
        <div className="collocation-library__header-icon">
          <Link2 size={20} />
        </div>
        <div>
          <h3 className="collocation-library__title">Thư Viện Collocations</h3>
          <p className="collocation-library__subtitle">
            Các cụm từ thường đi cùng nhau trong tiếng Anh
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="collocation-library__stats">
        <div className="collocation-library__stat">
          <BookOpen size={16} />
          <span>
            <strong>{collocations.length}</strong> collocations
          </span>
        </div>
        <div className="collocation-library__stat">
          <TrendingUp size={16} />
          <span>
            <strong>
              {collocations.filter((c) => c.frequency === 'common').length}
            </strong>{' '}
            phổ biến
          </span>
        </div>
        <div className="collocation-library__stat">
          <Star size={16} />
          <span>
            <strong>
              {new Set(collocations.map((c) => c.type)).size}
            </strong>{' '}
            loại
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="collocation-library__controls">
        <div className="collocation-library__search">
          <Search className="collocation-library__search-icon" size={18} />
          <input
            type="text"
            className="collocation-library__search-input"
            placeholder="Tìm kiếm collocation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="collocation-library__filters">
          <select
            className="collocation-library__select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {collocationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            className="collocation-library__select"
            value={selectedFrequency}
            onChange={(e) => setSelectedFrequency(e.target.value)}
          >
            <option value="all">Tất cả tần suất</option>
            <option value="common">Phổ biến</option>
            <option value="medium">Trung bình</option>
            <option value="rare">Hiếm</option>
          </select>
        </div>

        <button
          className="collocation-library__add-btn"
          onClick={() => alert('Thêm collocation mới')}
        >
          <Plus size={16} />
          <span>Thêm</span>
        </button>
      </div>

      {/* Collocation List */}
      <div className="collocation-library__list">
        {filteredCollocations.map((collocation) => (
          <div
            key={collocation.id}
            className="collocation-library__item"
            onClick={() => onSelect?.(collocation)}
          >
            <div className="collocation-library__item-header">
              <h4 className="collocation-library__phrase">
                {collocation.phrase}
              </h4>
              <div className="collocation-library__badges">
                <span className="collocation-library__type">
                  {getTypeLabel(collocation.type)}
                </span>
                <span
                  className={`collocation-library__frequency ${getFrequencyColor(
                    collocation.frequency
                  )}`}
                >
                  {getFrequencyLabel(collocation.frequency)}
                </span>
              </div>
            </div>

            <p className="collocation-library__meaning">{collocation.meaning}</p>

            <div className="collocation-library__example">
              <span className="collocation-library__example-label">Ví dụ:</span>
              <span className="collocation-library__example-text">
                {collocation.example}
              </span>
            </div>

            {collocation.relatedWords.length > 0 && (
              <div className="collocation-library__related">
                <span className="collocation-library__related-label">
                  Từ liên quan:
                </span>
                <div className="collocation-library__related-tags">
                  {collocation.relatedWords.map((word, index) => (
                    <span key={index} className="collocation-library__tag">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCollocations.length === 0 && (
        <div className="collocation-library__empty">
          <Link2 size={32} />
          <p>Không tìm thấy collocation phù hợp</p>
        </div>
      )}
    </div>
  );
};
