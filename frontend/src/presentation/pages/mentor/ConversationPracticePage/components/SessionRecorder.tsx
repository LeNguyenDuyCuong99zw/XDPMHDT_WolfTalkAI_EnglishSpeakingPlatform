// src/presentation/pages/mentor/ConversationPracticePage/components/SessionRecorder.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  Circle,
  Square,
  Pause,
  Play,
  Download,
  Trash2,
  Clock,
  FileVideo,
} from 'lucide-react';
import './SessionRecorder.css';

interface Recording {
  id: string;
  name: string;
  duration: number;
  size: number; // in MB
  date: string;
  url?: string;
}

interface SessionRecorderProps {
  sessionId: string;
  onSaveRecording?: (recording: Recording) => void;
}

export const SessionRecorder: React.FC<SessionRecorderProps> = ({
  sessionId,
  onSaveRecording,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  // Removed unused currentRecording state

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopRecording();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (mb: number) => {
    if (mb < 1) {
      return `${(mb * 1024).toFixed(0)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const startRecording = async () => {
    try {
      // TODO: Implement actual screen + audio capture
      // const stream = await navigator.mediaDevices.getDisplayMedia({
      //   video: true,
      //   audio: true,
      // });

      // Mock recording start
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // TODO: Setup MediaRecorder
      // mediaRecorderRef.current = new MediaRecorder(stream);
      // mediaRecorderRef.current.ondataavailable = (e) => {
      //   chunksRef.current.push(e.data);
      // };
      // mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Không thể bắt đầu ghi. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // mediaRecorderRef.current.pause();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      // mediaRecorderRef.current.resume();
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (mediaRecorderRef.current) {
      // mediaRecorderRef.current.stop();
      // const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      // const url = URL.createObjectURL(blob);

      // Mock saved recording
      const newRecording: Recording = {
        id: Date.now().toString(),
        name: `Session ${sessionId} - ${new Date().toLocaleDateString('vi-VN')}`,
        duration: recordingTime,
        size: Math.random() * 50 + 10, // Random size 10-60 MB
        date: new Date().toISOString(),
        // url: url,
      };

      setRecordings([...recordings, newRecording]);
      onSaveRecording?.(newRecording);

      chunksRef.current = [];
    }

    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const deleteRecording = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi này?')) {
      setRecordings(recordings.filter((r) => r.id !== id));
    }
  };

  const downloadRecording = (recording: Recording) => {
    // TODO: Implement actual download
    alert(`Đang tải xuống: ${recording.name}`);
  };

  return (
    <div className="session-recorder">
      {/* Header */}
      <div className="session-recorder__header">
        <div className="session-recorder__header-icon">
          <FileVideo size={20} />
        </div>
        <div>
          <h3 className="session-recorder__title">Ghi Lại Buổi Học</h3>
          <p className="session-recorder__subtitle">
            Lưu lại video để xem và đánh giá sau
          </p>
        </div>
      </div>

      {/* Recording controls */}
      <div className="session-recorder__controls">
        {!isRecording ? (
          <button
            className="session-recorder__btn session-recorder__btn--start"
            onClick={startRecording}
          >
            <Circle size={20} />
            <span>Bắt Đầu Ghi</span>
          </button>
        ) : (
          <>
            <div className="session-recorder__time-display">
              <div className="session-recorder__rec-indicator">
                <span className="session-recorder__rec-dot" />
                REC
              </div>
              <span className="session-recorder__time">
                {formatTime(recordingTime)}
              </span>
            </div>

            <div className="session-recorder__action-buttons">
              {!isPaused ? (
                <button
                  className="session-recorder__btn session-recorder__btn--pause"
                  onClick={pauseRecording}
                >
                  <Pause size={18} />
                  <span>Tạm dừng</span>
                </button>
              ) : (
                <button
                  className="session-recorder__btn session-recorder__btn--resume"
                  onClick={resumeRecording}
                >
                  <Play size={18} />
                  <span>Tiếp tục</span>
                </button>
              )}

              <button
                className="session-recorder__btn session-recorder__btn--stop"
                onClick={stopRecording}
              >
                <Square size={18} />
                <span>Dừng & Lưu</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Recordings list */}
      {recordings.length > 0 && (
        <div className="session-recorder__list">
          <h4 className="session-recorder__list-title">
            Các bản ghi đã lưu ({recordings.length})
          </h4>
          <div className="session-recorder__recordings">
            {recordings.map((recording) => (
              <div key={recording.id} className="session-recorder__recording">
                <div className="session-recorder__recording-icon">
                  <FileVideo size={20} />
                </div>
                <div className="session-recorder__recording-info">
                  <h5 className="session-recorder__recording-name">
                    {recording.name}
                  </h5>
                  <div className="session-recorder__recording-meta">
                    <span>
                      <Clock size={12} />
                      {formatTime(recording.duration)}
                    </span>
                    <span>•</span>
                    <span>{formatFileSize(recording.size)}</span>
                    <span>•</span>
                    <span>
                      {new Date(recording.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="session-recorder__recording-actions">
                  <button
                    className="session-recorder__action-icon"
                    onClick={() => downloadRecording(recording)}
                    title="Tải xuống"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    className="session-recorder__action-icon session-recorder__action-icon--danger"
                    onClick={() => deleteRecording(recording.id)}
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recordings.length === 0 && !isRecording && (
        <div className="session-recorder__empty">
          <FileVideo size={32} className="session-recorder__empty-icon" />
          <p className="session-recorder__empty-text">
            Chưa có bản ghi nào. Nhấn "Bắt Đầu Ghi" để lưu lại buổi học.
          </p>
        </div>
      )}
    </div>
  );
};
