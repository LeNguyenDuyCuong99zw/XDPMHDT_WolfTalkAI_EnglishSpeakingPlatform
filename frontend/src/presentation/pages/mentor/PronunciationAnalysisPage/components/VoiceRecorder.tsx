// src/presentation/pages/mentor/PronunciationAnalysisPage/components/VoiceRecorder.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Upload, Download } from 'lucide-react';
import './VoiceRecorder.css';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  onUpload?: (file: File) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onUpload,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete?.(audioBlob, recordingTime);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi này?')) {
      if (audioURL) URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      setRecordingTime(0);
      setIsPlaying(false);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        setAudioURL(url);
        onUpload?.(file);
      } else {
        alert('Vui lòng chọn file âm thanh (mp3, wav, webm, ...)');
      }
    }
  };

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = `pronunciation-${Date.now()}.webm`;
      a.click();
    }
  };

  return (
    <div className="voice-recorder">
      {/* Header */}
      <div className="voice-recorder__header">
        <div className="voice-recorder__header-icon">
          <Mic size={20} />
        </div>
        <div>
          <h3 className="voice-recorder__title">Ghi Âm Giọng Nói</h3>
          <p className="voice-recorder__subtitle">
            Ghi lại giọng đọc của học viên để phân tích
          </p>
        </div>
      </div>

      {/* Recording controls */}
      <div className="voice-recorder__controls">
        {!isRecording && !audioURL && (
          <button
            className="voice-recorder__btn voice-recorder__btn--record"
            onClick={startRecording}
          >
            <Mic size={20} />
            <span>Bắt Đầu Ghi Âm</span>
          </button>
        )}

        {isRecording && (
          <div className="voice-recorder__recording-panel">
            <div className="voice-recorder__recording-info">
              <div className="voice-recorder__recording-indicator">
                <span className="voice-recorder__rec-dot" />
                <span>REC</span>
              </div>
              <span className="voice-recorder__time">
                {formatTime(recordingTime)}
              </span>
            </div>

            <div className="voice-recorder__recording-actions">
              {!isPaused ? (
                <button
                  className="voice-recorder__btn voice-recorder__btn--pause"
                  onClick={pauseRecording}
                >
                  <Pause size={18} />
                  <span>Tạm dừng</span>
                </button>
              ) : (
                <button
                  className="voice-recorder__btn voice-recorder__btn--resume"
                  onClick={resumeRecording}
                >
                  <Play size={18} />
                  <span>Tiếp tục</span>
                </button>
              )}

              <button
                className="voice-recorder__btn voice-recorder__btn--stop"
                onClick={stopRecording}
              >
                <Square size={18} />
                <span>Dừng & Lưu</span>
              </button>
            </div>
          </div>
        )}

        {audioURL && !isRecording && (
          <div className="voice-recorder__playback">
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="voice-recorder__playback-controls">
              <button
                className="voice-recorder__play-btn"
                onClick={togglePlayback}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <div className="voice-recorder__playback-info">
                <span className="voice-recorder__playback-duration">
                  {formatTime(recordingTime)}
                </span>
                <div className="voice-recorder__waveform-preview">
                  {/* Simple visual representation */}
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={i}
                      className="voice-recorder__waveform-bar"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="voice-recorder__playback-actions">
              <button
                className="voice-recorder__icon-btn"
                onClick={downloadRecording}
                title="Tải xuống"
              >
                <Download size={18} />
              </button>
              <button
                className="voice-recorder__icon-btn voice-recorder__icon-btn--danger"
                onClick={deleteRecording}
                title="Xóa"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload option */}
      {!isRecording && !audioURL && (
        <div className="voice-recorder__upload">
          <div className="voice-recorder__divider">
            <span>hoặc</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button
            className="voice-recorder__btn voice-recorder__btn--upload"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} />
            <span>Tải File Âm Thanh Lên</span>
          </button>
          <p className="voice-recorder__upload-hint">
            Hỗ trợ: MP3, WAV, WEBM, OGG
          </p>
        </div>
      )}
    </div>
  );
};
