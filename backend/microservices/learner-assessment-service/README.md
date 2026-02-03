# Learner Assessment Service

Microservice đánh giá và phân loại trình độ học viên tiếng Anh.

## Tính năng

- **20 câu trắc nghiệm** (Grammar & Vocabulary)
- **10 câu đọc hiểu** (2 đoạn văn, mỗi đoạn 5 câu hỏi)
- **1 bài nói** (Video 2 phút)
- **1 bài viết** (Essay 250-300 từ)
- **Thời gian**: 60 phút
- **Tự động seed dữ liệu** khi khởi động lần đầu

## Cấu trúc Database

- `assessments` - Bài kiểm tra
- `assessment_questions` - Câu hỏi
- `assessment_options` - Đáp án trắc nghiệm
- `learner_assessments` - Bài làm của học viên
- `learner_answers` - Câu trả lời

## API Endpoints

### Assessment Management
- `GET /api/assessments` - Lấy danh sách bài kiểm tra
- `GET /api/assessments/{id}` - Chi tiết bài kiểm tra (bao gồm tất cả câu hỏi)

### Mentor APIs
- `POST /api/mentor/assessments/assign` - Gán bài kiểm tra cho học viên
- `GET /api/mentor/assessments/submissions` - Xem danh sách bài đã nộp
- `GET /api/mentor/assessments/submissions/{id}` - Xem chi tiết bài nộp
- `POST /api/mentor/assessments/submissions/{id}/grade` - Chấm điểm

### Learner APIs
- `GET /api/learner/assessments` - Xem danh sách bài được gán
- `POST /api/learner/assessments/{id}/start` - Bắt đầu làm bài
- `GET /api/learner/assessments/{id}/questions` - Lấy danh sách câu hỏi
- `POST /api/learner/assessments/attempts/{attemptId}/answer` - Lưu câu trả lời
- `POST /api/learner/assessments/attempts/{attemptId}/upload` - Upload video/audio
- `POST /api/learner/assessments/attempts/{attemptId}/submit` - Nộp bài
- `GET /api/learner/assessments/attempts/{attemptId}/result` - Xem kết quả

## Cách chạy

### 1. Đảm bảo PostgreSQL đang chạy
```bash
# Database: wolftalk_db
# Port: 5433
# Username: wolftalk
# Password: wolftalk9999
```

### 2. Build và chạy service với Docker Compose
```bash
cd backend/microservices
docker-compose build learner-assessment-service
docker-compose up -d learner-assessment-service
```

Service sẽ chạy trên port **8085**.

### 3. Xem logs (60 dòng cuối)
```bash
docker-compose logs -f --tail 60 learner-assessment-service
```

### 4. Kiểm tra health
```
GET http://localhost:8085/actuator/health
```

### 5. Dừng service
```bash
docker-compose down learner-assessment-service
```

## Dữ liệu mẫu

Khi chạy lần đầu, service sẽ tự động tạo:
- 1 bài kiểm tra "Bài Kiểm Tra Đánh Giá Trình Độ Tiếng Anh"
- 32 câu hỏi:
  - 20 câu trắc nghiệm (Grammar & Vocabulary)
  - 10 câu đọc hiểu (2 đoạn văn)
  - 1 câu nói (Video)
  - 1 câu viết (Essay)

## Tech Stack

- Spring Boot 3.2.1
- Java 21
- PostgreSQL
- Lombok
- Spring Security
- Spring Data JPA
