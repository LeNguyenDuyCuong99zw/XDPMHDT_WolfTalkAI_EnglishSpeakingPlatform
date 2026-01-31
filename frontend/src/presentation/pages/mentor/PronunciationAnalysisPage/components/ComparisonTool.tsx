// src/presentation/pages/mentor/PronunciationAnalysisPage/components/ComparisonTool.tsx

import React, { useState } from 'react';
import { GitCompare, Play, Pause, Volume2, RotateCcw } from 'lucide-react';
import './ComparisonTool.css';

interface ComparisonToolProps {
  learnerAudioURL?: string;
  nativeAudioURL?: string;
  word: string;
  phonetic?: string;
}

export const ComparisonTool: React.FC<ComparisonToolProps> = ({
  learnerAudioURL,
  nativeAudioURL,
  word,
  phonetic,
}) => {
  const [isLearnerPlaying, setIsLearnerPlaying] = useState(false);
  const [isNativePlaying, setIsNativePlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpectrum, setShowSpectrum] = useState(false);

  const learnerAudioRef = React.useRef<HTMLAudioElement>(null);
  const nativeAudioRef = React.useRef<HTMLAudioElement>(null);

  const toggleLearnerPlay = () => {
    if (learnerAudioRef.current) {
      if (isLearnerPlaying) {
        learnerAudioRef.current.pause();
      } else {
        learnerAudioRef.current.play();
      }
      setIsLearnerPlaying(!isLearnerPlaying);
    }
  };

  const toggleNativePlay = () => {
    if (nativeAudioRef.current) {
      if (isNativePlaying) {
        nativeAudioRef.current.pause();
      } else {
        nativeAudioRef.current.play();
      }
      setIsNativePlaying(!isNativePlaying);
    }
  };

  const playBothSequentially = async () => {
    // Play learner first
    if (learnerAudioRef.current) {
      learnerAudioRef.current.currentTime = 0;
      await learnerAudioRef.current.play();
      await new Promise((resolve) => {
        learnerAudioRef.current!.onended = resolve;
      });
    }

    // Then play native
    if (nativeAudioRef.current) {
      nativeAudioRef.current.currentTime = 0;
      await nativeAudioRef.current.play();
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (learnerAudioRef.current) {
      learnerAudioRef.current.playbackRate = speed;
    }
    if (nativeAudioRef.current) {
      nativeAudioRef.current.playbackRate = speed;
    }
  };

  const resetAll = () => {
    if (learnerAudioRef.current) {
      learnerAudioRef.current.pause();
      learnerAudioRef.current.currentTime = 0;
    }
    if (nativeAudioRef.current) {
      nativeAudioRef.current.pause();
      nativeAudioRef.current.currentTime = 0;
    }
    setIsLearnerPlaying(false);
    setIsNativePlaying(false);
    setPlaybackSpeed(1.0);
  };

  return (
    <div className="comparison-tool">
      {/* Header */}
      <div className="comparison-tool__header">
        <div className="comparison-tool__header-icon">
          <GitCompare size={20} />
        </div>
        <div>
          <h3 className="comparison-tool__title">So Sánh Phát Âm</h3>
          <p className="comparison-tool__subtitle">
            So sánh giữa phát âm của học viên và người bản xứ
          </p>
        </div>
      </div>

      {/* Word display */}
      <div className="comparison-tool__word-display">
        <h4 className="comparison-tool__word">{word}</h4>
        {phonetic && (
          <span className="comparison-tool__phonetic">{phonetic}</span>
        )}
      </div>

      {/* Audio players */}
      <div className="comparison-tool__players">
        {/* Learner audio */}
        <div className="comparison-tool__player comparison-tool__player--learner">
          <div className="comparison-tool__player-header">
            <div className="comparison-tool__player-label">
              <div className="comparison-tool__player-avatar comparison-tool__player-avatar--learner">
                L
              </div>
              <span>Học viên</span>
            </div>
          </div>

          <div className="comparison-tool__player-content">
            {learnerAudioURL ? (
              <>
                <audio
                  ref={learnerAudioRef}
                  src={learnerAudioURL}
                  onEnded={() => setIsLearnerPlaying(false)}
                  onPlay={() => setIsLearnerPlaying(true)}
                  onPause={() => setIsLearnerPlaying(false)}
                />
                <button
                  className="comparison-tool__play-btn comparison-tool__play-btn--learner"
                  onClick={toggleLearnerPlay}
                >
                  {isLearnerPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                {showSpectrum && (
                  <div className="comparison-tool__spectrum">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="comparison-tool__spectrum-bar"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="comparison-tool__player-empty">
                <Volume2 size={24} />
                <span>Chưa có audio</span>
              </div>
            )}
          </div>
        </div>

        {/* Native audio */}
        <div className="comparison-tool__player comparison-tool__player--native">
          <div className="comparison-tool__player-header">
            <div className="comparison-tool__player-label">
              <div className="comparison-tool__player-avatar comparison-tool__player-avatar--native">
                N
              </div>
              <span>Người bản xứ</span>
            </div>
          </div>

          <div className="comparison-tool__player-content">
            {nativeAudioURL ? (
              <>
                <audio
                  ref={nativeAudioRef}
                  src={nativeAudioURL}
                  onEnded={() => setIsNativePlaying(false)}
                  onPlay={() => setIsNativePlaying(true)}
                  onPause={() => setIsNativePlaying(false)}
                />
                <button
                  className="comparison-tool__play-btn comparison-tool__play-btn--native"
                  onClick={toggleNativePlay}
                >
                  {isNativePlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                {showSpectrum && (
                  <div className="comparison-tool__spectrum">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="comparison-tool__spectrum-bar"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="comparison-tool__player-empty">
                <Volume2 size={24} />
                <span>Chưa có audio</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="comparison-tool__controls">
        <button
          className="comparison-tool__control-btn comparison-tool__control-btn--primary"
          onClick={playBothSequentially}
          disabled={!learnerAudioURL || !nativeAudioURL}
        >
          <Play size={18} />
          <span>Nghe Liên Tiếp</span>
        </button>

        <button
          className="comparison-tool__control-btn"
          onClick={resetAll}
        >
          <RotateCcw size={18} />
          <span>Đặt Lại</span>
        </button>

        <button
          className="comparison-tool__control-btn"
          onClick={() => setShowSpectrum(!showSpectrum)}
        >
          <Volume2 size={18} />
          <span>{showSpectrum ? 'Ẩn' : 'Hiện'} Phổ</span>
        </button>
      </div>

      {/* Speed control */}
      <div className="comparison-tool__speed">
        <span className="comparison-tool__speed-label">Tốc độ phát:</span>
        <div className="comparison-tool__speed-buttons">
          {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
            <button
              key={speed}
              className={`comparison-tool__speed-btn ${
                playbackSpeed === speed
                  ? 'comparison-tool__speed-btn--active'
                  : ''
              }`}
              onClick={() => changeSpeed(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Analysis tips */}
      <div className="comparison-tool__tips">
        <h4 className="comparison-tool__tips-title">💡 Mẹo phân tích:</h4>
        <ul className="comparison-tool__tips-list">
          <li>Nghe kỹ sự khác biệt về âm thanh giữa hai phiên bản</li>
          <li>Chú ý đến trọng âm của từng âm tiết</li>
          <li>Quan sát độ dài của các nguyên âm</li>
          <li>Giảm tốc độ xuống 0.5x để nghe rõ hơn</li>
        </ul>
      </div>
    </div>
  );
};
