import React, { useState, useRef } from 'react';
import './PronunciationPractice.css';

interface WordFeedback {
  word: string;
  confidence: number;
  isCorrect: boolean;
  color: 'green' | 'orange' | 'red';
  issue?: string;
}

interface PronunciationResult {
  attemptId: number;
  transcript: string;
  expectedText: string;
  accuracyScore: number;
  pronunciationScore: number;
  overallScore: number;
  level: string;
  wordFeedback: WordFeedback[];
  suggestions: string[];
}

// SAMPLE_SENTENCES removed in favor of API

const PronunciationPractice: React.FC = () => {
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSentence, setIsFetchingSentence] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const fetchNewSentence = async (type: 'NORMAL' | 'HARD' = 'NORMAL') => {
    setIsFetchingSentence(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8086/api/v1/pronunciation/sentences/random?type=${type}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sentence');
      }

      const data = await response.json();
      setCurrentSentence(data.text);
    } catch (err) {
      console.error('Error fetching sentence:', err);
      // Fallback
      setError("Could not load sentence. Please try again.");
      setCurrentSentence("Error loading sentence.");
    } finally {
      setIsFetchingSentence(false);
    }
  };

  React.useEffect(() => {
    fetchNewSentence();
  }, []);

  // Convert audio to WAV format (16kHz mono) for Vosk
  const convertToWav = async (audioBlob: Blob): Promise<Blob> => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;
    
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Convert to mono if stereo
    const channelData = audioBuffer.numberOfChannels > 1
      ? audioBuffer.getChannelData(0)
      : audioBuffer.getChannelData(0);
    
    // Create WAV file
    const wavBuffer = encodeWAV(channelData, audioBuffer.sampleRate);
    return new Blob([wavBuffer], { type: 'audio/wav' });
  };

  // Encode PCM data to WAV format
  const encodeWAV = (samples: Float32Array, sampleRate: number): ArrayBuffer => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // PCM format
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return buffer;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Convert to WAV
        const wavBlob = await convertToWav(audioBlob);
        
        await sendAudioToBackend(wavBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('expectedText', currentSentence);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8086/api/v1/pronunciation/check', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: PronunciationResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error sending audio:', err);
      setError('Failed to check pronunciation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setResult(null);
    fetchNewSentence();
  };

  const handleRetry = () => {
    setResult(null);
  };

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const renderWordWithColor = (word: string, color: string) => {
    return (
      <span key={word} className={`word word-${color}`}>
        {word}{' '}
      </span>
    );
  };

  if (result) {
    return (
      <div className="pronunciation-container result-view">
        <button className="close-button" onClick={() => setResult(null)}>×</button>
        
        <div className="header-section">
          <h1 className="page-title">✨ Results</h1>
          <p className="page-subtitle">Here's how you did!</p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${result.overallScore}%` }}></div>
        </div>

        <div className="result-card">
          <div className="card-header">
            <span className="instruction-badge">📝 Your pronunciation</span>
          </div>
          <div className="result-text">
            {result.wordFeedback.map((feedback, index) => 
              renderWordWithColor(feedback.word, feedback.color)
            )}
          </div>
          <div className="audio-controls">
            <button className="audio-button" onClick={playAudio}>
              <span className="audio-icon">🔊</span>
              <span className="button-label">Listen again</span>
            </button>
            <button className="retry-button" onClick={handleRetry}>
              <span className="retry-icon">🔄</span>
              <span className="button-label">Try again</span>
            </button>
          </div>
        </div>

        <div className="score-section">
          <div className="level-info">
            <div className="level-badge">
              <div className="level-label">YOUR LEVEL</div>
              <div className="level-value">{result.level}</div>
            </div>
            <div className="powered-by">POWERED BY 🐺 WOLFTALK</div>
          </div>

          <div className="score-circle">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - result.overallScore / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0099ff" />
                </linearGradient>
              </defs>
              <text x="80" y="90" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#000">
                {Math.round(result.overallScore)}%
              </text>
            </svg>
          </div>
        </div>

        {/* XP Earned Notification */}
        {result.overallScore >= 60 && (
          <div style={{
            marginTop: '24px',
            padding: '16px 24px',
            background: result.overallScore >= 70 
              ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
              : 'linear-gradient(135deg, #34d399, #10b981)',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            animation: 'slideIn 0.5s ease-out'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '4px'
            }}>
              🎉 +{result.overallScore >= 70 ? '5' : '3'} XP
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              {result.overallScore >= 70 ? 'Xuất sắc!' : 'Tốt lắm!'} Bạn đã nhận được điểm thưởng
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button className="retry-btn" onClick={handleRetry}>
            <span>🔄</span> PRACTICE AGAIN
          </button>
          <button className="continue-btn" onClick={() => handleContinue()}>
            <span>➡️</span> NEXT SENTENCE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pronunciation-container">
      <button className="close-button" onClick={() => window.history.back()}>×</button>
      
      <div className="header-section">
        <h1 className="page-title">🎯 Luyện Tập Phát Âm</h1>
        <p className="page-subtitle">Luyện tập phát âm tiếng Anh và nhận phản hồi ngay lập tức</p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '0%' }}></div>
      </div>

      <div className="practice-card">
        <div className="mode-selection" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
          <button 
            className="mode-btn normal"
            onClick={() => fetchNewSentence('NORMAL')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '2px solid #667eea',
              background: 'white',
              color: '#667eea',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🌱 Normal Practice
          </button>
          <button 
            className="mode-btn hard"
            onClick={() => fetchNewSentence('HARD')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
          >
            🔥 Challenge Mode
          </button>
        </div>

        <div className="card-header">
          <span className="instruction-badge">📖 Read this sentence</span>
        </div>
        <div className="sentence-text">
          {isFetchingSentence ? (
            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Loading sentence...</span>
          ) : (
            currentSentence
          )}
        </div>
        <button className="audio-button" onClick={playAudio}>
          <span className="audio-icon">🔊</span>
          <span className="button-label">Listen</span>
        </button>
      </div>

      <div className="recording-section">
        <button 
          className={`mic-button ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
        >
          <span className="mic-icon">🎤</span>
          {isRecording && <div className="pulse-ring"></div>}
        </button>
        
        <p className="recording-hint">
          {isRecording ? '🔴 Recording... Click to stop' : 'Click the microphone to start recording'}
        </p>
      </div>

      {isLoading && (
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <div className="loading-text">Analyzing your pronunciation...</div>
        </div>
      )}
      
      {error && <div className="error-text">{error}</div>}
    </div>
  );
};

export default PronunciationPractice;
