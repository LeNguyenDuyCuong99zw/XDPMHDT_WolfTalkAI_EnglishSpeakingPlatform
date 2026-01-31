-- V003__add_challenge_system.sql
-- Create tables for challenge system (Listening, Speaking, Reading, Writing, Vocabulary, Grammar)

CREATE TABLE IF NOT EXISTS challenges (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    level INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    audio_url VARCHAR(500),
    image_url VARCHAR(500),
    options JSONB,
    correct_option_index INT,
    time_limit INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_type ON challenges(type);
CREATE INDEX idx_level ON challenges(level);
CREATE INDEX idx_type_level ON challenges(type, level);

CREATE TABLE IF NOT EXISTS challenge_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    challenge_id BIGINT NOT NULL,
    user_answer VARCHAR(500),
    is_correct BOOLEAN DEFAULT FALSE,
    time_spent INT,
    xp_earned INT DEFAULT 0,
    accuracy DECIMAL(5, 2),
    first_attempt BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_id ON challenge_submissions(user_id);
CREATE INDEX idx_challenge_id ON challenge_submissions(challenge_id);
CREATE INDEX idx_user_submitted ON challenge_submissions(user_id, submitted_at);
CREATE INDEX idx_is_correct ON challenge_submissions(is_correct);

CREATE TABLE IF NOT EXISTS challenge_weekly_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    challenge_type VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    week_number INT NOT NULL,
    total_attempts INT DEFAULT 0,
    correct_attempts INT DEFAULT 0,
    total_xp INT DEFAULT 0,
    total_time INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, challenge_type, year, week_number)
);

CREATE INDEX idx_user_week ON challenge_weekly_progress(user_id, year, week_number);
CREATE INDEX idx_user_type ON challenge_weekly_progress(user_id, challenge_type);
CREATE INDEX idx_challenge_type_level ON challenges(type, level);
CREATE INDEX idx_submission_user_type ON challenge_submissions(user_id, challenge_id);
CREATE INDEX idx_weekly_progress_type ON challenge_weekly_progress(challenge_type, year, week_number);
