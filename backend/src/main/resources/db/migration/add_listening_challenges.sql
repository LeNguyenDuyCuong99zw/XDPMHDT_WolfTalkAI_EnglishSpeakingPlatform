-- Migration: Add listening challenges tables

-- Table for listening challenges

-- Insert sample listening challenges
INSERT INTO listening_challenges (title, description, difficulty_level, audio_url, english_text, vietnamese_text, base_points, category, duration_seconds) VALUES
('Hello, how are you?', 'Basic greeting', 1, 'https://example.com/audio/hello.mp3', 'Hello, how are you?', 'Xin chào, bạn khỏe không?', 10, 'greeting', 5),
('What is your name?', 'Introduction', 1, 'https://example.com/audio/name.mp3', 'What is your name?', 'Bạn tên gì?', 10, 'greeting', 5),
('Where do you live?', 'Location inquiry', 2, 'https://example.com/audio/live.mp3', 'Where do you live?', 'Bạn sống ở đâu?', 15, 'daily', 8),
('I like to read books', 'Hobby expression', 2, 'https://example.com/audio/read.mp3', 'I like to read books', 'Tôi thích đọc sách', 15, 'daily', 8),
('The weather is beautiful today', 'Weather description', 2, 'https://example.com/audio/weather.mp3', 'The weather is beautiful today', 'Thời tiết hôm nay rất đẹp', 15, 'daily', 10),
('Can you help me with this task?', 'Requesting help', 3, 'https://example.com/audio/help.mp3', 'Can you help me with this task?', 'Bạn có thể giúp tôi với công việc này không?', 20, 'daily', 12),
('I have been studying English for five years', 'Past experience', 3, 'https://example.com/audio/study.mp3', 'I have been studying English for five years', 'Tôi đã học tiếng Anh trong năm năm', 20, 'daily', 15),
('Would you like to have dinner with me?', 'Invitation', 3, 'https://example.com/audio/dinner.mp3', 'Would you like to have dinner with me?', 'Bạn có muốn ăn cơm tối với tôi không?', 20, 'daily', 15),
('Although the task was difficult, I managed to complete it successfully', 'Complex sentence', 4, 'https://example.com/audio/complex.mp3', 'Although the task was difficult, I managed to complete it successfully', 'Mặc dù nhiệm vụ khó khăn, tôi vẫn hoàn thành nó thành công', 25, 'advanced', 18),
('The government has implemented new policies to encourage sustainable development', 'Political discourse', 5, 'https://example.com/audio/government.mp3', 'The government has implemented new policies to encourage sustainable development', 'Chính phủ đã triển khai các chính sách mới để khuyến khích phát triển bền vững', 30, 'advanced', 20);
