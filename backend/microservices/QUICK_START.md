# Quick Start Guide - WolfTalk Microservices

## Bước 1: Chuẩn bị

### 1.1. Cài đặt Dependencies

```bash
# Kiểm tra Java version
java -version  # Cần Java 21

# Kiểm tra Maven
mvn -version   # Cần Maven 3.8+

# Kiểm tra Docker
docker --version
docker-compose --version
```

### 1.2. Lấy API Keys

1. **OpenAI API Key**:
   - Đăng ký tại: https://platform.openai.com/
   - Tạo API key tại: https://platform.openai.com/api-keys
   - Copy key để dùng sau

2. **Google Cloud Credentials**:
   - Tạo project tại: https://console.cloud.google.com/
   - Enable Speech-to-Text API và Text-to-Speech API
   - Tạo Service Account và download JSON credentials
   - Lưu file JSON vào `microservices/credentials/`

## Bước 2: Cấu hình

### 2.1. Tạo file .env

```bash
cd backend/microservices
cp .env.example .env
```

Sửa file `.env`:
```bash
OPENAI_API_KEY=sk-your-actual-openai-key-here
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

### 2.2. Đặt Google Credentials

```bash
mkdir -p credentials
cp /path/to/your/downloaded-credentials.json credentials/google-credentials.json
```

## Bước 3: Khởi động Microservices

### Option A: Dùng Docker Compose (Recommended)

```bash
cd backend/microservices
docker-compose up -d
```

Đợi khoảng 2-3 phút để tất cả services khởi động.

### Option B: Chạy từng service riêng (Development)

**Terminal 1 - Eureka Server:**
```bash
cd backend/microservices/eureka-server
mvn spring-boot:run
```

**Terminal 2 - API Gateway:**
```bash
cd backend/microservices/api-gateway
mvn spring-boot:run
```

**Terminal 3 - AI Learning Service:**
```bash
cd backend/microservices/ai-learning-service
export OPENAI_API_KEY=your-key
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
mvn spring-boot:run
```

## Bước 4: Kiểm tra

### 4.1. Kiểm tra Eureka Dashboard

Mở browser: http://localhost:8761

Bạn sẽ thấy các services đã đăng ký:
- API-GATEWAY
- AI-LEARNING-SERVICE

### 4.2. Test API Gateway

```bash
curl http://localhost:9000/actuator/health
```

Response:
```json
{"status":"UP"}
```

### 4.3. Test AI Service (cần token)

Đầu tiên, login để lấy token (nếu đã có auth service):
```bash
curl -X POST http://localhost:9000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

Test grammar check:
```bash
curl -X POST http://localhost:9000/api/v1/ai/grammar/check \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"I goes to school yesterday"}'
```

## Bước 5: Tích hợp với Frontend

### 5.1. Cập nhật Frontend Config

Trong React app, update API base URL:

```javascript
// src/config/api.js
export const API_BASE_URL = 'http://localhost:9000';

// Thay vì gọi trực tiếp backend cũ:
// const response = await fetch('http://localhost:8080/api/users');

// Gọi qua API Gateway:
const response = await fetch('http://localhost:9000/api/v1/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 5.2. Test Pronunciation từ Frontend

```javascript
const assessPronunciation = async (audioBlob, expectedText) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  formData.append('expectedText', expectedText);
  
  const response = await fetch('http://localhost:9000/api/v1/ai/pronunciation/assess', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
};
```

## Bước 6: Monitoring

### 6.1. Xem Logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ AI Learning Service
docker-compose logs -f ai-learning-service

# Chỉ API Gateway
docker-compose logs -f api-gateway
```

### 6.2. Kiểm tra Database

Mở PgAdmin: http://localhost:5050
- Email: admin@wolftalk.com
- Password: admin9999

Add server:
- Host: postgres
- Port: 5432
- Database: wolftalk_db
- Username: wolftalk
- Password: wolftalk9999

## Troubleshooting

### Lỗi: Service không start

```bash
# Xem logs
docker-compose logs service-name

# Restart service
docker-compose restart service-name

# Rebuild nếu cần
docker-compose up -d --build service-name
```

### Lỗi: OpenAI API error

1. Kiểm tra API key trong `.env`
2. Kiểm tra quota: https://platform.openai.com/usage
3. Restart service:
```bash
docker-compose restart ai-learning-service
```

### Lỗi: Google Cloud credentials

1. Kiểm tra file tồn tại:
```bash
ls -la credentials/google-credentials.json
```

2. Kiểm tra permissions:
```bash
chmod 644 credentials/google-credentials.json
```

3. Verify project ID trong `.env`

### Lỗi: Port already in use

```bash
# Tìm process đang dùng port
netstat -ano | findstr :9000  # Windows
lsof -i :9000                 # Linux/Mac

# Kill process hoặc đổi port trong application.properties
```

## Next Steps

1. ✅ Implement Auth Service để có JWT authentication
2. ✅ Implement User Service để quản lý users
3. ✅ Implement Conversation Service cho real-time chat
4. ✅ Implement Progress Tracking Service
5. ✅ Setup monitoring với Prometheus + Grafana
6. ✅ Deploy lên cloud (AWS/Azure/GCP)

## Useful Commands

```bash
# Stop tất cả services
docker-compose down

# Stop và xóa volumes
docker-compose down -v

# Rebuild tất cả
docker-compose up -d --build

# Xem resource usage
docker stats

# Clean up
docker system prune -a
```

## Support

Nếu gặp vấn đề, check:
1. README.md - Documentation đầy đủ
2. Logs - `docker-compose logs -f`
3. Eureka Dashboard - http://localhost:8761
4. Health endpoints - `/actuator/health`
