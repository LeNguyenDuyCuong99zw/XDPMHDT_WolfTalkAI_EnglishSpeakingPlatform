# Google Gemini AI Integration

Đã thêm **Google Gemini AI** vào hệ thống microservices! 🎉

## ✨ Features

### Dual AI Provider Support
- **OpenAI GPT-4** - AI provider chính
- **Google Gemini Pro** - AI provider phụ với automatic fallback
- **AUTO mode** - Tự động thử OpenAI trước, nếu fail sẽ fallback sang Gemini

### AI Provider Service
Tất cả AI features đều hỗ trợ cả 2 providers:
- ✅ Pronunciation Assessment
- ✅ Grammar Checking
- ✅ Vocabulary Suggestions
- ✅ AI Conversation
- ✅ Detailed Feedback

## 🔧 Setup

### 1. Lấy Gemini API Key

1. Truy cập: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy API key

### 2. Cập nhật `.env`

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key

# Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

### 3. Rebuild và Restart

```bash
cd backend/microservices
docker compose down
docker compose up -d --build ai-learning-service
```

## 📡 API Usage

### Chọn AI Provider

Thêm parameter `?provider=` vào request:

#### AUTO Mode (Default - Recommended)
```bash
POST http://localhost:9000/api/v1/ai/grammar/check
# Không cần parameter, tự động dùng AUTO mode
# Thử OpenAI trước, nếu fail thì dùng Gemini
```

#### Chỉ định OpenAI
```bash
POST http://localhost:9000/api/v1/ai/grammar/check?provider=openai
Content-Type: application/json

{
  "text": "I goes to school yesterday"
}
```

#### Chỉ định Gemini
```bash
POST http://localhost:9000/api/v1/ai/grammar/check?provider=gemini
Content-Type: application/json

{
  "text": "I goes to school yesterday"
}
```

### Conversation với Provider Selection

```bash
POST http://localhost:9000/api/v1/ai/conversation/generate?provider=gemini
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "context": "casual conversation",
  "difficulty": "beginner"
}
```

Response:
```json
{
  "response": "Hi! I'm doing great, thank you for asking...",
  "suggestions": "Alternative ways to say this...",
  "provider": "GEMINI"
}
```

### Vocabulary Suggestions

```bash
POST http://localhost:9000/api/v1/ai/vocabulary/suggest?provider=auto
Content-Type: application/json

{
  "context": "business meeting",
  "level": "intermediate"
}
```

## 🎯 Fallback Mechanism

Khi sử dụng `provider=auto` (hoặc không chỉ định):

1. **Thử OpenAI GPT-4** trước
2. Nếu OpenAI fail (API error, quota exceeded, timeout):
   - Tự động chuyển sang **Gemini Pro**
   - Log warning về việc fallback
3. Nếu cả 2 đều fail:
   - Trả về default message
   - Log error

## 📊 So sánh OpenAI vs Gemini

| Feature | OpenAI GPT-4 | Google Gemini Pro |
|---------|--------------|-------------------|
| Quality | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Speed | Fast | Very Fast |
| Cost | $$$ | $$ |
| Rate Limit | Lower | Higher |
| Context Length | 8K tokens | 30K tokens |

## 🔍 Monitoring

### Check Logs

```bash
# Xem AI provider được sử dụng
docker compose logs -f ai-learning-service | grep -i "provider\|gemini\|openai"
```

### Example Log Output

```
INFO  - Using OpenAI for grammar check
WARN  - OpenAI failed, falling back to Gemini: Rate limit exceeded
INFO  - Gemini response: Great job! Your grammar is improving.
```

## 💡 Best Practices

1. **Use AUTO mode** - Để có reliability cao nhất
2. **Monitor costs** - Track usage của cả 2 providers
3. **Set appropriate timeouts** - Để fallback nhanh chóng
4. **Cache responses** - Cả 2 providers đều có caching

## 🚀 Advanced Usage

### Custom Provider Logic

Bạn có thể extend `AIProviderService` để:
- Load balance giữa providers
- Route based on user tier
- A/B testing
- Cost optimization

### Example: Load Balancing

```java
// Round-robin between providers
private AIProvider currentProvider = AIProvider.OPENAI;

public String generateResponse(String text) {
    AIProvider provider = currentProvider;
    currentProvider = (currentProvider == AIProvider.OPENAI) 
        ? AIProvider.GEMINI 
        : AIProvider.OPENAI;
    return aiProviderService.correctGrammar(text, provider);
}
```

## 🎓 Testing

### Test OpenAI
```bash
curl -X POST "http://localhost:9000/api/v1/ai/grammar/check?provider=openai" \
  -H "Content-Type: application/json" \
  -d '{"text":"She go to school"}'
```

### Test Gemini
```bash
curl -X POST "http://localhost:9000/api/v1/ai/grammar/check?provider=gemini" \
  -H "Content-Type: application/json" \
  -d '{"text":"She go to school"}'
```

### Test AUTO (Fallback)
```bash
# Tắt OpenAI bằng cách set invalid key
# System sẽ tự động fallback sang Gemini
curl -X POST "http://localhost:9000/api/v1/ai/grammar/check?provider=auto" \
  -H "Content-Type: application/json" \
  -d '{"text":"She go to school"}'
```

## 📝 Files Created

- `GeminiService.java` - Gemini API integration
- `AIProviderService.java` - Multi-provider management
- Updated `PronunciationService.java`
- Updated `GrammarService.java`
- Updated `AILearningController.java`
- Updated `pom.xml` - Added Gemini dependencies
- Updated `application.properties` - Gemini config
- Updated `docker-compose.yml` - Gemini env var

---

**Hệ thống giờ có 2 AI engines mạnh mẽ!** 🚀
