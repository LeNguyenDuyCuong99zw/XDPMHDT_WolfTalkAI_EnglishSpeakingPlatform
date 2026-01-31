
-- Seed dữ liệu 20 câu hỏi đánh giá trình độ ban đầu
-- 5 câu hỏi LISTENING, 5 SPEAKING, 5 WRITING, 5 READING

INSERT INTO initial_assessment_questions (question_type, answer_format, question_text, audio_url, image_url, correct_answer, options, difficulty, skill_type, explanation, created_at)
VALUES
-- LISTENING (5 câu) - Sẽ phát audio thông qua TTS
('LISTENING', 'MULTIPLE_CHOICE', 'What is the speaker''s name?', 'The speaker introduced himself as John', NULL, 'John', 'John|Mike|Peter|David', 1, 'LISTENING', 'The speaker introduced himself as John', NOW()),
('LISTENING', 'MULTIPLE_CHOICE', 'Where is the library?', 'The library is next to the park', NULL, 'Next to the park', 'Next to the school|Next to the park|Next to the hospital|Next to the bank', 1, 'LISTENING', 'The speaker said the library is next to the park', NOW()),
('LISTENING', 'MULTIPLE_CHOICE', 'What time does the meeting start?', 'The meeting starts at 2 PM', NULL, '2 PM', '1 PM|2 PM|3 PM|4 PM', 2, 'LISTENING', 'The meeting is scheduled at 2 PM', NOW()),
('LISTENING', 'MULTIPLE_CHOICE', 'How many people attended the event?', 'Fifty people attended the event', NULL, '50', '30|40|50|60', 2, 'LISTENING', 'Fifty people attended the event', NOW()),
('LISTENING', 'MULTIPLE_CHOICE', 'What is her favorite food?', 'Her favorite food is pizza', NULL, 'Pizza', 'Chicken|Pizza|Rice|Pasta', 1, 'LISTENING', 'She said pizza is her favorite food', NOW()),

-- SPEAKING (5 câu)
('SPEAKING', 'SPEAKING_RECORD', 'Please introduce yourself with your name and age', NULL, NULL, 'name|age', 'Self-introduced with name and age|Self-introduced with name only|Only mentioned age', 1, 'SPEAKING', 'A good introduction should include both name and age', NOW()),
('SPEAKING', 'SPEAKING_RECORD', 'What do you like to do in your free time?', NULL, NULL, 'like|hobby', 'Read books|Watch movies|Play sports|All of the above', 1, 'SPEAKING', 'Answer with a hobby or leisure activity', NOW()),
('SPEAKING', 'SPEAKING_RECORD', 'Can you describe your daily routine?', NULL, NULL, 'wake|sleep|routine', 'Morning activities|Evening activities|All daily activities', 2, 'SPEAKING', 'Describe activities from morning to night', NOW()),
('SPEAKING', 'SPEAKING_RECORD', 'How do you usually spend your weekends?', NULL, NULL, 'weekend|spend', 'Stay at home|Go out|Spend time with family|All of the above', 1, 'SPEAKING', 'Share your weekend activities', NOW()),
('SPEAKING', 'SPEAKING_RECORD', 'Tell me about your favorite place to visit', NULL, NULL, 'favorite|place', 'A description of place|Why you like it|Experiences there', 2, 'SPEAKING', 'Describe a place and explain why you like it', NOW()),

-- WRITING (5 câu)
('WRITING', 'MULTIPLE_CHOICE', 'Complete the sentence: I ___ to the market yesterday', NULL, NULL, 'went', 'go|went|going|goes', 1, 'WRITING', 'Past simple is used for past actions. "went" is correct', NOW()),
('WRITING', 'MULTIPLE_CHOICE', 'Which sentence is grammatically correct?', NULL, NULL, 'She has completed her work', 'She complete her work|She has completed her work|She completing her work|She completed her work yet', 1, 'WRITING', 'Present perfect is appropriate for recent completion', NOW()),
('WRITING', 'MULTIPLE_CHOICE', 'Choose the correct word: I ___ a new car last month', NULL, NULL, 'bought', 'buy|bought|buying|buys', 1, 'WRITING', 'Past simple for past action. "bought" is correct', NOW()),
('WRITING', 'MULTIPLE_CHOICE', 'Which is the correct spelling?', NULL, NULL, 'necessary', 'neccessary|necessary|necesary|necessery', 2, 'WRITING', 'The correct spelling is "necessary"', NOW()),
('WRITING', 'MULTIPLE_CHOICE', 'Select the correct form: If I ___ you, I would help', NULL, NULL, 'were', 'was|were|am|be', 2, 'WRITING', 'Second conditional uses "were" for all persons', NOW()),

-- READING (5 câu)
('READING', 'MULTIPLE_CHOICE', 'Read: "The cat sat on the mat." What is sitting?', NULL, NULL, 'The cat', 'The dog|The cat|A bird|A mouse', 1, 'READING', 'The sentence clearly states the cat is sitting', NOW()),
('READING', 'MULTIPLE_CHOICE', 'Read: "She likes apples and oranges." What fruits does she like?', NULL, NULL, 'Apples and oranges', 'Only apples|Only oranges|Apples and oranges|Bananas', 1, 'READING', 'The text mentions both apples and oranges', NOW()),
('READING', 'MULTIPLE_CHOICE', 'Read: "John works as a teacher in the city." What is John''s job?', NULL, NULL, 'Teacher', 'Doctor|Teacher|Engineer|Nurse', 1, 'READING', 'The passage states John works as a teacher', NOW()),
('READING', 'MULTIPLE_CHOICE', 'Read: "The weather was cold and rainy." How was the weather?', NULL, NULL, 'Cold and rainy', 'Warm and sunny|Hot and dry|Cold and rainy|Windy and cloudy', 1, 'READING', 'The text explicitly says it was cold and rainy', NOW()),
('READING', 'MULTIPLE_CHOICE', 'Read: "They traveled to Paris, London, and Berlin during their vacation." How many cities did they visit?', NULL, NULL, '3', '2|3|4|5', 2, 'READING', 'Three cities are mentioned: Paris, London, and Berlin', NOW());
