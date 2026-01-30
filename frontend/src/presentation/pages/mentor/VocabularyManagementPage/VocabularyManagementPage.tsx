// src/presentation/pages/mentor/VocabularyManagementPage/VocabularyManagementPage.tsx

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Upload,
  Loader2,
  Star,
  TrendingUp,
} from 'lucide-react';
import './VocabularyManagementPage.css';

interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
  isFavorite: boolean;
  studyCount: number;
}

export const VocabularyManagementPage: React.FC = () => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  // const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  const mockWords: VocabularyWord[] = [
    {
      id: '1',
      word: 'Algorithm',
      pronunciation: '/ˈælɡərɪðəm/',
      meaning: 'Thuật toán - tập hợp các bước để giải quyết vấn đề',
      example: 'The algorithm efficiently sorts the data.',
      category: 'Technology',
      level: 'intermediate',
      createdAt: new Date().toISOString(),
      isFavorite: true,
      studyCount: 15,
    },
    {
      id: '2',
      word: 'Entrepreneur',
      pronunciation: '/ˌɑːntrəprəˈnɜːr/',
      meaning: 'Doanh nhân - người khởi nghiệp kinh doanh',
      example: 'She became a successful entrepreneur at age 25.',
      category: 'Business',
      level: 'advanced',
      createdAt: new Date().toISOString(),
      isFavorite: false,
      studyCount: 8,
    },
    {
      id: '3',
      word: 'Beautiful',
      pronunciation: '/ˈbjuːtɪfl/',
      meaning: 'Đẹp - có vẻ ngoài hấp dẫn',
      example: 'What a beautiful sunset!',
      category: 'Daily Life',
      level: 'beginner',
      createdAt: new Date().toISOString(),
      isFavorite: true,
      studyCount: 32,
    },
  ];

  React.useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setWords(mockWords);
      setLoading(false);
    }, 800);
  }, []);

  const handleCreateWord = () => {
    // Placeholder for showing create modal
    alert('Tính năng thêm từ mới đang được phát triển');
  };

  const handleImport = () => {
    alert('Tính năng import đang được phát triển');
  };

  const handleExport = () => {
    alert('Tính năng export đang được phát triển');
  };

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || word.category === selectedCategory;
    const matchesLevel =
      selectedLevel === 'all' || word.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = ['all', ...new Set(words.map((w) => w.category))];
  const totalStudyCount = words.reduce((sum, w) => sum + w.studyCount, 0);
  const favoriteCount = words.filter((w) => w.isFavorite).length;

  if (loading && words.length === 0) {
    return (
      <div className="vocabulary-page vocabulary-page--loading glass-card">
        <Loader2 className="vocabulary-page__spinner" size={40} />
        <span className="vocabulary-page__loading-text">
          Đang tải từ vựng...
        </span>
      </div>
    );
  }

  return (
    <div className="vocabulary-page">
      {/* Header */}
      <div className="vocabulary-page__header glass-card">
        <div className="vocabulary-page__header-main">
          <div className="vocabulary-page__header-icon">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="vocabulary-page__title">Quản Lý Từ Vựng</h2>
            <p className="vocabulary-page__subtitle">
              Tạo và quản lý bộ từ vựng cho học viên
            </p>
          </div>
        </div>
        <div className="vocabulary-page__actions">
          <button
            className="vocabulary-page__icon-button"
            type="button"
            onClick={handleImport}
            title="Import từ vựng"
          >
            <Upload size={18} />
          </button>
          <button
            className="vocabulary-page__icon-button"
            type="button"
            onClick={handleExport}
            title="Export từ vựng"
          >
            <Download size={18} />
          </button>
          <button
            className="vocabulary-page__primary-button"
            type="button"
            onClick={handleCreateWord}
          >
            <Plus size={18} />
            <span>Thêm Từ Mới</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="vocabulary-page__stats">
        <div className="vocabulary-page__stat glass-card">
          <div className="vocabulary-page__stat-icon vocabulary-page__stat-icon--total">
            <BookOpen size={20} />
          </div>
          <div className="vocabulary-page__stat-content">
            <span className="vocabulary-page__stat-value">{words.length}</span>
            <span className="vocabulary-page__stat-label">Tổng từ vựng</span>
          </div>
        </div>

        <div className="vocabulary-page__stat glass-card">
          <div className="vocabulary-page__stat-icon vocabulary-page__stat-icon--favorite">
            <Star size={20} />
          </div>
          <div className="vocabulary-page__stat-content">
            <span className="vocabulary-page__stat-value">{favoriteCount}</span>
            <span className="vocabulary-page__stat-label">Yêu thích</span>
          </div>
        </div>

        <div className="vocabulary-page__stat glass-card">
          <div className="vocabulary-page__stat-icon vocabulary-page__stat-icon--study">
            <TrendingUp size={20} />
          </div>
          <div className="vocabulary-page__stat-content">
            <span className="vocabulary-page__stat-value">
              {totalStudyCount}
            </span>
            <span className="vocabulary-page__stat-label">Lượt học</span>
          </div>
        </div>

        <div className="vocabulary-page__stat glass-card">
          <div className="vocabulary-page__stat-icon vocabulary-page__stat-icon--category">
            <Filter size={20} />
          </div>
          <div className="vocabulary-page__stat-content">
            <span className="vocabulary-page__stat-value">
              {categories.length - 1}
            </span>
            <span className="vocabulary-page__stat-label">Danh mục</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="vocabulary-page__controls glass-card">
        <div className="vocabulary-page__search">
          <Search className="vocabulary-page__search-icon" size={18} />
          <input
            type="text"
            className="vocabulary-page__search-input"
            placeholder="Tìm kiếm từ vựng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="vocabulary-page__filters">
          <select
            className="vocabulary-page__select"
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
            className="vocabulary-page__select"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="beginner">Cơ bản</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>
        </div>

        <div className="vocabulary-page__view-toggle">
          <button
            className={`vocabulary-page__view-btn ${
              viewMode === 'grid' ? 'vocabulary-page__view-btn--active' : ''
            }`}
            onClick={() => setViewMode('grid')}
            title="Xem dạng lưới"
          >
            <Grid size={18} />
          </button>
          <button
            className={`vocabulary-page__view-btn ${
              viewMode === 'list' ? 'vocabulary-page__view-btn--active' : ''
            }`}
            onClick={() => setViewMode('list')}
            title="Xem dạng danh sách"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="vocabulary-page__content glass-card">
        {filteredWords.length > 0 ? (
          <div
            className={`vocabulary-page__list vocabulary-page__list--${viewMode}`}
          >
            {filteredWords.map((word) => (
              <VocabularyCard key={word.id} word={word} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="vocabulary-page__empty">
            <div className="vocabulary-page__empty-icon">
              <BookOpen size={28} />
            </div>
            <h3 className="vocabulary-page__empty-title">
              {words.length === 0
                ? 'Chưa có từ vựng nào'
                : 'Không tìm thấy từ vựng'}
            </h3>
            <p className="vocabulary-page__empty-text">
              {words.length === 0
                ? 'Bắt đầu xây dựng bộ từ vựng cho học viên bằng cách thêm từ mới hoặc import từ file.'
                : 'Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.'}
            </p>
            {words.length === 0 && (
              <button
                className="vocabulary-page__primary-button vocabulary-page__primary-button--empty"
                type="button"
                onClick={handleCreateWord}
              >
                <Plus size={18} />
                <span>Thêm Từ Đầu Tiên</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface VocabularyCardProps {
  word: VocabularyWord;
  viewMode: 'grid' | 'list';
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, viewMode }) => {
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'vocabulary-page__level--beginner',
      intermediate: 'vocabulary-page__level--intermediate',
      advanced: 'vocabulary-page__level--advanced',
    };
    return colors[level] || '';
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: 'Cơ bản',
      intermediate: 'Trung cấp',
      advanced: 'Nâng cao',
    };
    return labels[level] || level;
  };

  return (
    <div className={`vocabulary-card vocabulary-card--${viewMode}`}>
      {word.isFavorite && (
        <div className="vocabulary-card__favorite">
          <Star size={14} fill="currentColor" />
        </div>
      )}

      <div className="vocabulary-card__header">
        <h3 className="vocabulary-card__word">{word.word}</h3>
        <span className={`vocabulary-card__level ${getLevelColor(word.level)}`}>
          {getLevelLabel(word.level)}
        </span>
      </div>

      <p className="vocabulary-card__pronunciation">{word.pronunciation}</p>

      <p className="vocabulary-card__meaning">{word.meaning}</p>

      <div className="vocabulary-card__example">
        <span className="vocabulary-card__example-label">Ví dụ:</span>
        <span className="vocabulary-card__example-text">{word.example}</span>
      </div>

      <div className="vocabulary-card__meta">
        <span className="vocabulary-card__category">{word.category}</span>
        <span className="vocabulary-card__study-count">
          <TrendingUp size={12} />
          {word.studyCount} lượt học
        </span>
      </div>

      <div className="vocabulary-card__actions">
        <button className="vocabulary-card__action-btn vocabulary-card__action-btn--primary">
          Chỉnh sửa
        </button>
        <button className="vocabulary-card__action-btn vocabulary-card__action-btn--secondary">
          Xóa
        </button>
      </div>
    </div>
  );
};
