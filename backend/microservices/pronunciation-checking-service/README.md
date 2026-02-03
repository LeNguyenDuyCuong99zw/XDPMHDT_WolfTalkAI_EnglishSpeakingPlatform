# Pronunciation Checking Service

Microservice for pronunciation checking using Vosk API (free, offline speech recognition).

## Features

- ✅ Free and offline speech recognition with Vosk
- ✅ Word-level confidence scores
- ✅ Color-coded pronunciation feedback (green/orange/red)
- ✅ Pronunciation scoring and level assessment
- ✅ History tracking

## Requirements

- Java 21
- Maven 3.8+
- PostgreSQL
- Vosk English model (~40MB)

## Setup

### 1. Download Vosk Model

```bash
cd backend/microservices
mkdir -p models
cd models
wget https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
unzip vosk-model-small-en-us-0.15.zip
mv vosk-model-small-en-us-0.15 vosk-model-en-us-0.22
```

### 2. Build

```bash
cd pronunciation-checking-service
mvn clean package
```

### 3. Run

```bash
java -jar target/pronunciation-checking-service-1.0.0.jar
```

Or with Docker:

```bash
docker-compose up pronunciation-checking-service
```

## API Endpoints

### Check Pronunciation

```bash
POST /api/v1/pronunciation/check
Content-Type: multipart/form-data

Parameters:
- audio: Audio file (WAV format recommended)
- expectedText: Expected text to compare against

Response:
{
  "attemptId": 1,
  "transcript": "we will get to enjoy a nice room...",
  "expectedText": "We will get to enjoy a nice room...",
  "accuracyScore": 95.5,
  "pronunciationScore": 61.0,
  "overallScore": 78.25,
  "level": "Lower intermediate",
  "wordFeedback": [
    {
      "word": "we",
      "confidence": 0.95,
      "isCorrect": true,
      "color": "green",
      "issue": null
    },
    {
      "word": "beautiful",
      "confidence": 0.42,
      "isCorrect": true,
      "color": "red",
      "issue": "Low confidence - pronunciation needs improvement"
    }
  ],
  "suggestions": [
    "Practice these words: beautiful, view",
    "Try speaking more slowly and clearly"
  ]
}
```

### Get History

```bash
GET /api/v1/pronunciation/history
GET /api/v1/pronunciation/history/{userId}
```

## Configuration

See `application.properties` for configuration options:

- `vosk.model.path` - Path to Vosk model
- `vosk.sample.rate` - Audio sample rate (default: 16000)
- Database connection settings
- JWT secret

## Color Coding

- **Green** (confidence ≥ 0.7): Good pronunciation
- **Orange** (0.5 ≤ confidence < 0.7): Needs improvement
- **Red** (confidence < 0.5): Poor pronunciation

## Level Assessment

- **Advanced**: 90%+
- **Upper intermediate**: 75-89%
- **Intermediate**: 60-74%
- **Lower intermediate**: 45-59%
- **Beginner**: <45%
