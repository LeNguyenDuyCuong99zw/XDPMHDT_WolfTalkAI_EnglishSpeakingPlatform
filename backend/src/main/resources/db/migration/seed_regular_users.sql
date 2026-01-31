-- Seed Regular Users
-- These are regular users (not admin or mentor) to populate the users table

INSERT INTO users (email, password, first_name, last_name, roles, learning_language, has_completed_placement_test, is_first_login, points, streak, created_at)
VALUES 
('john.nguyen@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'John', 'Nguyen', 'ROLE_USER', 'en', true, false, 1500, 7, CURRENT_TIMESTAMP),
('jane.smith@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Jane', 'Smith', 'ROLE_USER', 'en', true, false, 2000, 14, CURRENT_TIMESTAMP),
('alex.johnson@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Alex', 'Johnson', 'ROLE_USER', 'en', true, false, 1200, 5, CURRENT_TIMESTAMP),
('emily.brown@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Emily', 'Brown', 'ROLE_USER', 'en', true, false, 1800, 10, CURRENT_TIMESTAMP),
('michael.lee@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Michael', 'Lee', 'ROLE_USER', 'en', true, false, 950, 3, CURRENT_TIMESTAMP),
('sarah.williams@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Sarah', 'Williams', 'ROLE_USER', 'en', true, false, 2200, 18, CURRENT_TIMESTAMP),
('david.garcia@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'David', 'Garcia', 'ROLE_USER', 'en', true, false, 1400, 9, CURRENT_TIMESTAMP),
('lisa.martinez@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Lisa', 'Martinez', 'ROLE_USER', 'en', true, false, 1650, 11, CURRENT_TIMESTAMP),
('robert.taylor@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Robert', 'Taylor', 'ROLE_USER', 'en', true, false, 1300, 6, CURRENT_TIMESTAMP),
('jessica.thomas@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Jessica', 'Thomas', 'ROLE_USER', 'en', true, false, 1900, 12, CURRENT_TIMESTAMP),
('kevin.anderson@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Kevin', 'Anderson', 'ROLE_USER', 'en', true, false, 1100, 4, CURRENT_TIMESTAMP),
('michelle.jackson@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Michelle', 'Jackson', 'ROLE_USER', 'en', true, false, 2100, 16, CURRENT_TIMESTAMP),
('christopher.white@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Christopher', 'White', 'ROLE_USER', 'en', true, false, 1550, 8, CURRENT_TIMESTAMP),
('amanda.harris@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Amanda', 'Harris', 'ROLE_USER', 'en', true, false, 1750, 13, CURRENT_TIMESTAMP),
('daniel.martin@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Daniel', 'Martin', 'ROLE_USER', 'en', true, false, 1350, 7, CURRENT_TIMESTAMP),
('sophia.wilson@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Sophia', 'Wilson', 'ROLE_USER', 'en', true, false, 2300, 20, CURRENT_TIMESTAMP),
('james.robinson@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'James', 'Robinson', 'ROLE_USER', 'en', true, false, 1600, 9, CURRENT_TIMESTAMP),
('natalie.clark@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Natalie', 'Clark', 'ROLE_USER', 'en', true, false, 1450, 6, CURRENT_TIMESTAMP),
('matthew.lewis@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Matthew', 'Lewis', 'ROLE_USER', 'en', true, false, 2050, 15, CURRENT_TIMESTAMP),
('olivia.nguyen@example.com', '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', 'Olivia', 'Nguyen', 'ROLE_USER', 'en', true, false, 1700, 11, CURRENT_TIMESTAMP);

-- Password for all users: Admin@123456
