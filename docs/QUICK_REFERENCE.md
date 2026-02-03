# 🚀 Quick Reference - Backend Leaderboard APIs

## 📋 Endpoints

### 1️⃣ Get Top Leaderboard (This Week)

```bash
GET /api/leaderboard/weekly?limit=100

Response:
[
  {
    "rank": 1,
    "userId": 5,
    "firstName": "Nguyễn",
    "lastName": "Anh",
    "avatar": "https://...",
    "weeklyXp": 350,
    "tier": "GOLD",
    "tierEmoji": "🥇",
    "weekStart": "2026-01-27T00:00:00",
    "weekEnd": "2026-02-02T23:59:59"
  },
  ...
]
```

### 2️⃣ Get My Stats (Authenticated)

```bash
GET /api/leaderboard/stats/me
Authorization: Bearer <token>

Response:
{
  "userId": 123,
  "firstName": "Minh",
  "lastName": "Hoa",
  "avatar": "https://...",
  "weeklyXp": 150,
  "rank": 15,
  "tier": "SILVER",
  "tierEmoji": "🥈",
  "weekStart": "2026-01-27T00:00:00",
  "weekEnd": "2026-02-02T23:59:59"
}
```

### 3️⃣ Get My Ranking History

```bash
GET /api/leaderboard/history
Authorization: Bearer <token>

Response:
[
  {
    "rank": 15,
    "userId": 123,
    "weeklyXp": 150,
    "tier": "SILVER",
    "tierEmoji": "🥈",
    "weekStart": "2026-01-27T00:00:00",
    "weekEnd": "2026-02-02T23:59:59"
  },
  {
    "rank": 42,
    "weeklyXp": 85,
    "tier": "BRONZE",
    "weekStart": "2026-01-20T00:00:00",
    "weekEnd": "2026-01-26T23:59:59"
  }
]
```

---

## 🎮 XP System

### How XP is Calculated

User completes challenge → Get XP:

```
Base XP (Difficulty Level)
├─ Level 1: 10 XP
├─ Level 2: 15 XP
├─ Level 3: 20 XP
├─ Level 4: 25 XP
└─ Level 5: 30 XP

+ Speed Bonus (if < 15s): +5 XP
+ Accuracy Bonus (if > 90%): +10 XP
+ First Try Bonus: +5 XP

= Total XP (Max 50 per challenge)
```

### Example Calculation

```
Challenge: Difficulty 3, Time 10s, Accuracy 100%, First Try ✅

baseXP = 20
+ 5 (speed < 15s)
+ 10 (accuracy > 90%)
+ 5 (first try)
= 40 XP ✅
```

---

## 📊 Tier System

| Tier    | Icon | XP Range |
| ------- | ---- | -------- |
| Bronze  | ⬜   | 0-100    |
| Silver  | 🥈   | 100-300  |
| Gold    | 🥇   | 300-500  |
| Diamond | 💎   | 500+     |

---

## ⏰ Weekly Schedule

```
Monday    00:00 UTC → New week starts
          Leaderboard resets
          All users get weeklyXp = 0
          ✅ Fresh start!

...

Sunday    23:59 UTC → Week ends
          Leaderboard locks
          Next Monday resets
```

---

## 🔧 Key Classes

### LeaderboardService

```java
// In LeaderboardService.java
- getOrCreateWeeklyEntry(user)
- calculateXP(challenge, timeTaken, isCorrect, firstTry, accuracy)
- updateWeeklyXP(user, xpEarned)
- getWeeklyLeaderboard(limit)
- getMyWeeklyStats(userId)
- getUserLeaderboardHistory(userId)
- resetWeeklyLeaderboard() // Scheduled
```

### LeaderboardController

```java
// In LeaderboardController.java
- getWeeklyLeaderboard() → GET /api/leaderboard/weekly
- getMyStats() → GET /api/leaderboard/stats/me
- getLeaderboardHistory() → GET /api/leaderboard/history
```

### DTOs

```java
WeeklyLeaderboardEntryDTO // For leaderboard display
UserLeaderboardStatsDTO   // For user's personal stats
```

---

## 🗄️ Database

### Table: leaderboard_entries

```sql
id BIGINT PRIMARY KEY
user_id BIGINT (FK users.id)
week_number INT (1-53)
year INT
weekly_xp INT (0-max)
rank INT
week_start DATETIME (Monday)
week_end DATETIME (Sunday)
created_at TIMESTAMP
updated_at TIMESTAMP

UNIQUE(user_id, year, week_number)
```

### Indexes

- `idx_leaderboard_year_week` - for quick ranking lookup
- `idx_leaderboard_weekly_xp` - for sorting by XP
- `idx_leaderboard_user_history` - for user's past ranking

---

## 🧪 Testing Checklist

```
□ Submit challenge → weeklyXp updates
□ GET /leaderboard/weekly → returns list sorted by XP
□ GET /leaderboard/stats/me → returns my rank & tier
□ GET /leaderboard/history → returns past weeks
□ XP calculation: difficulty ✓
□ XP calculation: speed bonus ✓
□ XP calculation: accuracy bonus ✓
□ XP calculation: first try ✓
□ Tier assignment correct
□ Weekly reset (Monday 00:00)
□ Ties handled correctly (same rank)
```

---

## 📝 Integration Points

### In ListeningService.submitAnswer()

```java
// When user answers correctly:
if (isCorrect) {
    // ... existing code ...

    // NEW: Calculate & update weekly XP
    int weeklyXP = leaderboardService.calculateXP(
        challenge, timeTaken, true, isFirstTry, accuracy
    );
    leaderboardService.updateWeeklyXP(user, weeklyXP);
    log.info("User {} earned {} XP", userId, weeklyXP);
}
```

---

## 🔐 Security

- ✅ Authentication required for `/stats/me` and `/history`
- ✅ Uses userId from `authentication.getName()`
- ✅ Users can only see their own stats
- ✅ Leaderboard is public (read-only)

---

## 🐛 Debugging

### Enable Debug Logs

```properties
# application.properties
logging.level.com.wolftalk.backend.service.LeaderboardService=DEBUG
logging.level.com.wolftalk.backend.controller.LeaderboardController=DEBUG
```

### Check Scheduled Task

```
Look for in logs:
"===== Starting weekly leaderboard reset ====="
"===== Weekly leaderboard reset completed ====="
```

---

## 📊 Expected Results After Submit

**Before:**

```json
{
  "rank": 42,
  "weeklyXp": 150
}
```

**After Submit (40 XP earned):**

```json
{
  "rank": 15,
  "weeklyXp": 190
}
```

---

## ✅ Status

- ✅ Backend: 100% Complete
- ✅ API: Ready
- ✅ Database: Migration ready
- ✅ Scheduler: Configured
- 🔄 Frontend: Next Phase
- 🔄 Mobile: Future Phase

---

**Last Updated**: 2026-01-28
**Version**: 1.0
**Status**: PRODUCTION READY ✅
