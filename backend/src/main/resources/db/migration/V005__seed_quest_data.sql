-- =============================================
-- SEED DATA: Daily Quests & Monthly Challenges
-- Hệ thống nhiệm vụ hằng ngày giống Duolingo
-- =============================================

-- Clean up existing data
DELETE FROM user_quest_progress;
DELETE FROM daily_quests;
DELETE FROM monthly_challenges;

-- =============================================
-- DAILY QUESTS - Nhiệm vụ hằng ngày
-- =============================================

-- Quest Type: EARN_XP (Kiếm XP)
INSERT INTO daily_quests (quest_type, title, description, target_value, xp_reward, gems_reward, difficulty, is_active, created_at, updated_at)
VALUES 
('EARN_XP', 'Kiếm 10 KN', 'Hoàn thành bài học để kiếm kinh nghiệm', 10, 5, 0, 1, true, NOW(), NOW()),
('EARN_XP', 'Kiếm 20 KN', 'Đạt 20 kinh nghiệm trong ngày hôm nay', 20, 10, 0, 2, true, NOW(), NOW()),
('EARN_XP', 'Kiếm 50 KN', 'Thử thách: Kiếm 50 kinh nghiệm trong một ngày!', 50, 20, 1, 3, true, NOW(), NOW());

-- Quest Type: COMPLETE_LESSONS (Hoàn thành bài học)
INSERT INTO daily_quests (quest_type, title, description, target_value, min_accuracy, xp_reward, gems_reward, difficulty, is_active, created_at, updated_at)
VALUES 
('COMPLETE_LESSONS', 'Hoàn thành 1 bài học', 'Hoàn thành ít nhất 1 bài học hôm nay', 1, NULL, 5, 0, 1, true, NOW(), NOW()),
('COMPLETE_LESSONS', 'Hoàn thành 2 bài học với độ chính xác từ 80% trở lên', 'Hoàn thành bài học với độ chính xác cao', 2, 80, 10, 0, 2, true, NOW(), NOW()),
('COMPLETE_LESSONS', 'Hoàn thành 3 bài học với độ chính xác từ 90% trở lên', 'Thử thách độ chính xác cao!', 3, 90, 15, 1, 3, true, NOW(), NOW());

-- Quest Type: COMBO_XP (XP thưởng combo)
INSERT INTO daily_quests (quest_type, title, description, target_value, xp_reward, gems_reward, difficulty, is_active, created_at, updated_at)
VALUES 
('COMBO_XP', 'Đạt 10 KN thưởng combo', 'Trả lời đúng liên tiếp để nhận combo', 10, 5, 0, 1, true, NOW(), NOW()),
('COMBO_XP', 'Đạt 15 KN thưởng combo', 'Duy trì chuỗi trả lời đúng để nhận thưởng', 15, 15, 1, 2, true, NOW(), NOW()),
('COMBO_XP', 'Đạt 25 KN thưởng combo', 'Thử thách: Combo cực cao!', 25, 25, 2, 3, true, NOW(), NOW());

-- Quest Type: PERFECT_LESSONS (Bài học hoàn hảo)
INSERT INTO daily_quests (quest_type, title, description, target_value, xp_reward, gems_reward, difficulty, is_active, created_at, updated_at)
VALUES 
('PERFECT_LESSONS', 'Hoàn thành 1 bài học với 100% chính xác', 'Không có lỗi nào!', 1, 10, 1, 2, true, NOW(), NOW()),
('PERFECT_LESSONS', 'Hoàn thành 2 bài học hoàn hảo', 'Đạt điểm tuyệt đối 2 lần', 2, 20, 2, 3, true, NOW(), NOW());

-- Quest Type: CHALLENGE_TYPE (Bài tập theo loại)
INSERT INTO daily_quests (quest_type, title, description, target_value, target_challenge_type, xp_reward, gems_reward, difficulty, is_active, created_at, updated_at)
VALUES 
('CHALLENGE_TYPE', 'Hoàn thành 3 bài nghe', 'Luyện kỹ năng nghe', 3, 'LISTENING', 10, 0, 1, true, NOW(), NOW()),
('CHALLENGE_TYPE', 'Hoàn thành 3 bài nói', 'Luyện kỹ năng nói', 3, 'SPEAKING', 10, 0, 1, true, NOW(), NOW()),
('CHALLENGE_TYPE', 'Hoàn thành 3 bài đọc', 'Luyện kỹ năng đọc', 3, 'READING', 10, 0, 1, true, NOW(), NOW()),
('CHALLENGE_TYPE', 'Hoàn thành 5 bài từ vựng', 'Mở rộng vốn từ của bạn', 5, 'VOCABULARY', 15, 0, 2, true, NOW(), NOW()),
('CHALLENGE_TYPE', 'Hoàn thành 5 bài ngữ pháp', 'Củng cố ngữ pháp', 5, 'GRAMMAR', 15, 0, 2, true, NOW(), NOW());

-- Quest Type: TIME_SPENT (Thời gian học)
INSERT INTO daily_quests (quest_type, title, description, target_value, xp_reward, gems_reward, difficulty, is_active, created_at, updated_at)
VALUES 
('TIME_SPENT', 'Học 5 phút', 'Dành ít nhất 5 phút học hôm nay', 5, 5, 0, 1, true, NOW(), NOW()),
('TIME_SPENT', 'Học 15 phút', 'Dành 15 phút cho việc học', 15, 10, 0, 2, true, NOW(), NOW()),
('TIME_SPENT', 'Học 30 phút', 'Thử thách: 30 phút học tập!', 30, 20, 1, 3, true, NOW(), NOW());

-- =============================================
-- MONTHLY CHALLENGES - Thử thách hàng tháng (2026)
-- =============================================

-- January 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Một', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 1, 30, 'Huy hiệu Tháng Một', '🏆', '/badges/january-2026.png', 100, 10, '2026-01-01 00:00:00', '2026-01-31 23:59:59', true, NOW(), NOW());

-- February 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Hai', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 2, 28, 'Huy hiệu Tháng Hai', '💝', '/badges/february-2026.png', 100, 10, '2026-02-01 00:00:00', '2026-02-28 23:59:59', true, NOW(), NOW());

-- March 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Ba', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 3, 31, 'Huy hiệu Tháng Ba', '🌸', '/badges/march-2026.png', 100, 10, '2026-03-01 00:00:00', '2026-03-31 23:59:59', true, NOW(), NOW());

-- April 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Tư', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 4, 30, 'Huy hiệu Tháng Tư', '🌷', '/badges/april-2026.png', 100, 10, '2026-04-01 00:00:00', '2026-04-30 23:59:59', true, NOW(), NOW());

-- May 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Năm', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 5, 31, 'Huy hiệu Tháng Năm', '🌻', '/badges/may-2026.png', 100, 10, '2026-05-01 00:00:00', '2026-05-31 23:59:59', true, NOW(), NOW());

-- June 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Sáu', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 6, 30, 'Huy hiệu Tháng Sáu', '☀️', '/badges/june-2026.png', 100, 10, '2026-06-01 00:00:00', '2026-06-30 23:59:59', true, NOW(), NOW());

-- July 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Bảy', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 7, 31, 'Huy hiệu Tháng Bảy', '🌊', '/badges/july-2026.png', 100, 10, '2026-07-01 00:00:00', '2026-07-31 23:59:59', true, NOW(), NOW());

-- August 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Tám', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 8, 31, 'Huy hiệu Tháng Tám', '🍂', '/badges/august-2026.png', 100, 10, '2026-08-01 00:00:00', '2026-08-31 23:59:59', true, NOW(), NOW());

-- September 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Chín', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 9, 30, 'Huy hiệu Tháng Chín', '📚', '/badges/september-2026.png', 100, 10, '2026-09-01 00:00:00', '2026-09-30 23:59:59', true, NOW(), NOW());

-- October 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Mười', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 10, 31, 'Huy hiệu Tháng Mười', '🎃', '/badges/october-2026.png', 100, 10, '2026-10-01 00:00:00', '2026-10-31 23:59:59', true, NOW(), NOW());

-- November 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Mười Một', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 11, 30, 'Huy hiệu Tháng Mười Một', '🍁', '/badges/november-2026.png', 100, 10, '2026-11-01 00:00:00', '2026-11-30 23:59:59', true, NOW(), NOW());

-- December 2026
INSERT INTO monthly_challenges (title, description, year, month, total_quests_required, badge_name, badge_icon, badge_image_url, xp_reward, gems_reward, start_date, end_date, is_active, created_at, updated_at)
VALUES 
('Nhiệm vụ Tháng Mười Hai', 'Hoàn thành các thử thách hàng tháng để giành được huy hiệu độc đáo', 2026, 12, 31, 'Huy hiệu Tháng Mười Hai', '🎄', '/badges/december-2026.png', 100, 10, '2026-12-01 00:00:00', '2026-12-31 23:59:59', true, NOW(), NOW());

-- =============================================
-- VERIFICATION
-- =============================================

SELECT 'Daily Quests Count:' AS info, COUNT(*) AS count FROM daily_quests;
SELECT 'Monthly Challenges Count:' AS info, COUNT(*) AS count FROM monthly_challenges;
