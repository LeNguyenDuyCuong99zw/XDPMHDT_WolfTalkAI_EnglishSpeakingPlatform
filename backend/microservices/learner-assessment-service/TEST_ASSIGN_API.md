# Test API Gán Bài Kiểm Tra

## Bước 1: Rebuild và restart service

```bash
cd backend/microservices
docker-compose build learner-assessment-service
docker-compose up -d learner-assessment-service
```

## Bước 2: Kiểm tra service đã chạy

```bash
docker-compose logs -f --tail 60 learner-assessment-service
```

Đợi đến khi thấy: `Started AssessmentServiceApplication`

## Bước 3: Test API gán bài

### Lấy danh sách bài kiểm tra
```bash
curl http://localhost:8085/api/assessments
```

Kết quả sẽ có `id: 1` (bài kiểm tra mặc định)

### Gán bài cho học viên
```bash
curl -X POST http://localhost:8085/api/mentor/assessments/assign \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d "{\"assessmentId\": 1, \"learnerIds\": [2, 3], \"dueDate\": \"2024-02-10T23:59:59\"}"
```

**Giải thích:**
- `assessmentId: 1` - ID bài kiểm tra (lấy từ API trên)
- `learnerIds: [2, 3]` - Danh sách ID học viên (lấy từ `/api/mentor/learners` của main backend)
- `X-User-Id: 1` - ID của mentor (tạm thời dùng header, sau này sẽ lấy từ JWT)

**Kết quả mong đợi:**
```json
{
  "message": "Đã gán bài kiểm tra thành công cho 2 học viên",
  "assignedCount": 2
}
```

## Bước 4: Kiểm tra database

```bash
# Kết nối PostgreSQL
psql -h localhost -p 5433 -U wolftalk -d wolftalk_db

# Query kiểm tra
SELECT * FROM learner_assessment_assignments;
```

Sẽ thấy 2 bản ghi với `learner_id = 2` và `learner_id = 3`

## Tiếp theo

Sau khi test thành công, chúng ta sẽ:
1. Tạo API cho learner xem bài được gán
2. Tạo API để learner bắt đầu làm bài
3. Tạo Frontend UI
