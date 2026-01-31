// src/presentation/pages/mentor/VocabularyManagementPage/components/IdiomsList.tsx

import React, { useState } from 'react';
import { Lightbulb, Search, Volume2, BookOpen, Heart, Filter } from 'lucide-react';
import './IdiomsList.css';

interface Idiom {
  id: string;
  idiom: string;
  meaning: string;
  vietnameseMeaning: string;
  origin?: string;
  example: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  usage: 'formal' | 'informal' | 'both';
  isFavorite: boolean;
}

interface IdiomsListProps {
  onSelectIdiom?: (idiom: Idiom) => void;
}

export const IdiomsList: React.FC<IdiomsListProps> = ({ onSelectIdiom }) => {
  const [idioms, setIdioms] = useState<Idiom[]>([
    {
      id: '1',
      idiom: 'Break the ice',
      meaning: 'To initiate conversation in a social setting',
      vietnameseMeaning: 'Phá vỡ sự im lặng, bắt đầu trò chuyện',
      origin: 'From breaking ice on frozen water to allow ships to pass',
      example: 'He told a joke to break the ice at the meeting.',
      category: 'Social',
      difficulty: 'easy',
      usage: 'both',
      isFavorite: true,
    },
    {
      id: '2',
      idiom: 'Piece of cake',
      meaning: 'Something very easy to do',
      vietnameseMeaning: 'Dễ như ăn bánh, rất dễ dàng',
      example: "Don't worry, the exam was a piece of cake!",
      category: 'Daily Life',
      difficulty: 'easy',
      usage: 'informal',
      isFavorite: false,
    },
    {
      id: '3',
      idiom: 'Hit the nail on the head',
      meaning: 'To describe exactly what is causing a situation or problem',
      vietnameseMeaning: 'Nói trúng vấn đề, chính xác',
      example: 'You hit the nail on the head with that analysis.',
      category: 'Communication',
      difficulty: 'medium',
      usage: 'both',
      isFavorite: true,
    },
    {
      id: '4',
      idiom: 'Burn the midnight oil',
      meaning: 'To work late into the night',
      vietnameseMeaning: 'Thức khuya làm việc, học tập',
      example: 'I had to burn the midnight oil to finish the project.',
      category: 'Work & Study',
      difficulty: 'medium',
      usage: 'both',
      isFavorite: false,
    },
    {
      id: '5',
      idiom: 'The ball is in your court',
      meaning: 'It is up to you to make the next decision or step',
      vietnameseMeaning: 'Giờ là lượt của bạn quyết định',
      origin: 'From tennis - when the ball is on your side, you must hit it',
      example: "I've made my offer. Now the ball is in your court.",
      category: 'Business',
      difficulty: 'hard',
      usage: 'both',
      isFavorite: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories = ['all', ...new Set(idioms.map((i) => i.category))];

  const filteredIdioms = idioms.filter((idiom) => {
    const matchesSearch =
      idiom.idiom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idiom.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idiom.vietnameseMeaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || idiom.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'all' || idiom.difficulty === selectedDifficulty;
    const matchesFavorite = !showFavoritesOnly || idiom.isFavorite;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorite;
  });

  const toggleFavorite = (id: string) => {
    setIdioms(
      idioms.map((idiom) =>
        idiom.id === id ? { ...idiom, isFavorite: !idiom.isFavorite } : idiom
      )
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'idioms-list__difficulty--easy',
      medium: 'idioms-list__difficulty--medium',
      hard: 'idioms-list__difficulty--hard',
    };
    return colors[difficulty] || '';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: 'Dễ',
      medium: 'TB',
      hard: 'Khó',
    };
    return labels[difficulty] || difficulty;
  };

  const getUsageLabel = (usage: string) => {
    const labels: Record<string, string> = {
      formal: 'Trang trọng',
      informal: 'Thân mật',
      both: 'Cả hai',
    };
    return labels[usage] || usage;
  };

  const playAudio = (text: string) => {
    // TODO: Implement text-to-speech
    alert(`Phát âm: "${text}"`);
  };

  return (
    <div className="idioms-list">
      {/* Header */}
      <div className="idioms-list__header">
        <div className="idioms-list__header-icon">
          <Lightbulb size={20} />
        </div>
        <div>
          <h3 className="idioms-list__title">Danh Sách Thành Ngữ</h3>
          <p className="idioms-list__subtitle">
            Thành ngữ và cụm từ cố định trong tiếng Anh
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="idioms-list__stats">
        <div className="idioms-list__stat">
          <BookOpen size={16} />
          <span>
            <strong>{idioms.length}</strong> thành ngữ
          </span>
        </div>
        <div className="idioms-list__stat">
          <Heart size={16} />
          <span>
            <strong>{idioms.filter((i) => i.isFavorite).length}</strong> yêu thích
          </span>
        </div>
        <div className="idioms-list__stat">
          <Filter size={16} />
          <span>
            <strong>{categories.length - 1}</strong> danh mục
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="idioms-list__controls">
        <div className="idioms-list__search">
          <Search className="idioms-list__search-icon" size={18} />
          <input
            type="text"
            className="idioms-list__search-input"
            placeholder="Tìm kiếm thành ngữ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="idioms-list__filters">
          <select
            className="idioms-list__select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {categories
              .filter((c) => c !== 'all')
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>

          <select
            className="idioms-list__select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>

          <button
            className={`idioms-list__favorite-toggle ${
              showFavoritesOnly ? 'idioms-list__favorite-toggle--active' : ''
            }`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            title="Chỉ hiện yêu thích"
          >
            <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Idioms List */}
      <div className="idioms-list__items">
        {filteredIdioms.map((idiom) => (
          <div
            key={idiom.id}
            className="idioms-list__item"
            onClick={() => onSelectIdiom?.(idiom)}
          >
            {/* Header */}
            <div className="idioms-list__item-header">
              <div className="idioms-list__item-title">
                <h4 className="idioms-list__idiom">{idiom.idiom}</h4>
                <button
                  className="idioms-list__audio-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(idiom.idiom);
                  }}
                  title="Phát âm"
                >
                  <Volume2 size={14} />
                </button>
              </div>
              <button
                className={`idioms-list__favorite-btn ${
                  idiom.isFavorite ? 'idioms-list__favorite-btn--active' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(idiom.id);
                }}
              >
                <Heart size={16} fill={idiom.isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Badges */}
            <div className="idioms-list__badges">
              <span
                className={`idioms-list__difficulty ${getDifficultyColor(
                  idiom.difficulty
                )}`}
              >
                {getDifficultyLabel(idiom.difficulty)}
              </span>
              <span className="idioms-list__category">{idiom.category}</span>
              <span className="idioms-list__usage">{getUsageLabel(idiom.usage)}</span>
            </div>

            {/* Meanings */}
            <div className="idioms-list__meanings">
              <p className="idioms-list__meaning">{idiom.meaning}</p>
              <p className="idioms-list__vietnamese-meaning">
                🇻🇳 {idiom.vietnameseMeaning}
              </p>
            </div>

            {/* Origin */}
            {idiom.origin && (
              <div className="idioms-list__origin">
                <span className="idioms-list__origin-label">Nguồn gốc:</span>
                <span className="idioms-list__origin-text">{idiom.origin}</span>
              </div>
            )}

            {/* Example */}
            <div className="idioms-list__example">
              <span className="idioms-list__example-label">Ví dụ:</span>
              <span className="idioms-list__example-text">{idiom.example}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredIdioms.length === 0 && (
        <div className="idioms-list__empty">
          <Lightbulb size={32} />
          <p>Không tìm thấy thành ngữ phù hợp</p>
        </div>
      )}
    </div>
  );
};
