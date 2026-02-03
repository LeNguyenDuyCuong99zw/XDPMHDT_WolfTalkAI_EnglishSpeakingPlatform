# Test Mentor Grading APIs

## Giả định
- Learner đã nộp bài (attemptId = 1)
- Có 32 câu hỏi trong bài kiểm tra

## API 1: Xem danh sách bài đã nộp

```bash
curl http://localhost:8085/api/mentor/assessments/submissions?status=SUBMITTED
```

**Kết quả:**
```json
[
  {
    "attemptId": 1,
    "learnerId": 2,
    "learnerName": "User 2",
    "learnerEmail": "user2@example.com",
    "assessmentId": 1,
    "assessmentTitle": "Bài Kiểm Tra Đánh Giá Trình Độ Tiếng Anh",
    "status": "SUBMITTED",
    "submittedAt": "2024-02-04T03:45:00",
    "timeSpentMinutes": 55,
    "totalAnswered": 30,
    "totalQuestions": 32
  }
]
```

## API 2: Xem chi tiết bài nộp

```bash
curl http://localhost:8085/api/mentor/assessments/submissions/1
```

**Kết quả:** Trả về chi tiết tất cả câu hỏi và câu trả lời, bao gồm:
- Thông tin learner
- Thông tin assessment
- Danh sách answers với:
  - `answerText` (cho trắc nghiệm/essay)
  - `videoUrl` (cho speaking)
  - `audioUrl` (cho listening/pronunciation)
  - `correctAnswer` (đáp án đúng cho trắc nghiệm)

## API 3: Chấm điểm

```bash
curl -X POST http://localhost:8085/api/mentor/assessments/submissions/1/grade \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "answers": [
      {"answerId": 1, "score": 1, "feedback": "Correct"},
      {"answerId": 2, "score": 1, "feedback": "Correct"},
      {"answerId": 31, "score": 8, "feedback": "Good pronunciation, clear speech"},
      {"answerId": 32, "score": 7, "feedback": "Good grammar, needs more vocabulary"}
    ],
    "totalScore": 85,
    "levelResult": "B1"
  }'
```

**Giải thích:**
- `answers`: Mảng điểm cho từng câu
  - Trắc nghiệm: 1 điểm/câu (tự động chấm)
  - Speaking (video): 0-10 điểm
  - Writing (essay): 0-10 điểm
- `totalScore`: Tổng điểm (0-100)
- `levelResult`: Trình độ (A1, A2, B1, B2, C1, C2)

**Kết quả:** `"Chấm điểm thành công"`

## API 4: Learner xem kết quả

```bash
curl http://localhost:8085/api/learner/assessments/attempts/1/result \
  -H "X-User-Id: 2"
```

**Kết quả:**
```json
{
  "attemptId": 1,
  "assessmentTitle": "Bài Kiểm Tra Đánh Giá Trình Độ Tiếng Anh",
  "status": "GRADED",
  "submittedAt": "2024-02-04T03:45:00",
  "timeSpentMinutes": 55,
  "totalScore": 85,
  "levelResult": "B1",
  "breakdown": {},
  "overallFeedback": null
}
```

## Kiểm tra database

```sql
-- Xem điểm từng câu
SELECT question_id, score, feedback 
FROM learner_answers 
WHERE learner_assessment_id = 1;

-- Xem tổng điểm
SELECT id, status, total_score, level_result 
FROM learner_assessments 
WHERE id = 1;

-- Xem status assignment
SELECT id, status 
FROM learner_assessment_assignments 
WHERE learner_id = 2 AND assessment_id = 1;
```

## Flow hoàn chỉnh End-to-End

### Mentor Side
1. Gán bài → `POST /api/mentor/assessments/assign`
2. Xem bài đã nộp → `GET /api/mentor/assessments/submissions`
3. Xem chi tiết → `GET /api/mentor/assessments/submissions/1`
4. Chấm điểm → `POST /api/mentor/assessments/submissions/1/grade`

### Learner Side
1. Xem bài được gán → `GET /api/learner/assessments`
2. Bắt đầu làm → `POST /api/learner/assessments/1/start`
3. Lấy câu hỏi → `GET /api/learner/assessments/1/questions`
4. Trả lời trắc nghiệm → `POST /api/learner/assessments/attempts/1/answer`
5. Upload video → `POST /api/learner/assessments/attempts/1/upload`
6. Nộp bài → `POST /api/learner/assessments/attempts/1/submit`
7. Xem kết quả → `GET /api/learner/assessments/attempts/1/result`

## Status Flow

```
ASSIGNED → IN_PROGRESS → SUBMITTED → GRADED
```

## Tiếp theo

- Auto-grading cho trắc nghiệm
- Frontend UI (Mentor + Learner)
- Integration với main backend
