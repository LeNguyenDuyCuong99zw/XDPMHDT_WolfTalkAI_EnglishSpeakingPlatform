# Test Learner APIs

## Giả định
- Đã gán bài kiểm tra cho learner ID = 2 (xem `TEST_ASSIGN_API.md`)
- Assessment ID = 1

## API 1: Xem danh sách bài được gán

```bash
curl http://localhost:8085/api/learner/assessments \
  -H "X-User-Id: 2"
```

**Kết quả:**
```json
[
  {
    "assignmentId": 1,
    "assessmentId": 1,
    "title": "Bài Kiểm Tra Đánh Giá Trình Độ Tiếng Anh",
    "description": "...",
    "level": "INTERMEDIATE",
    "durationMinutes": 60,
    "totalQuestions": 32,
    "status": "ASSIGNED",
    "assignedAt": "2024-02-04T03:00:00",
    "dueDate": "2024-02-10T23:59:59",
    "attemptId": null
  }
]
```

## API 2: Bắt đầu làm bài

```bash
curl -X POST http://localhost:8085/api/learner/assessments/1/start \
  -H "X-User-Id: 2"
```

**Kết quả:**
```json
{
  "attemptId": 1,
  "assessmentId": 1,
  "startedAt": "2024-02-04T03:30:00",
  "durationMinutes": 60,
  "message": "Bắt đầu làm bài thành công. Chúc bạn làm bài tốt!"
}
```

Lưu lại `attemptId` để dùng cho các API tiếp theo.

## API 3: Lấy danh sách câu hỏi

```bash
curl http://localhost:8085/api/learner/assessments/1/questions
```

**Kết quả:** Trả về toàn bộ 32 câu hỏi với đáp án (để hiển thị trên UI)

## API 4: Lưu câu trả lời

### Câu trắc nghiệm (chọn đáp án B - option ID 2)
```bash
curl -X POST http://localhost:8085/api/learner/assessments/attempts/1/answer \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 2" \
  -d '{"questionId": 1, "answerText": "2"}'
```

### Câu viết (essay)
```bash
curl -X POST http://localhost:8085/api/learner/assessments/attempts/1/answer \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 2" \
  -d '{"questionId": 32, "answerText": "Social media has both advantages and disadvantages..."}'
```

**Kết quả:** `"Đã lưu câu trả lời"`

## Kiểm tra database

```sql
-- Xem bài làm
SELECT * FROM learner_assessments WHERE learner_id = 2;

-- Xem câu trả lời
SELECT * FROM learner_answers WHERE learner_assessment_id = 1;
```

## Flow hoàn chỉnh

1. **Mentor gán bài** → `POST /api/mentor/assessments/assign`
2. **Learner xem bài được gán** → `GET /api/learner/assessments`
3. **Learner bắt đầu làm** → `POST /api/learner/assessments/{id}/start`
4. **Learner lấy câu hỏi** → `GET /api/learner/assessments/{id}/questions`
5. **Learner trả lời từng câu** → `POST /api/learner/assessments/attempts/{attemptId}/answer`
6. **Learner nộp bài** → (Chưa implement)
7. **Mentor chấm điểm** → (Chưa implement)
8. **Learner xem kết quả** → (Chưa implement)

## Tiếp theo

- API upload video/audio
- API nộp bài
- API mentor chấm điểm
- Frontend UI
