# Pronunciation Practice Module

Pronunciation practice feature với Vosk API backend integration.

## 📁 Files

- `PronunciationPractice.tsx` - Main component
- `PronunciationPractice.css` - Styles
- `index.ts` - Module exports

## 🎯 Features

### Màn hình 1: Recording Interface
- Hiển thị câu random để đọc
- Button phát audio mẫu (Text-to-Speech)
- Mic button để record giọng nói
- Wave animation background
- Recording indicator với pulse animation

### Màn hình 2: Results Display
- Word-level feedback với color coding:
  - 🟢 **Green**: Confidence ≥ 0.7 (Good)
  - 🟠 **Orange**: 0.5 ≤ Confidence < 0.7 (Needs improvement)
  - 🔴 **Red**: Confidence < 0.5 (Poor)
- Progress circle hiển thị overall score
- Level assessment (Beginner → Advanced)
- Buttons: "TIẾP TỤC" (retry) và "CÂU TIẾP THEO" (next sentence)

## 🔌 Backend Integration

Component tự động gọi API:
```
POST http://localhost:8086/api/v1/pronunciation/check
```

Headers:
- `Authorization: Bearer {token}` (lấy từ localStorage)

Body (FormData):
- `audio`: WAV audio blob
- `expectedText`: Câu cần đọc

## 📱 Usage

### 1. Add Route to App

```tsx
import { PronunciationPractice } from './pronunciation';

// In your router:
<Route path="/pronunciation-practice" element={<PronunciationPractice />} />
```

### 2. Link from Dashboard

```tsx
<Link to="/pronunciation-practice">
  <button>Practice Pronunciation</button>
</Link>
```

## 🎨 Customization

### Change Sample Sentences

Edit `SAMPLE_SENTENCES` array in `PronunciationPractice.tsx`:

```tsx
const SAMPLE_SENTENCES = [
  "Your custom sentence 1",
  "Your custom sentence 2",
  // ...
];
```

### Adjust Colors

Edit CSS variables in `PronunciationPractice.css`:

```css
.word-green { color: #4caf50; }
.word-orange { color: #ff9800; }
.word-red { color: #f44336; }
```

### Change API Endpoint

Update fetch URL in `sendAudioToBackend`:

```tsx
const response = await fetch('YOUR_API_URL/api/v1/pronunciation/check', {
  // ...
});
```

## 🔧 Requirements

- Browser with microphone access
- JWT token in localStorage (key: 'token')
- Backend service running on port 8086

## 🐛 Troubleshooting

### "Could not access microphone"
- Check browser permissions
- Ensure HTTPS (or localhost)

### "Failed to check pronunciation"
- Verify backend is running: `curl http://localhost:8086/api/v1/pronunciation/health`
- Check JWT token is valid
- Check CORS settings

### No audio recording
- Check MediaRecorder browser support
- Verify microphone is connected

## 📊 Response Format

Backend trả về:

```json
{
  "attemptId": 1,
  "transcript": "we will get to enjoy...",
  "expectedText": "We will get to enjoy...",
  "accuracyScore": 95.5,
  "pronunciationScore": 61.0,
  "overallScore": 78.25,
  "level": "Lower intermediate",
  "wordFeedback": [
    {
      "word": "we",
      "confidence": 0.95,
      "isCorrect": true,
      "color": "green"
    }
  ],
  "suggestions": [
    "Practice these words: beautiful, view"
  ]
}
```

## 🎯 Next Steps

1. Add to routing configuration
2. Test microphone permissions
3. Verify backend connection
4. Customize sentences for your use case
