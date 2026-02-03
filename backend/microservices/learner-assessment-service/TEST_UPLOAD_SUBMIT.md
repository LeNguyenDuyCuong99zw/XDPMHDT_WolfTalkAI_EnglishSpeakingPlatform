# Test File Upload và Submit APIs

## Giả định
- Đã bắt đầu làm bài và có `attemptId = 1`
- Question ID 31 = Video (Speaking)
- Question ID 32 = Essay (Writing) hoặc Audio

## API 1: Upload Video

```bash
curl -X POST http://localhost:8085/api/learner/assessments/attempts/1/upload \
  -H "X-User-Id: 2" \
  -F "file=@/path/to/video.mp4" \
  -F "questionId=31" \
  -F "fileType=video"
```

**Kết quả:**
```json
{
  "message": "Upload thành công",
  "fileUrl": "/uploads/assessments/1/video/attempt_1_question_31_uuid.mp4",
  "questionId": 31
}
```

## API 2: Upload Audio

```bash
curl -X POST http://localhost:8085/api/learner/assessments/attempts/1/upload \
  -H "X-User-Id: 2" \
  -F "file=@/path/to/audio.mp3" \
  -F "questionId=32" \
  -F "fileType=audio"
```

**Kết quả:**
```json
{
  "message": "Upload thành công",
  "fileUrl": "/uploads/assessments/1/audio/attempt_1_question_32_uuid.mp3",
  "questionId": 32
}
```

## API 3: Nộp bài

```bash
curl -X POST http://localhost:8085/api/learner/assessments/attempts/1/submit \
  -H "X-User-Id: 2"
```

**Kết quả:**
```json
{
  "message": "Nộp bài thành công! Mentor sẽ chấm điểm và bạn sẽ nhận được kết quả sớm.",
  "submittedAt": "2024-02-04T03:45:00",
  "totalAnswered": 30,
  "totalQuestions": 32
}
```

## Kiểm tra database

```sql
-- Xem file URLs trong answers
SELECT question_id, video_url, audio_url 
FROM learner_answers 
WHERE learner_assessment_id = 1;

-- Xem status bài làm
SELECT id, status, submitted_at, time_spent_minutes 
FROM learner_assessments 
WHERE id = 1;
```

## Validation

Service sẽ validate:
- ✅ File type (video: mp4/webm/mov/avi, audio: mp3/wav/m4a/ogg)
- ✅ File size (max 50MB - cấu hình trong application.properties)
- ✅ Learner chỉ upload cho bài làm của mình
- ✅ Không thể upload sau khi đã nộp bài
- ✅ Không thể nộp bài 2 lần

## File Structure

```
uploads/
  assessments/
    1/  (attemptId)
      video/
        attempt_1_question_31_uuid.mp4
      audio/
        attempt_1_question_32_uuid.mp3
```

## Flow hoàn chỉnh Learner

1. Xem bài được gán → `GET /api/learner/assessments`
2. Bắt đầu làm → `POST /api/learner/assessments/1/start`
3. Lấy câu hỏi → `GET /api/learner/assessments/1/questions`
4. Trả lời trắc nghiệm → `POST /api/learner/assessments/attempts/1/answer`
5. Upload video → `POST /api/learner/assessments/attempts/1/upload`
6. Upload audio → `POST /api/learner/assessments/attempts/1/upload`
7. Nộp bài → `POST /api/learner/assessments/attempts/1/submit`

## Tiếp theo

- API mentor xem bài đã nộp
- API mentor chấm điểm
- API learner xem kết quả
