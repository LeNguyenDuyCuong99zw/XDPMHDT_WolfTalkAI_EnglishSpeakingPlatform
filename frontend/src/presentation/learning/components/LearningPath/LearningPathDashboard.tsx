import React, { useState, useEffect } from 'react';
import type { Level, Unit } from '../../../../domain/learning/entities/Syllabus';
import { syllabusService } from '../../../../application/learning/services/SyllabusService';
import { UnitNode } from './UnitNode';
import { GlobalLoader } from '../../../components/molecules/GlobalLoader/GlobalLoader';
import '../../styles/LearningPath.css';

interface LearningPathDashboardProps {
    onSelectUnit: (unit: Unit) => void;
    onStartCheckpoint: () => void;
    onBack: () => void;
    userLevel: string;
}

type LevelGroup = 'Basic' | 'Independent' | 'Proficient';

export const LearningPathDashboard: React.FC<LearningPathDashboardProps> = ({ onSelectUnit, onStartCheckpoint, onBack, userLevel }) => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [selectedLevelId, setSelectedLevelId] = useState<string>('A1');
    const [selectedGroup, setSelectedGroup] = useState<LevelGroup>('Basic');
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Drag to scroll state
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (scrollContainerRef.current) {
            setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
            setScrollLeft(scrollContainerRef.current.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        if (scrollContainerRef.current) {
            const x = e.pageX - scrollContainerRef.current.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast factor
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    useEffect(() => {
        loadLevels();
    }, []);

    useEffect(() => {
        if (userLevel) {
            setSelectedLevelId(userLevel);
        }
    }, [userLevel]);

    useEffect(() => {
        if (selectedLevelId) {
            loadUnits(selectedLevelId);
        }
    }, [selectedLevelId]);

    const loadLevels = async () => {
        const data = await syllabusService.getLevels();
        setLevels(data);
        // Auto-select group based on first unlocked level if needed, for now default Basic
    };

    const loadUnits = async (levelId: string) => {
        setIsLoading(true);
        const data = await syllabusService.getUnitsByLevel(levelId);
        setUnits(data);
        setIsLoading(false);
    };

    const displayedLevels = levels.filter(level => level.group === selectedGroup);

    return (
        <div className="learning-path-dashboard">
            {/* Group Selector */}
            <div className="group-selector">
                <button onClick={onBack} style={{ marginRight: '1rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>
                    &larr;
                </button>
                {(['Basic', 'Independent', 'Proficient'] as LevelGroup[]).map(group => (
                    <button
                        key={group}
                        className={`group-tab ${selectedGroup === group ? 'active' : ''}`}
                        onClick={() => setSelectedGroup(group)}
                    >
                        {group === 'Basic' && 'Basic (A1-A2)'}
                        {group === 'Independent' && 'Independent (B1-B2)'}
                        {group === 'Proficient' && 'Proficient (C1-C2)'}
                    </button>
                ))}
            </div>

            {/* Level Selector Header - Filtered by Group */}
            <div className="level-selector-strip">
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', flex: 1 }}>
                    {displayedLevels.map(level => (
                        <button
                            key={level.id}
                            className={`level-tab ${selectedLevelId === level.id ? 'active' : ''} ${level.status}`}
                            onClick={() => setSelectedLevelId(level.id)}
                            disabled={level.status === 'locked'}
                            style={{ borderBottomColor: selectedLevelId === level.id ? level.color : 'transparent' }}
                        >
                            <span className="level-id">{level.id}</span>
                            <span className="level-name">{level.name}</span>
                        </button>
                    ))}
                </div>
                <button
                    className="primary-btn"
                    onClick={onStartCheckpoint}
                    style={{
                        fontSize: '0.9rem',
                        padding: '0.5rem 1rem',
                        whiteSpace: 'nowrap',
                        alignSelf: 'center',
                        marginLeft: '1rem',
                        boxShadow: '0 4px 10px rgba(88, 204, 2, 0.3)'
                    }}
                >
                    🔥 Thi lên bậc ({userLevel})
                </button>
            </div>

            {/* Path Content */}
            <div className="path-content-area">
                <div className="path-header">
                    <h3>Lộ trình {selectedLevelId} - {levels.find(l => l.id === selectedLevelId)?.name}</h3>
                    <p>{levels.find(l => l.id === selectedLevelId)?.description}</p>
                </div>

                {isLoading ? (
                    <GlobalLoader />
                ) : (
                    <div
                        className="units-path-list"
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        {units.length > 0 ? (
                            units.map((unit, index) => (
                                <div key={unit.id} className="path-step">
                                    <UnitNode
                                        unit={unit}
                                        onClick={isDragging ? () => { } : onSelectUnit} // Prevent click when dragging
                                        levelColor={levels.find(l => l.id === selectedLevelId)?.color || '#4CAF50'}
                                    />
                                    {/* Connector Line (except for last item) */}
                                    {index < units.length - 1 && <div className="path-connector"></div>}
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                Nội dung cho cấp độ này đang được cập nhật.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
