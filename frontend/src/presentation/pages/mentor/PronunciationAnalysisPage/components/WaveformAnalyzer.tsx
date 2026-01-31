// src/presentation/pages/mentor/PronunciationAnalysisPage/components/WaveformAnalyzer.tsx

import React, { useRef, useEffect, useState } from 'react';
import { Activity, ZoomIn, ZoomOut, Maximize2, Play, Pause } from 'lucide-react';
import './WaveformAnalyzer.css';

interface WaveformAnalyzerProps {
  audioURL?: string;
  errors?: Array<{
    startTime: number;
    endTime: number;
    word: string;
    type: 'pronunciation' | 'stress' | 'intonation';
  }>;
}

export const WaveformAnalyzer: React.FC<WaveformAnalyzerProps> = ({
  audioURL,
  errors = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    // Generate mock waveform data
    const mockData = Array.from({ length: 500 }, () => Math.random());
    setWaveformData(mockData);
  }, [audioURL]);

  useEffect(() => {
    if (canvasRef.current && waveformData.length > 0) {
      drawWaveform();
    }
  }, [waveformData, currentTime, zoom, errors]);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw center line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw waveform
    const barWidth = (width / waveformData.length) * zoom;
    const barGap = 1;

    waveformData.forEach((value, index) => {
      const x = index * (barWidth + barGap);
      const barHeight = value * (height * 0.8);

      // Check if this position has an error
      const hasError = errors.some((error) => {
        const errorStart = (error.startTime / duration) * width;
        const errorEnd = (error.endTime / duration) * width;
        return x >= errorStart && x <= errorEnd;
      });

      // Color based on error
      if (hasError) {
        const error = errors.find((e) => {
          const errorStart = (e.startTime / duration) * width;
          const errorEnd = (e.endTime / duration) * width;
          return x >= errorStart && x <= errorEnd;
        });

        if (error?.type === 'pronunciation') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
        } else if (error?.type === 'stress') {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
        } else {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
        }
      } else {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.4)';
      }

      // Draw bars (top and bottom)
      ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight / 2);
      ctx.fillRect(x, centerY, barWidth, barHeight / 2);
    });

    // Draw playhead
    if (duration > 0) {
      const playheadX = (currentTime / duration) * width;
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;

    audioRef.current.currentTime = clickTime;
    setCurrentTime(clickTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  return (
    <div className="waveform-analyzer">
      {/* Header */}
      <div className="waveform-analyzer__header">
        <div className="waveform-analyzer__header-icon">
          <Activity size={20} />
        </div>
        <div>
          <h3 className="waveform-analyzer__title">Phân Tích Sóng Âm</h3>
          <p className="waveform-analyzer__subtitle">
            Trực quan hóa và định vị lỗi phát âm
          </p>
        </div>
      </div>

      {/* Waveform canvas */}
      <div className="waveform-analyzer__canvas-container">
        <canvas
          ref={canvasRef}
          className="waveform-analyzer__canvas"
          width={800}
          height={200}
          onClick={handleCanvasClick}
        />
        {!audioURL && (
          <div className="waveform-analyzer__empty">
            <Activity size={32} />
            <p>Chưa có file âm thanh. Vui lòng ghi âm hoặc tải file lên.</p>
          </div>
        )}
      </div>

      {/* Audio element */}
      {audioURL && (
        <audio
          ref={audioRef}
          src={audioURL}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Controls */}
      <div className="waveform-analyzer__controls">
        <div className="waveform-analyzer__playback">
          <button
            className="waveform-analyzer__play-btn"
            onClick={togglePlayback}
            disabled={!audioURL}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <div className="waveform-analyzer__time">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="waveform-analyzer__zoom-controls">
          <button
            className="waveform-analyzer__zoom-btn"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut size={18} />
          </button>
          <span className="waveform-analyzer__zoom-level">{zoom.toFixed(1)}x</span>
          <button
            className="waveform-analyzer__zoom-btn"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
          >
            <ZoomIn size={18} />
          </button>
        </div>

        <button className="waveform-analyzer__fullscreen-btn" title="Toàn màn hình">
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Error legend */}
      {errors.length > 0 && (
        <div className="waveform-analyzer__legend">
          <h4 className="waveform-analyzer__legend-title">Chú thích lỗi:</h4>
          <div className="waveform-analyzer__legend-items">
            <div className="waveform-analyzer__legend-item">
              <span className="waveform-analyzer__legend-color waveform-analyzer__legend-color--pronunciation" />
              <span>Phát âm</span>
            </div>
            <div className="waveform-analyzer__legend-item">
              <span className="waveform-analyzer__legend-color waveform-analyzer__legend-color--stress" />
              <span>Trọng âm</span>
            </div>
            <div className="waveform-analyzer__legend-item">
              <span className="waveform-analyzer__legend-color waveform-analyzer__legend-color--intonation" />
              <span>Ngữ điệu</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
