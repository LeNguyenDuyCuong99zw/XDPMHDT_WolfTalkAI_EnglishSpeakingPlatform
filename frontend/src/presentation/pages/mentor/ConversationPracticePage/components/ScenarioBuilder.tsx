// src/presentation/pages/mentor/ConversationPracticePage/components/ScenarioBuilder.tsx

import React, { useState } from 'react';
import { FileText, Plus, X, ChevronDown } from 'lucide-react';
import './ScenarioBuilder.css';

interface ScenarioStep {
  id: string;
  order: number;
  instruction: string;
  example: string;
}

interface ScenarioBuilderProps {
  onSave: (scenario: { description: string; steps: ScenarioStep[] }) => void;
}

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({ onSave }) => {
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<ScenarioStep[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);

  // Mock templates
  const templates = [
    {
      name: 'Gọi điện thoại',
      description: 'Thực hành cuộc gọi điện thoại chuyên nghiệp',
      steps: [
        { instruction: 'Chào hỏi và giới thiệu', example: 'Hello, this is [Name] from [Company]' },
        { instruction: 'Nêu mục đích cuộc gọi', example: 'I am calling regarding...' },
        { instruction: 'Kết thúc cuộc gọi', example: 'Thank you for your time. Have a great day!' },
      ],
    },
    {
      name: 'Thuyết trình',
      description: 'Cấu trúc bài thuyết trình cơ bản',
      steps: [
        { instruction: 'Mở đầu thu hút', example: 'Good morning everyone. Today I will...' },
        { instruction: 'Trình bày nội dung chính', example: 'First, let me show you...' },
        { instruction: 'Kết luận và Q&A', example: 'In conclusion... Any questions?' },
      ],
    },
    {
      name: 'Hướng dẫn đường',
      description: 'Chỉ đường và hỏi đường',
      steps: [
        { instruction: 'Hỏi lịch sự', example: 'Excuse me, could you tell me how to get to...?' },
        { instruction: 'Nghe hướng dẫn', example: 'Go straight, turn left at...' },
        { instruction: 'Cảm ơn', example: 'Thank you so much for your help!' },
      ],
    },
  ];

  const handleAddStep = () => {
    const newStep: ScenarioStep = {
      id: Date.now().toString(),
      order: steps.length + 1,
      instruction: '',
      example: '',
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const handleUpdateStep = (
    id: string,
    field: 'instruction' | 'example',
    value: string
  ) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      )
    );
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    setDescription(template.description);
    const templateSteps: ScenarioStep[] = template.steps.map((step, index) => ({
      id: Date.now().toString() + index,
      order: index + 1,
      instruction: step.instruction,
      example: step.example,
    }));
    setSteps(templateSteps);
    setShowTemplates(false);
  };

  const handleSave = () => {
    if (!description.trim() || steps.length === 0) {
      alert('Vui lòng nhập mô tả và ít nhất 1 bước');
      return;
    }
    onSave({ description, steps });
  };

  return (
    <div className="scenario-builder">
      {/* Header */}
      <div className="scenario-builder__header">
        <div className="scenario-builder__header-icon">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="scenario-builder__title">Tạo Tình Huống Thực Tế</h3>
          <p className="scenario-builder__subtitle">
            Thiết lập kịch bản hội thoại từng bước
          </p>
        </div>
      </div>

      {/* Templates section */}
      <div className="scenario-builder__section">
        <button
          className="scenario-builder__section-toggle"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <span>Sử dụng mẫu có sẵn</span>
          <ChevronDown
            size={18}
            className={`scenario-builder__chevron ${
              showTemplates ? 'scenario-builder__chevron--open' : ''
            }`}
          />
        </button>

        {showTemplates && (
          <div className="scenario-builder__templates">
            {templates.map((template, index) => (
              <div
                key={index}
                className="scenario-builder__template-card"
                onClick={() => handleUseTemplate(template)}
              >
                <h4 className="scenario-builder__template-name">
                  {template.name}
                </h4>
                <p className="scenario-builder__template-desc">
                  {template.description}
                </p>
                <span className="scenario-builder__template-steps">
                  {template.steps.length} bước
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="scenario-builder__field">
        <label className="scenario-builder__label">Mô Tả Tình Huống</label>
        <textarea
          className="scenario-builder__textarea"
          placeholder="Ví dụ: Học viên sẽ thực hành đặt bàn tại nhà hàng qua điện thoại..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Steps */}
      <div className="scenario-builder__section">
        <div className="scenario-builder__section-header">
          <h4 className="scenario-builder__section-title">
            Các Bước Thực Hiện
          </h4>
          <button
            className="scenario-builder__add-btn"
            onClick={handleAddStep}
          >
            <Plus size={16} />
            <span>Thêm Bước</span>
          </button>
        </div>

        <div className="scenario-builder__steps">
          {steps.map((step, index) => (
            <div key={step.id} className="scenario-builder__step">
              <div className="scenario-builder__step-header">
                <span className="scenario-builder__step-number">
                  Bước {index + 1}
                </span>
                <button
                  className="scenario-builder__remove-btn"
                  onClick={() => handleRemoveStep(step.id)}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="scenario-builder__step-field">
                <input
                  type="text"
                  className="scenario-builder__input"
                  placeholder="Hướng dẫn (vd: Chào hỏi và giới thiệu bản thân)"
                  value={step.instruction}
                  onChange={(e) =>
                    handleUpdateStep(step.id, 'instruction', e.target.value)
                  }
                />
              </div>
              <div className="scenario-builder__step-field">
                <input
                  type="text"
                  className="scenario-builder__input scenario-builder__input--example"
                  placeholder="Ví dụ (vd: Good morning, my name is...)"
                  value={step.example}
                  onChange={(e) =>
                    handleUpdateStep(step.id, 'example', e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {steps.length === 0 && (
          <div className="scenario-builder__empty">
            <p>Chưa có bước nào. Nhấn "Thêm Bước" để bắt đầu.</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="scenario-builder__actions">
        <button
          className="scenario-builder__save-btn"
          onClick={handleSave}
          disabled={!description.trim() || steps.length === 0}
        >
          Lưu Kịch Bản
        </button>   
      </div>
    </div>
  );
};
