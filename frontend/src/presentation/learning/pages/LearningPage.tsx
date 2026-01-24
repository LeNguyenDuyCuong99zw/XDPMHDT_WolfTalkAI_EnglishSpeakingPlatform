
import React, { useState, useEffect } from 'react';
import { GetTopicsUseCase } from '../../../application/learning/use-cases/GetTopicsUseCase';
import { GetScenarioDetailUseCase } from '../../../application/learning/use-cases/GetScenarioDetailUseCase';
import { GetScenariosByTopicUseCase } from '../../../application/learning/use-cases/GetScenariosByTopicUseCase';
import { learningService } from '../../../application/learning/services/LearningService';
import { apiClient } from '../../../services/api';
import { TopicSelector } from '../components/TopicSelector';
import { VocabularyCard } from '../components/VocabularyCard';
import { GrammarCard } from '../components/GrammarCard';
import { ConversationView } from '../components/ConversationView';
import { LearningModeSelector } from '../components/LearningModeSelector';
import { PracticeView } from '../components/PracticeView';
import { LearningPreparation } from '../components/LearningPreparation';
import { SessionSummary } from '../components/SessionSummary';
import { LearningPathDashboard } from '../components/LearningPath/LearningPathDashboard';
import { CheckpointTestView } from '../components/LearningPath/CheckpointTestView';
import { PlacementTestIntro } from '../components/Placement/PlacementTestIntro';
import { PlacementTestView } from '../components/Placement/PlacementTestView';
import { PlacementResult } from '../components/Placement/PlacementResult';
import Sidebar from '../../../components/Sidebar';
import '../styles/Learning.css';
import type { Topic, ScenarioDetail } from '../../../domain/learning/entities/LearningMaterial';
import type { Unit } from '../../../domain/learning/entities/Syllabus';
import type { TestResult } from '../../../domain/learning/entities/PlacementTest';
import { FaTimes } from 'react-icons/fa';

// Define the stages of the new learning flow
type LearningStage = 'MODE_SELECTION' | 'TOPIC_SELECTION' | 'PATH_DASHBOARD' | 'PREPARATION' | 'SESSION' | 'SUMMARY' | 'PLACEMENT_INTRO' | 'PLACEMENT_TEST' | 'PLACEMENT_RESULT' | 'CHECKPOINT';
type SessionStep = 'vocab' | 'grammar' | 'conversation' | 'practice';

export const LearningPage: React.FC = () => {
    // Flow State
    const [stage, setStage] = useState<LearningStage>('MODE_SELECTION');
    const [mode, setMode] = useState<'quick' | 'pathway' | 'free' | 'placement' | null>(null);

    // Data State
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [scenarios, setScenarios] = useState<string[]>([]);
    const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
    const [scenarioDetail, setScenarioDetail] = useState<ScenarioDetail | null>(null);
    const [userLevel, setUserLevel] = useState<string>("A1");

    // Placement State
    const [placementResult, setPlacementResult] = useState<TestResult | null>(null);

    // UI State
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Session State
    const [sessionStep, setSessionStep] = useState<SessionStep>('vocab');
    const [practiceScore, setPracticeScore] = useState<number>(0);
    const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);

    // Services
    const getTopicsUseCase = new GetTopicsUseCase(learningService);
    const getScenarioDetailUseCase = new GetScenarioDetailUseCase(learningService);
    const getScenariosByTopicUseCase = new GetScenariosByTopicUseCase(learningService);

    useEffect(() => {
        loadTopics();
    }, []);

    const loadTopics = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getTopicsUseCase.execute();
            setTopics(data);
        } catch (err) {
            console.error("Error loading topics:", err);
            setError("Không thể tải danh sách chủ đề. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handler: User selects a mode
    const handleSelectMode = (selectedMode: 'quick' | 'pathway' | 'free' | 'placement') => {
        setMode(selectedMode);
        if (selectedMode === 'free') {
            setStage('TOPIC_SELECTION');
        } else if (selectedMode === 'pathway') {
            setStage('PATH_DASHBOARD');
        } else if (selectedMode === 'placement') {
            setStage('PLACEMENT_INTRO');
        } else {
            alert("Chế độ này đang được phát triển!");
        }
    };

    // Handler: User selects a topic
    const handleSelectTopic = async (topicName: string) => {
        setSelectedTopic(topicName);
        try {
            setIsLoading(true);
            setError(null);
            const scenarioList = await getScenariosByTopicUseCase.execute(topicName);
            setScenarios(scenarioList);
        } catch (err) {
            console.error("Error loading scenarios:", err);
            setError("Không thể tải danh sách tình huống. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handler: User selects a scenario
    const handleSelectScenario = async (scenario: string, autoStart: boolean = false) => {
        setSelectedScenarioId(scenario);
        // Reset specific states when entering preparation
        setScenarioDetail(null);
        setStage('PREPARATION');

        try {
            setIsLoading(true);
            setError(null);
            const detail = await getScenarioDetailUseCase.execute(scenario, userLevel);
            setScenarioDetail(detail);

            // Auto-start session if requested (e.g., from Unit selection)
            if (autoStart) {
                setStage('SESSION');
                setSessionStep('vocab');
                setPracticeScore(0);
            }
        } catch (err) {
            console.error("Error loading scenario details:", err);
            setError(`Không thể tải nội dung cho tình huống "${scenario}".`);
            // Reset to prevent getting stuck in PREPARATION without data
            setStage('TOPIC_SELECTION');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Unit Selection from Learning Path
    const handleSelectUnit = async (unit: Unit) => {
        setCurrentUnitId(unit.id); // Track current unit ID
        setScenarioDetail(null);
        setStage('PREPARATION');

        try {
            setIsLoading(true);
            setError(null);

            // Fetch content from backend via learningService
            const detail = await learningService.getUnitContent(unit);
            setScenarioDetail(detail);

            // Auto-start the session
            setStage('SESSION');
            setSessionStep('vocab');
            setPracticeScore(0);
        } catch (err) {
            console.error("Error loading unit content:", err);
            setError(`Không thể tải nội dung cho bài học "${unit.title}".`);
            setStage('PATH_DASHBOARD');
        } finally {
            setIsLoading(false);
        }
    };


    const handleStartSession = () => {
        setStage('SESSION');
        setSessionStep('vocab');
        setPracticeScore(0);
    };

    const handleCompleteSession = async (score: number) => {
        setPracticeScore(score);

        // If part of a unit, mark unit as complete to unlock next one
        if (currentUnitId) {
            try {
                // Determine if pass? For now assume completion is enough.
                const { syllabusService } = await import('../../../application/learning/services/SyllabusService');
                // Calculate percentage score roughly. Assuming max score is usually total questions * 10
                // For simplicity, we just pass the raw score or normalize it. 
                // Let's normalize to 0-100 based on scenarioDetail if available.
                let normalizedScore = score;
                if (scenarioDetail && scenarioDetail.practice) {
                    const max = scenarioDetail.practice.questions.length * 10;
                    if (max > 0) normalizedScore = Math.round((score / max) * 100);
                }

                await syllabusService.completeUnit(currentUnitId, normalizedScore);
                console.log(`Unit ${currentUnitId} marked as completed with score ${normalizedScore}.`);

                // Fetch updated stats (optional here, Dashboard will reload)
                await apiClient.get<any>('/dashboard/stats');
            } catch (err) {
                console.error("Failed to update unit progress:", err);
            }
        }

        setStage('SUMMARY');
    };

    const handleBackToMode = () => {
        setStage('MODE_SELECTION');
        setMode(null);
        setSelectedTopic(null);
        setScenarios([]);
        setScenarioDetail(null);
        setCurrentUnitId(null);
        setError(null);
    };

    const handleBackToTopics = () => {
        if (mode === 'pathway') {
            setStage('PATH_DASHBOARD');
        } else {
            setStage('TOPIC_SELECTION');
        }
        setSelectedScenarioId(null);
        setScenarioDetail(null);
        setError(null);
    };

    // Global loading state (optional, or handle within specific sections)
    if (isLoading && !topics.length && !scenarios.length && !scenarioDetail) {
        return <div className="learning-container loading">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return (
            <div className="learning-container error">
                <div className="error-message">
                    <h3>Đã xảy ra lỗi</h3>
                    <p>{error}</p>
                    <button className="primary-btn" onClick={handleBackToMode}>Quay lại trang chủ</button>
                    {stage === 'TOPIC_SELECTION' && <button className="secondary-btn" onClick={() => setError(null)}>Thử lại</button>}
                </div>
            </div>
        );
    }



    const handleLevelChange = async (newLevel: string) => {
        setUserLevel(newLevel);
        if (selectedScenarioId) {
            try {
                setIsLoading(true);
                // Re-fetch with new level
                const detail = await getScenarioDetailUseCase.execute(selectedScenarioId, newLevel);
                setScenarioDetail(detail);
            } catch (err) {
                console.error("Error reloading scenario level:", err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleStartCheckpoint = () => {
        setStage('CHECKPOINT');
    };

    const handleCheckpointComplete = async (result: any) => {
        console.log('Checkpoint complete:', result);
        if (result.isPassed) {
            // Unlock next level logic here (mock)
            const { syllabusService } = await import('../../../application/learning/services/SyllabusService');
            // Assuming next level is A2 for now, logic could be dynamic
            await syllabusService.unlockLevel('A2');
            alert("Chúc mừng! Bạn đã hoàn thành cấp độ A1 và mở khóa A2.");
            setUserLevel('A2'); // Auto switch to new level view?
        }
        setStage('PATH_DASHBOARD');
    };

    return (
        <div className="learning-page-layout">
            <Sidebar />
            <div className="learning-main-content">
                {/* Stage: Mode Selection */}
                {stage === 'MODE_SELECTION' && (
                    <LearningModeSelector onSelectMode={handleSelectMode} />
                )}

                {/* Stage: Placement Test Flow */}
                {stage === 'PLACEMENT_INTRO' && (
                    <PlacementTestIntro
                        onStartTest={() => setStage('PLACEMENT_TEST')}
                        onSkipTest={() => {
                            setUserLevel('A1');
                            setStage('PATH_DASHBOARD');
                        }}
                    />
                )}

                {stage === 'PLACEMENT_TEST' && (
                    <PlacementTestView
                        onComplete={(result) => {
                            setPlacementResult(result);
                            setStage('PLACEMENT_RESULT');
                        }}
                    />
                )}

                {stage === 'PLACEMENT_RESULT' && placementResult && (
                    <PlacementResult
                        result={placementResult}
                        onStartCourse={() => {
                            setUserLevel(placementResult.recommendedLevel);
                            setStage('PATH_DASHBOARD');
                        }}
                    />
                )}

                {stage === 'CHECKPOINT' && (
                    <CheckpointTestView
                        levelId={userLevel}
                        onComplete={handleCheckpointComplete}
                        onCancel={() => setStage('PATH_DASHBOARD')}
                    />
                )}

                {/* Stage: Learning Path Dashboard (Structured) */}
                {stage === 'PATH_DASHBOARD' && (
                    <div>
                        <LearningPathDashboard
                            onSelectUnit={handleSelectUnit}
                            onStartCheckpoint={handleStartCheckpoint}
                            onBack={handleBackToMode}
                            userLevel={userLevel}
                        />
                    </div>
                )}

                {/* Stage: Topic Selection (Free) */}
                {stage === 'TOPIC_SELECTION' && (
                    <TopicSelector
                        topics={topics}
                        selectedTopic={selectedTopic}
                        scenarios={scenarios}
                        selectedScenario={selectedScenarioId}
                        onSelectTopic={handleSelectTopic}
                        onSelectScenario={handleSelectScenario}
                        onBack={handleBackToMode}
                    />
                )}

                {/* Stage: Preparation */}
                {stage === 'PREPARATION' && (
                    isLoading ? (
                        <div className="learning-container loading">Đang tải nội dung bài học...</div>
                    ) : scenarioDetail ? (
                        <LearningPreparation
                            scenario={scenarioDetail}
                            userLevel={userLevel}
                            onLevelChange={handleLevelChange}
                            onStart={handleStartSession}
                            onBack={handleBackToTopics}
                        />
                    ) : (
                        <div className="state-empty">
                            <p>Không tìm thấy dữ liệu cho bài học này.</p>
                            <button onClick={handleBackToTopics} className="secondary-btn">Quay lại</button>
                        </div>
                    )
                )}

                {/* Stage: Learning Session */}
                {stage === 'SESSION' && scenarioDetail && (
                    <div className="learning-session">
                        <header className="session-header">
                            <button className="exit-btn" onClick={handleBackToTopics} title="Thoát bài học">
                                <FaTimes />
                            </button>

                            <div className="session-progress-container">
                                <div
                                    className={`progress-segment ${sessionStep === 'vocab' ? 'active' : 'completed'}`}
                                    onClick={() => setSessionStep('vocab')}
                                >
                                    <span className="progress-segment-label">Từ vựng</span>
                                </div>
                                <div
                                    className={`progress-segment ${sessionStep === 'grammar' ? 'active' : (['conversation', 'practice'].includes(sessionStep) ? 'completed' : '')}`}
                                    onClick={() => setSessionStep('grammar')}
                                >
                                    <span className="progress-segment-label">Ngữ pháp</span>
                                </div>
                                <div
                                    className={`progress-segment ${sessionStep === 'conversation' ? 'active' : (sessionStep === 'practice' ? 'completed' : '')}`}
                                    onClick={() => setSessionStep('conversation')}
                                >
                                    <span className="progress-segment-label">Hội thoại</span>
                                </div>
                                <div
                                    className={`progress-segment ${sessionStep === 'practice' ? 'active' : ''}`}
                                    onClick={() => setSessionStep('practice')}
                                >
                                    <span className="progress-segment-label">Luyện tập</span>
                                </div>
                            </div>
                        </header>

                        <div className="session-content">
                            {sessionStep === 'vocab' && (
                                <div className="vocab-list">
                                    {scenarioDetail.vocabulary.length > 0 ? (
                                        scenarioDetail.vocabulary.map((vocab, idx) => (
                                            <VocabularyCard key={idx} vocab={vocab} index={idx} />
                                        ))
                                    ) : (
                                        <p className="empty-msg">Chưa có từ vựng cho bài này.</p>
                                    )}
                                    <div className="nav-actions">
                                        <button className="next-btn" onClick={() => setSessionStep('grammar')}>Tiếp theo: Ngữ pháp</button>
                                    </div>
                                </div>
                            )}

                            {sessionStep === 'grammar' && (
                                <div className="grammar-list">
                                    {scenarioDetail.grammar.length > 0 ? (
                                        scenarioDetail.grammar.map((grammar, idx) => (
                                            <GrammarCard key={idx} grammar={grammar} index={idx} />
                                        ))
                                    ) : (
                                        <p className="empty-msg">Chưa có ngữ pháp cho bài này.</p>
                                    )}
                                    <div className="nav-actions">
                                        <button className="prev-btn" onClick={() => setSessionStep('vocab')}>Quay lại</button>
                                        <button className="next-btn" onClick={() => setSessionStep('conversation')}>Tiếp theo: Hội thoại</button>
                                    </div>
                                </div>
                            )}


                            {sessionStep === 'conversation' && (
                                <div className="conversation-section">
                                    {scenarioDetail.conversation.length > 0 ? (
                                        <ConversationView turns={scenarioDetail.conversation} />
                                    ) : (
                                        <p className="empty-msg">Chưa có hội thoại mẫu cho bài này.</p>
                                    )}
                                    <div className="nav-actions">
                                        <button className="prev-btn" onClick={() => setSessionStep('grammar')}>Quay lại</button>
                                        <button className="next-btn" onClick={() => setSessionStep('practice')}>Tiếp theo: Luyện tập</button>
                                    </div>
                                </div>
                            )}

                            {sessionStep === 'practice' && (
                                <div className="practice-section">
                                    {scenarioDetail.practice && scenarioDetail.practice.questions.length > 0 ? (
                                        <PracticeView
                                            exercise={scenarioDetail.practice}
                                            onBack={() => setSessionStep('conversation')}
                                            onComplete={(score) => handleCompleteSession(score)}
                                        />
                                    ) : (
                                        <div className="empty-state">
                                            <p className="empty-msg">Chưa có bài tập cho phần này.</p>
                                            <button className="finish-btn" onClick={() => handleCompleteSession(0)}>Hoàn thành bài học</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* Stage: Summary */}
                {stage === 'SUMMARY' && scenarioDetail && (
                    <SessionSummary
                        scenarioName={scenarioDetail.scenarioName}
                        vocabCount={scenarioDetail.vocabulary.length}
                        grammarCount={scenarioDetail.grammar.length}
                        score={practiceScore}
                        maxScore={scenarioDetail.practice?.questions.length ? scenarioDetail.practice.questions.length * 10 : 0}
                        onHome={handleBackToTopics} // Return to Path or Topic
                        onRetry={() => handleSelectScenario(scenarioDetail.scenarioName)}
                    />
                )}
            </div>
        </div>
    );
};

export default LearningPage;
