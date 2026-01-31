// src/presentation/pages/mentor/ConversationPracticePage/components/VideoCallRoom.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  Settings,
  Users,
  Maximize2,
} from 'lucide-react';
import './VideoCallRoom.css';

interface VideoCallRoomProps {
  sessionId: string;
  learnerName: string;
  onEndCall: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export const VideoCallRoom: React.FC<VideoCallRoomProps> = ({
  sessionId,
  learnerName,
  onEndCall,
  onStartRecording,
  onStopRecording,
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Simulate call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Simulate connection after 2 seconds
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // TODO: Implement actual video toggle with WebRTC
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // TODO: Implement actual audio toggle with WebRTC
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      onStopRecording?.();
    } else {
      setIsRecording(true);
      onStartRecording?.();
    }
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // TODO: Implement screen sharing with WebRTC
  };

  const handleEndCall = () => {
    if (window.confirm('Bạn có chắc muốn kết thúc cuộc gọi?')) {
      onEndCall();
    }
  };

  return (
    <div className="video-call-room">
      {/* Header */}
      <div className="video-call-room__header">
        <div className="video-call-room__header-left">
          <div className="video-call-room__session-info">
            <Users size={18} />
            <span className="video-call-room__learner-name">{learnerName}</span>
          </div>
          <div
            className={`video-call-room__status video-call-room__status--${connectionStatus}`}
          >
            <span className="video-call-room__status-dot" />
            <span className="video-call-room__status-text">
              {connectionStatus === 'connecting' && 'Đang kết nối...'}
              {connectionStatus === 'connected' && 'Đã kết nối'}
              {connectionStatus === 'disconnected' && 'Mất kết nối'}
            </span>
          </div>
        </div>
        <div className="video-call-room__header-right">
          <div className="video-call-room__duration">{formatDuration(callDuration)}</div>
          {isRecording && (
            <div className="video-call-room__recording-indicator">
              <span className="video-call-room__recording-dot" />
              REC
            </div>
          )}
        </div>
      </div>

      {/* Video Area */}
      <div className="video-call-room__videos">
        {/* Remote video (learner) */}
        <div className="video-call-room__remote-video">
          <video
            ref={remoteVideoRef}
            className="video-call-room__video"
            autoPlay
            playsInline
          />
          {connectionStatus === 'connecting' && (
            <div className="video-call-room__video-placeholder">
              <div className="video-call-room__avatar">
                {learnerName.charAt(0).toUpperCase()}
              </div>
              <p className="video-call-room__placeholder-text">
                Đang chờ {learnerName} tham gia...
              </p>
            </div>
          )}
          <div className="video-call-room__video-label">{learnerName}</div>
        </div>

        {/* Local video (mentor) */}
        <div className="video-call-room__local-video">
          <video
            ref={localVideoRef}
            className="video-call-room__video"
            autoPlay
            playsInline
            muted
          />
          {!isVideoEnabled && (
            <div className="video-call-room__video-off">
              <VideoOff size={24} />
            </div>
          )}
          <div className="video-call-room__video-label">Bạn (Mentor)</div>
        </div>
      </div>

      {/* Controls */}
      <div className="video-call-room__controls">
        <div className="video-call-room__controls-group">
          {/* Audio toggle */}
          <button
            className={`video-call-room__control-btn ${
              !isAudioEnabled ? 'video-call-room__control-btn--off' : ''
            }`}
            onClick={toggleAudio}
            title={isAudioEnabled ? 'Tắt mic' : 'Bật mic'}
          >
            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Video toggle */}
          <button
            className={`video-call-room__control-btn ${
              !isVideoEnabled ? 'video-call-room__control-btn--off' : ''
            }`}
            onClick={toggleVideo}
            title={isVideoEnabled ? 'Tắt camera' : 'Bật camera'}
          >
            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen share */}
          <button
            className={`video-call-room__control-btn ${
              isScreenSharing ? 'video-call-room__control-btn--active' : ''
            }`}
            onClick={toggleScreenShare}
            title="Chia sẻ màn hình"
          >
            <Monitor size={20} />
          </button>

          {/* Recording */}
          <button
            className={`video-call-room__control-btn ${
              isRecording ? 'video-call-room__control-btn--recording' : ''
            }`}
            onClick={toggleRecording}
            title={isRecording ? 'Dừng ghi' : 'Bắt đầu ghi'}
          >
            <div className="video-call-room__record-icon" />
          </button>
        </div>

        {/* End call button */}
        <button
          className="video-call-room__end-call-btn"
          onClick={handleEndCall}
          title="Kết thúc cuộc gọi"
        >
          <PhoneOff size={20} />
        </button>

        <div className="video-call-room__controls-group">
          {/* Chat */}
          <button
            className={`video-call-room__control-btn ${
              showChat ? 'video-call-room__control-btn--active' : ''
            }`}
            onClick={() => setShowChat(!showChat)}
            title="Trò chuyện"
          >
            <MessageSquare size={20} />
          </button>

          {/* Fullscreen */}
          <button
            className="video-call-room__control-btn"
            onClick={() => {
              /* TODO: Fullscreen logic */
            }}
            title="Toàn màn hình"
          >
            <Maximize2 size={20} />
          </button>

          {/* Settings */}
          <button
            className={`video-call-room__control-btn ${
              showSettings ? 'video-call-room__control-btn--active' : ''
            }`}
            onClick={() => setShowSettings(!showSettings)}
            title="Cài đặt"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div className="video-call-room__chat">
          <div className="video-call-room__chat-header">
            <h4 className="video-call-room__chat-title">Trò chuyện</h4>
            <button
              className="video-call-room__chat-close"
              onClick={() => setShowChat(false)}
            >
              ×
            </button>
          </div>
          <div className="video-call-room__chat-messages">
            <p className="video-call-room__chat-empty">
              Chưa có tin nhắn nào
            </p>
          </div>
          <div className="video-call-room__chat-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="video-call-room__chat-field"
            />
            <button className="video-call-room__chat-send">Gửi</button>
          </div>
        </div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <div className="video-call-room__settings">
          <div className="video-call-room__settings-header">
            <h4 className="video-call-room__settings-title">Cài đặt</h4>
            <button
              className="video-call-room__settings-close"
              onClick={() => setShowSettings(false)}
            >
              ×
            </button>
          </div>
          <div className="video-call-room__settings-content">
            <div className="video-call-room__setting-item">
              <label>Camera</label>
              <select className="video-call-room__setting-select">
                <option>Default Camera</option>
              </select>
            </div>
            <div className="video-call-room__setting-item">
              <label>Microphone</label>
              <select className="video-call-room__setting-select">
                <option>Default Microphone</option>
              </select>
            </div>
            <div className="video-call-room__setting-item">
              <label>Speaker</label>
              <select className="video-call-room__setting-select">
                <option>Default Speaker</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
