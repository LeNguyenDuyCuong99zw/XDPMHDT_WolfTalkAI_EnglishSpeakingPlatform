import React, { useState, useEffect } from 'react';
import type { CheckpointTest, CheckpointResult } from '../../../../domain/learning/entities/CheckpointTest';
import { checkpointService } from '../../../../application/learning/services/CheckpointService';
import '../../styles/LearningPath.css'; // Reusing some styles

interface CheckpointTestViewProps {
    levelId: string;
    onComplete: (result: CheckpointResult) => void;
    onCancel: () => void;
}

export const CheckpointTestView: React.FC<CheckpointTestViewProps> = ({ levelId, onComplete, onCancel }) => {
    const [test, setTest] = useState<CheckpointTest | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<CheckpointResult | null>(null);

    useEffect(() => {
        loadTest();
    }, [levelId]);

    const loadTest = async () => {
        setIsLoading(true);
        const data = await checkpointService.getTestForLevel(levelId);
        setTest(data);
        setIsLoading(false);
    };

    const handleAnswer = (answer: any) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (!test) return;
        if (currentIndex < test.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitTest();
        }
    };

    const submitTest = async () => {
        if (!test) return;
        setIsSubmitting(true);
        // Map answers to required format { questionId, selectedOption }
        const formattedAnswers = answers.map((ans, idx) => ({
            questionId: test.questions[idx].id,
            selectedOption: ans
        })).filter(a => a.selectedOption !== undefined);

        const res = await checkpointService.submitTest(test.id, formattedAnswers);
        setResult(res);
        setIsSubmitting(false);
    };

    if (isLoading) return <div className="loading-spinner">Đang tải bài kiểm tra...</div>;
    if (!test) return <div className="error-message">Không tìm thấy bài kiểm tra cho cấp độ này. <button onClick={onCancel}>Quay lại</button></div>;

    if (result) {
        return (
            <div className="checkpoint-result-container">
                <div className="result-card">
                    <h2>{result.isPassed ? 'Chúc mừng! 🎉' : 'Rất tiếc... 😔'}</h2>
                    <div className="score-circle">
                        <span>{result.score}%</span>
                    </div>
                    <p>
                        {result.isPassed
                            ? `Bạn đã hoàn thành cấp độ ${levelId} và mở khóa cấp độ tiếp theo!`
                            : 'Bạn chưa đạt điểm yêu cầu. Hãy ôn tập lại và thử lại sau nhé.'}
                    </p>
                    <button className="primary-btn" onClick={() => onComplete(result)}>
                        {result.isPassed ? 'Tiếp tục hành trình' : 'Quay lại ôn tập'}
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentIndex];
    const isLastQuestion = currentIndex === test.questions.length - 1;

    return (
        <div className="checkpoint-test-container">
            <header className="test-header">
                <h3>{test.title}</h3>
                <div className="timer">20:00</div>
            </header>

            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${((currentIndex + 1) / test.questions.length) * 100}%` }}></div>
            </div>

            <div className="question-card">
                <span className="question-number">Câu {currentIndex + 1}/{test.questions.length}</span>
                <h4 className="question-text">{currentQuestion.text}</h4>

                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                    <div className="options-grid">
                        {currentQuestion.options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`option-btn ${answers[currentIndex] === idx ? 'selected' : ''}`}
                                onClick={() => handleAnswer(idx)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
                {currentQuestion.type === 'listening' && (
                    <div className="listening-section">
                        <div className="audio-placeholder">🔊 Audio Player Placeholder</div>
                        <div className="options-grid">
                            {currentQuestion.options?.map((opt, idx) => (
                                <button
                                    key={idx}
                                    className={`option-btn ${answers[currentIndex] === idx ? 'selected' : ''}`}
                                    onClick={() => handleAnswer(idx)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {currentQuestion.type === 'reading' && currentQuestion.options && (
                    <div className="options-grid">
                        {currentQuestion.options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`option-btn ${answers[currentIndex] === idx ? 'selected' : ''}`}
                                onClick={() => handleAnswer(idx)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
                {currentQuestion.type === 'speaking' && (
                    <div className="speaking-section">
                        <button className="record-btn">🎤 Nhấn để ghi âm</button>
                    </div>
                )}
            </div>

            <footer className="test-footer">
                <button className="secondary-btn" onClick={onCancel}>Thoát</button>
                <button
                    className="primary-btn"
                    onClick={handleNext}
                    disabled={answers[currentIndex] === undefined && currentQuestion.type !== 'speaking'} // speaking is optional mock for now
                >
                    {isLastQuestion ? (isSubmitting ? 'Đang nộp...' : 'Nộp bài') : 'Tiếp theo'}
                </button>
            </footer>
        </div>
    );
};
