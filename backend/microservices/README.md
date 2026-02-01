# WolfTalk AI Learning Microservices

Hệ thống microservices học tập tiếng Anh với AI, tích hợp OpenAI GPT-4 và Google Cloud Speech-to-Text.

## 📋 Tổng quan

Dự án này bao gồm các microservices sau:

- **Eureka Server** (Port 8761) - Service Discovery
- **API Gateway** (Port 9000) - Single entry point, routing, authentication
- **AI Learning Service** (Port 8083) - Pronunciation assessment, grammar checking, AI conversation
- **Auth Service** (Port 8081) - Authentication & authorization
- **User Service** (Port 8082) - User management
- **Conversation Service** (Port 8084) - Real-time conversations
- **Progress Tracking Service** (Port 8085) - Learning analytics

## 🏗️ Kiến trúc

```
Client (Web/Mobile)
        ↓
    API Gateway (Port 9000)
        ↓
    ┌───────────────────────────────┐
    ↓           ↓           ↓        ↓
Auth Service  User    AI Learning  Conversation
              Service   Service     Service
    ↓           ↓           ↓        ↓
    └───────────────────────────────┘
                ↓
        Eureka Server (Service Discovery)
```

## 🚀 Cài đặt và Chạy

### Prerequisites

- Java 21
- Maven 3.8+
- Docker & Docker Compose
- OpenAI API Key
- Google Cloud credentials (JSON file)

### 1. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `microservices`:

```bash
OPENAI_API_KEY=your-openai-api-key-here
GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id
```

### 2. Cấu hình Google Cloud Credentials

Đặt file Google Cloud credentials JSON vào thư mục `microservices/credentials/`:

```bash
mkdir -p microservices/credentials
cp /path/to/your/google-credentials.json microservices/credentials/google-credentials.json
```

### 3. Chạy với Docker Compose

```bash
cd backend/microservices
docker-compose up -d
```

### 4. Kiểm tra Services

- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:9000
- **PgAdmin**: http://localhost:5050 (admin@wolftalk.com / admin9999)

## 📡 API Endpoints

### Authentication (qua API Gateway)

```bash
POST http://localhost:9000/api/v1/auth/login
POST http://localhost:9000/api/v1/auth/register
```

### AI Learning Service

#### 1. Pronunciation Assessment

```bash
POST http://localhost:9000/api/v1/ai/pronunciation/assess
Headers: Authorization: Bearer <token>
Body (multipart/form-data):
  - audio: <audio file>
  - expectedText: "Hello, how are you?"
```

Response:
```json
{
  "assessmentId": 1,
  "transcript": "Hello, how are you?",
  "accuracyScore": 95.50,
  "fluencyScore": 88.00,
  "pronunciationScore": 92.30,
  "overallScore": 91.85,
  "wordFeedback": [...],
  "suggestions": [...],
  "generalFeedback": "Great job! Your pronunciation is excellent."
}
```

#### 2. Grammar Check

```bash
POST http://localhost:9000/api/v1/ai/grammar/check
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "I goes to school yesterday"
}
```

Response:
```json
{
  "checkId": 1,
  "originalText": "I goes to school yesterday",
  "correctedText": "I went to school yesterday",
  "errors": [
    {
      "type": "grammar",
      "message": "Incorrect verb tense",
      "incorrectText": "goes",
      "correctText": "went",
      "explanation": "Use past tense 'went' with 'yesterday'"
    }
  ],
  "errorCount": 1,
  "overallFeedback": "..."
}
```

#### 3. Vocabulary Suggestions

```bash
POST http://localhost:9000/api/v1/ai/vocabulary/suggest
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "context": "business meeting",
  "level": "intermediate"
}
```

#### 4. AI Conversation

```bash
POST http://localhost:9000/api/v1/ai/conversation/generate
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I want to practice ordering food",
  "context": "restaurant",
  "difficulty": "beginner"
}
```

Response:
```json
{
  "response": "Hello! I'd be happy to help you practice. What would you like to order?",
  "suggestions": "Alternative ways to express your request..."
}
```

## 🔧 Development

### Build từng service riêng lẻ

```bash
# Eureka Server
cd eureka-server
mvn clean package
java -jar target/eureka-server-1.0.0.jar

# API Gateway
cd api-gateway
mvn clean package
java -jar target/api-gateway-1.0.0.jar

# AI Learning Service
cd ai-learning-service
mvn clean package
java -jar target/ai-learning-service-1.0.0.jar
```

### Chạy local (không dùng Docker)

1. Start PostgreSQL:
```bash
cd ../../
docker-compose up -d postgres
```

2. Start Redis:
```bash
docker run -d -p 6379:6379 redis:7.2-alpine
```

3. Start Eureka Server:
```bash
cd microservices/eureka-server
mvn spring-boot:run
```

4. Start API Gateway:
```bash
cd microservices/api-gateway
mvn spring-boot:run
```

5. Start AI Learning Service:
```bash
cd microservices/ai-learning-service
export OPENAI_API_KEY=your-key
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
mvn spring-boot:run
```

## 🔗 Tích hợp với Backend Cũ

Backend cũ (port 8080) có thể được truy cập qua API Gateway:

```bash
# Thay vì gọi trực tiếp http://localhost:8080/api/users
# Gọi qua API Gateway:
GET http://localhost:9000/api/legacy/api/users
```

API Gateway sẽ tự động route request đến backend cũ.

## 📊 Monitoring

### Eureka Dashboard
- URL: http://localhost:8761
- Xem tất cả services đã đăng ký
- Kiểm tra health status

### Actuator Endpoints

```bash
# API Gateway health
GET http://localhost:9000/actuator/health

# AI Learning Service metrics
GET http://localhost:8083/actuator/metrics
```

## 🧪 Testing

### Test Pronunciation Assessment

```bash
curl -X POST http://localhost:9000/api/v1/ai/pronunciation/assess \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "audio=@test-audio.wav" \
  -F "expectedText=Hello world"
```

### Test Grammar Check

```bash
curl -X POST http://localhost:9000/api/v1/ai/grammar/check \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"I goes to school"}'
```

## 🐛 Troubleshooting

### Service không đăng ký với Eureka

1. Kiểm tra Eureka Server đã chạy: http://localhost:8761
2. Kiểm tra logs của service:
```bash
docker logs wolftalk-ai-learning-service
```

### OpenAI API errors

1. Kiểm tra API key đã được set đúng
2. Kiểm tra quota của OpenAI account
3. Xem logs:
```bash
docker logs wolftalk-ai-learning-service | grep OpenAI
```

### Google Cloud Speech errors

1. Kiểm tra credentials file tồn tại
2. Kiểm tra project ID đúng
3. Enable Speech-to-Text API trong Google Cloud Console

## 📝 Database Schema

### AI Learning Service Tables

```sql
-- Pronunciation Assessments
CREATE TABLE pronunciation_assessments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    transcript TEXT,
    expected_text TEXT,
    accuracy_score DECIMAL(5,2),
    fluency_score DECIMAL(5,2),
    pronunciation_score DECIMAL(5,2),
    feedback JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grammar Checks
CREATE TABLE grammar_checks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    original_text TEXT NOT NULL,
    corrected_text TEXT,
    errors JSONB,
    suggestions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Security

- JWT authentication qua API Gateway
- Rate limiting với Redis
- CORS configuration cho frontend
- Secure secrets với environment variables

## 📚 Tech Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 21
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Database**: PostgreSQL 16
- **Cache**: Redis 7.2
- **NoSQL**: MongoDB 7.0
- **AI**: OpenAI GPT-4
- **Speech**: Google Cloud Speech-to-Text/TTS
- **Containerization**: Docker

## 🤝 Contributing

Để thêm service mới:

1. Tạo thư mục trong `microservices/`
2. Tạo `pom.xml` với Eureka Client dependency
3. Thêm service vào `docker-compose.yml`
4. Update API Gateway routes
5. Update documentation

## 📄 License

MIT License

## 👥 Authors

WolfTalk Development Team
