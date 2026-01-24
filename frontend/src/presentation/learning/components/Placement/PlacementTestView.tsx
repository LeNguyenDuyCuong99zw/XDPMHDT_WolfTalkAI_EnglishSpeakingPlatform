import React, { useState, useEffect } from 'react';
import type { PlacementQuestion, TestResult } from '../../../../domain/learning/entities/PlacementTest';
import { placementService } from '../../../../application/learning/services/PlacementService';
import '../../styles/Learning.css';

interface PlacementTestViewProps {
    onComplete: (result: TestResult) => void;
}

export const PlacementTestView: React.FC<PlacementTestViewProps> = ({ onComplete }) => {
    const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<{ questionId: string; selectedOption: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        const data = await placementService.getQuestions();
        setQuestions(data);
        setIsLoading(false);
    };

    const handleNext = async () => {
        if (selectedOption === null) return;

        const newAnswers = [...answers, {
            questionId: questions[currentIdx].id,
            selectedOption: selectedOption
        }];
        setAnswers(newAnswers);
        setSelectedOption(null);

        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            // Finish Test
            setIsLoading(true);
            try {
                const result = await placementService.submitTest(newAnswers);
                onComplete(result);
            } catch (error) {
                console.error("Failed to submit placement test", error);
                // Handle error visually if needed
            }
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="learning-container loading">Đang tải bài kiểm tra...</div>;

    const question = questions[currentIdx];
    const progressPercent = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="practice-container">
            <div className="practice-header">
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{currentIdx + 1}/{questions.length}</span>
            </div>

            <div className="question-card">
                <div className="question-type-badge">QUESTION {currentIdx + 1} • {question.level}</div>
                <h3 className="question-text">{question.text}</h3>

                <div className="options-grid" style={{ gridTemplateColumns: '1fr' }}> {/* Stack vertically */}
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            className={`option-btn ${selectedOption === idx ? 'selected' : ''}`}
                            onClick={() => setSelectedOption(idx)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <div className="nav-actions" style={{ marginTop: '20px' }}>
                    <button
                        className="check-btn"
                        onClick={handleNext}
                        disabled={selectedOption === null}
                    >
                        {currentIdx === questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                    </button>
                </div>
            </div>
        </div>
    );
};
