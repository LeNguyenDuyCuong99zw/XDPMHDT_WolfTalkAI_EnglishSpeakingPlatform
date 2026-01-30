// src/presentation/pages/mentor/VocabularyManagementPage/components/FlashcardCreator.tsx

import React, { useState } from 'react';
import { Layers, Plus, Eye, Edit2, Trash2, RotateCw, Download } from 'lucide-react';
import './FlashcardCreator.css';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  imageUrl?: string;
  audioUrl?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FlashcardCreatorProps {
  onSave?: (flashcards: Flashcard[]) => void;
}

export const FlashcardCreator: React.FC<FlashcardCreatorProps> = ({ onSave }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: '1',
      front: 'Beautiful',
      back: 'Đẹp - có vẻ ngoài hấp dẫn',
      hint: 'Tính từ mô tả ngoại hình',
      category: 'Daily Life',
      difficulty: 'easy',
    },
    {
      id: '2',
      front: 'Algorithm',
      back: 'Thuật toán - tập hợp các bước giải quyết vấn đề',
      category: 'Technology',
      difficulty: 'medium',
    },
  ]);

  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFlip = (id: string) => {
    const newFlipped = new Set(flipped);
    if (newFlipped.has(id)) {
      newFlipped.delete(id);
    } else {
      newFlipped.add(id);
    }
    setFlipped(newFlipped);
  };

  const handleAddCard = () => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: 'New Word',
      back: 'Nghĩa tiếng Việt',
      category: 'Daily Life',
      difficulty: 'easy',
    };
    setFlashcards([...flashcards, newCard]);
  };

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa flashcard này?')) {
      setFlashcards(flashcards.filter((card) => card.id !== id));
      setFlipped((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleExport = () => {
    onSave?.(flashcards);
    alert('Đã xuất flashcard thành công!');
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'flashcard-creator__difficulty--easy',
      medium: 'flashcard-creator__difficulty--medium',
      hard: 'flashcard-creator__difficulty--hard',
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

  return (
    <div className="flashcard-creator">
      {/* Header */}
      <div className="flashcard-creator__header">
        <div className="flashcard-creator__header-icon">
          <Layers size={20} />
        </div>
        <div>
          <h3 className="flashcard-creator__title">Tạo Flashcard</h3>
          <p className="flashcard-creator__subtitle">
            Thiết kế thẻ học từ vựng tương tác
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flashcard-creator__stats">
        <div className="flashcard-creator__stat">
          <span className="flashcard-creator__stat-value">{flashcards.length}</span>
          <span className="flashcard-creator__stat-label">Thẻ</span>
        </div>
        <div className="flashcard-creator__stat">
          <span className="flashcard-creator__stat-value">
            {flashcards.filter((f) => f.difficulty === 'easy').length}
          </span>
          <span className="flashcard-creator__stat-label">Dễ</span>
        </div>
        <div className="flashcard-creator__stat">
          <span className="flashcard-creator__stat-value">
            {flashcards.filter((f) => f.difficulty === 'medium').length}
          </span>
          <span className="flashcard-creator__stat-label">Trung bình</span>
        </div>
        <div className="flashcard-creator__stat">
          <span className="flashcard-creator__stat-value">
            {flashcards.filter((f) => f.difficulty === 'hard').length}
          </span>
          <span className="flashcard-creator__stat-label">Khó</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flashcard-creator__actions">
        <button
          className="flashcard-creator__action-btn flashcard-creator__action-btn--primary"
          onClick={handleAddCard}
        >
          <Plus size={16} />
          <span>Thêm Thẻ</span>
        </button>
        <button
          className="flashcard-creator__action-btn"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye size={16} />
          <span>{showPreview ? 'Ẩn' : 'Xem'} Preview</span>
        </button>
        <button className="flashcard-creator__action-btn" onClick={handleExport}>
          <Download size={16} />
          <span>Xuất Bộ Thẻ</span>
        </button>
      </div>

      {/* Flashcard Grid */}
      <div className="flashcard-creator__grid">
        {flashcards.map((card) => (
          <div
            key={card.id}
            className={`flashcard-creator__card ${
              flipped.has(card.id) ? 'flashcard-creator__card--flipped' : ''
            } ${
              selectedCard === card.id ? 'flashcard-creator__card--selected' : ''
            }`}
            onClick={() => setSelectedCard(card.id)}
          >
            <div className="flashcard-creator__card-inner">
              {/* Front */}
              <div className="flashcard-creator__card-front">
                <div className="flashcard-creator__card-header">
                  <span
                    className={`flashcard-creator__difficulty ${getDifficultyColor(
                      card.difficulty
                    )}`}
                  >
                    {getDifficultyLabel(card.difficulty)}
                  </span>
                  <span className="flashcard-creator__category">{card.category}</span>
                </div>
                <div className="flashcard-creator__card-content">
                  <h4 className="flashcard-creator__card-word">{card.front}</h4>
                  {card.hint && (
                    <p className="flashcard-creator__card-hint">💡 {card.hint}</p>
                  )}
                </div>
                <button
                  className="flashcard-creator__flip-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip(card.id);
                  }}
                >
                  <RotateCw size={16} />
                </button>
              </div>

              {/* Back */}
              <div className="flashcard-creator__card-back">
                <div className="flashcard-creator__card-content">
                  <p className="flashcard-creator__card-meaning">{card.back}</p>
                </div>
                <button
                  className="flashcard-creator__flip-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip(card.id);
                  }}
                >
                  <RotateCw size={16} />
                </button>
              </div>
            </div>

            {/* Card actions */}
            <div className="flashcard-creator__card-actions">
              <button
                className="flashcard-creator__card-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Chỉnh sửa: ' + card.front);
                }}
                title="Chỉnh sửa"
              >
                <Edit2 size={14} />
              </button>
              <button
                className="flashcard-creator__card-action-btn flashcard-creator__card-action-btn--danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCard(card.id);
                }}
                title="Xóa"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Mode */}
      {showPreview && (
        <div className="flashcard-creator__preview">
          <div className="flashcard-creator__preview-header">
            <h4 className="flashcard-creator__preview-title">Chế Độ Xem Trước</h4>
            <button
              className="flashcard-creator__preview-close"
              onClick={() => setShowPreview(false)}
            >
              ×
            </button>
          </div>
          <div className="flashcard-creator__preview-content">
            <p className="flashcard-creator__preview-text">
              Học viên sẽ thấy flashcard ở chế độ toàn màn hình với hiệu ứng lật 3D
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
