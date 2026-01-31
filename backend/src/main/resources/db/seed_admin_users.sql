-- Seed Admin User
-- Run this SQL manually or the app will auto-create it

INSERT INTO users (email, password, first_name, last_name, roles, learning_language, has_completed_placement_test, is_first_login, created_at)
VALUES (
    'admin@wolftalk.com',
    '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', -- password: Admin@123456
    'Admin',
    'User',
    'ROLE_ADMIN',
    'en',
    true,
    false,
    CURRENT_TIMESTAMP
);

-- Mentor User (optional)
INSERT INTO users (email, password, first_name, last_name, roles, learning_language, has_completed_placement_test, is_first_login, created_at)
VALUES (
    'mentor@wolftalk.com',
    '$2a$10$KIX5f4QWlb.qnKp6Muw/2ufNgj9JNaAkj9N6J5QxL9qF9VZ5K5K5m', -- password: Admin@123456
    'Mentor',
    'User',
    'ROLE_MENTOR',
    'en',
    true,
    false,
    CURRENT_TIMESTAMP
);
