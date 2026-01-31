-- Migration: Add indexes to leaderboard_entries for better query performance
-- Created: 2026-01-28
-- This migration optimizes the leaderboard queries for weekly rankings

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_year_week ON leaderboard_entries(year, week_number);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_year_week ON leaderboard_entries(user_id, year, week_number);
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_xp ON leaderboard_entries(year, week_number, weekly_xp DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_history ON leaderboard_entries(user_id, year DESC, week_number DESC);

-- Add comment to leaderboard_entries table
-- ALTER TABLE leaderboard_entries COMMENT = 'Lưu trữ weekly leaderboard entries cho mỗi user mỗi tuần';

-- Verify table structure
SELECT * FROM leaderboard_entries LIMIT 1;
