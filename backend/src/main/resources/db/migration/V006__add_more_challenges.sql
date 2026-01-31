-- V006__add_more_challenges.sql
-- Add more challenge data for all challenge types (Additional 120 questions)

-- ===================== LISTENING CHALLENGES (20 more) =====================
INSERT INTO challenges (type, level, title, description, content, audio_url, time_limit, options, correct_option_index) VALUES
-- Level 1 (Beginner)
('LISTENING', 1, 'Morning Greeting', 'What does the person say?', 'Good morning! Have a nice day!', 'https://audio.example.com/morning.mp3', 15, '["Good night", "Good morning", "Good evening"]', 1),
('LISTENING', 1, 'Number Question', 'What number do you hear?', 'The number is twenty-five', 'https://audio.example.com/number25.mp3', 15, '["15", "25", "35"]', 1),
('LISTENING', 1, 'Color Identification', 'What color is mentioned?', 'My favorite color is blue', 'https://audio.example.com/color_blue.mp3', 15, '["Red", "Blue", "Green"]', 1),
('LISTENING', 1, 'Day of Week', 'What day is it?', 'Today is Monday', 'https://audio.example.com/monday.mp3', 15, '["Sunday", "Monday", "Tuesday"]', 1),

-- Level 2 (Elementary)
('LISTENING', 2, 'Shopping Dialog', 'How much does the shirt cost?', 'This shirt costs twenty dollars', 'https://audio.example.com/shopping.mp3', 20, '["$10", "$20", "$30"]', 1),
('LISTENING', 2, 'Direction Question', 'Where is the bank?', 'The bank is next to the post office', 'https://audio.example.com/direction.mp3', 20, '["Next to school", "Next to post office", "Next to hospital"]', 1),
('LISTENING', 2, 'Food Order', 'What did she order?', 'I would like a hamburger and fries please', 'https://audio.example.com/food.mp3', 20, '["Pizza", "Hamburger and fries", "Salad"]', 1),
('LISTENING', 2, 'Phone Number', 'What is the phone number?', 'My phone number is 555-1234', 'https://audio.example.com/phone.mp3', 20, '["555-1234", "555-4321", "555-2341"]', 0),

-- Level 3 (Intermediate)
('LISTENING', 3, 'Weather Report', 'What will the weather be like tomorrow?', 'Tomorrow will be sunny with temperatures around 25 degrees', 'https://audio.example.com/weather.mp3', 25, '["Rainy", "Sunny", "Cloudy"]', 1),
('LISTENING', 3, 'Travel Plans', 'When is the flight?', 'The flight departs at 3 PM from terminal B', 'https://audio.example.com/flight.mp3', 25, '["2 PM", "3 PM", "4 PM"]', 1),
('LISTENING', 3, 'Movie Review', 'What genre is the movie?', 'This action movie has amazing special effects and exciting chase scenes', 'https://audio.example.com/movie.mp3', 25, '["Comedy", "Action", "Romance"]', 1),
('LISTENING', 3, 'Job Interview', 'What position is he applying for?', 'I am applying for the marketing manager position', 'https://audio.example.com/interview.mp3', 25, '["Sales", "Marketing manager", "Accountant"]', 1),

-- Level 4 (Upper-Intermediate)
('LISTENING', 4, 'Science Documentary', 'What percentage of the ocean is unexplored?', 'Scientists estimate that over 80 percent of the ocean remains unexplored', 'https://audio.example.com/ocean.mp3', 30, '["60%", "70%", "80%"]', 2),
('LISTENING', 4, 'Business Meeting', 'What is the projected growth?', 'Our quarterly report shows a 15 percent increase in revenue compared to last year', 'https://audio.example.com/business.mp3', 30, '["10%", "15%", "20%"]', 1),
('LISTENING', 4, 'University Lecture', 'What caused the extinction?', 'The asteroid impact 66 million years ago led to the extinction of dinosaurs', 'https://audio.example.com/dinosaur.mp3', 30, '["Volcano", "Asteroid", "Climate change"]', 1),
('LISTENING', 4, 'Health Podcast', 'How many hours of sleep are recommended?', 'Health experts recommend 7 to 9 hours of sleep for adults', 'https://audio.example.com/sleep.mp3', 30, '["5-6 hours", "7-9 hours", "10-12 hours"]', 1),

-- Level 5 (Advanced)
('LISTENING', 5, 'TED Talk', 'What is the main argument?', 'The speaker argues that artificial intelligence will fundamentally transform healthcare by enabling personalized medicine and early disease detection', 'https://audio.example.com/ai_health.mp3', 40, '["AI is dangerous", "AI will transform healthcare", "AI should be banned"]', 1),
('LISTENING', 5, 'Debate Panel', 'What solution is proposed?', 'The panel concluded that international cooperation and carbon pricing mechanisms are essential for addressing climate change effectively', 'https://audio.example.com/climate_debate.mp3', 40, '["Individual action only", "International cooperation", "No action needed"]', 1),
('LISTENING', 5, 'Research Presentation', 'What was the study finding?', 'Our longitudinal study of 10000 participants found a significant correlation between regular meditation and reduced anxiety levels', 'https://audio.example.com/meditation.mp3', 40, '["No effect", "Increased anxiety", "Reduced anxiety"]', 2),
('LISTENING', 5, 'Economic Analysis', 'What economic indicator is discussed?', 'The inflation rate has stabilized at 2.5 percent following the central bank monetary policy adjustments', 'https://audio.example.com/inflation.mp3', 40, '["Unemployment", "Inflation", "GDP growth"]', 1);

-- ===================== SPEAKING CHALLENGES (20 more) =====================
INSERT INTO challenges (type, level, title, description, content, time_limit, options, correct_option_index) VALUES
-- Level 1 (Beginner)
('SPEAKING', 1, 'Say Hello', 'Greet someone politely', 'Say hello to a new friend', 15, '["Hello or Hi used", "Polite tone", "Clear speech"]', 0),
('SPEAKING', 1, 'Count to Ten', 'Count from one to ten in English', 'Numbers 1-10', 20, '["All numbers correct", "Clear pronunciation", "Good pace"]', 0),
('SPEAKING', 1, 'Name Objects', 'Name five objects in your room', 'Objects around you', 20, '["5 objects named", "Correct words", "Clear speech"]', 0),
('SPEAKING', 1, 'Simple Answer', 'Answer: What is your favorite food?', 'Talk about food you like', 15, '["Food mentioned", "Simple sentence", "Clear answer"]', 0),

-- Level 2 (Elementary)
('SPEAKING', 2, 'Describe Weather', 'Describe today weather in 2-3 sentences', 'What is the weather like?', 25, '["Weather described", "2-3 sentences", "Vocabulary used"]', 0),
('SPEAKING', 2, 'Give Directions', 'Explain how to get to the park from school', 'Giving directions', 30, '["Clear directions", "Sequence words", "Landmarks mentioned"]', 0),
('SPEAKING', 2, 'Order Food', 'Practice ordering food at a restaurant', 'Restaurant ordering', 25, '["Polite request", "Food items", "Thank you"]', 0),
('SPEAKING', 2, 'Describe Person', 'Describe your best friend', 'Talk about a friend', 30, '["Physical description", "Personality", "Activities together"]', 0),

-- Level 3 (Intermediate)
('SPEAKING', 3, 'Tell a Story', 'Tell a short story about your last weekend', 'Weekend activities', 45, '["Past tense used", "Sequence events", "Details included"]', 0),
('SPEAKING', 3, 'Express Opinion', 'Give your opinion on online learning', 'Online vs classroom', 40, '["Opinion stated", "Reasons given", "Examples"]', 0),
('SPEAKING', 3, 'Compare Things', 'Compare living in a city vs countryside', 'City vs countryside', 45, '["Comparison words", "Pros and cons", "Preference stated"]', 0),
('SPEAKING', 3, 'Describe Process', 'Explain how to make your favorite dish', 'Cooking instructions', 45, '["Steps in order", "Ingredients mentioned", "Clear instructions"]', 0),

-- Level 4 (Upper-Intermediate)
('SPEAKING', 4, 'Present Argument', 'Argue for or against social media', 'Social media debate', 55, '["Clear thesis", "Multiple arguments", "Counter-argument"]', 0),
('SPEAKING', 4, 'Hypothetical Situation', 'What would you do if you won the lottery?', 'Lottery scenario', 50, '["Conditional used", "Multiple ideas", "Reasoning explained"]', 0),
('SPEAKING', 4, 'News Summary', 'Summarize a recent news story', 'Current events', 55, '["Main points", "Background context", "Your opinion"]', 0),
('SPEAKING', 4, 'Job Description', 'Describe your ideal job and why', 'Career aspirations', 50, '["Job details", "Skills needed", "Personal fit"]', 0),

-- Level 5 (Advanced)
('SPEAKING', 5, 'Complex Analysis', 'Analyze the impact of globalization on local cultures', 'Globalization effects', 65, '["Thesis statement", "Multiple perspectives", "Evidence cited"]', 0),
('SPEAKING', 5, 'Persuasive Speech', 'Convince someone to adopt sustainable practices', 'Environmental persuasion', 60, '["Emotional appeal", "Logical arguments", "Call to action"]', 0),
('SPEAKING', 5, 'Academic Discussion', 'Discuss the ethics of genetic engineering', 'Bioethics debate', 65, '["Ethical frameworks", "Scientific facts", "Balanced view"]', 0),
('SPEAKING', 5, 'Problem Solution', 'Propose a solution to urban traffic congestion', 'Urban planning', 60, '["Problem analysis", "Multiple solutions", "Implementation plan"]', 0);

-- ===================== READING CHALLENGES (20 more) =====================
INSERT INTO challenges (type, level, title, description, content, time_limit, options, correct_option_index) VALUES
-- Level 1 (Beginner)
('READING', 1, 'Simple Sign', 'What does the sign say? "OPEN"', 'Store sign reading', 10, '["Closed", "Open", "Exit"]', 1),
('READING', 1, 'Basic Label', 'Read: "Milk - $3.50". How much is the milk?', 'Price reading', 10, '["$2.50", "$3.50", "$4.50"]', 1),
('READING', 1, 'Short Note', 'Read: "Meet me at 5pm." What time?', 'Note reading', 10, '["4pm", "5pm", "6pm"]', 1),
('READING', 1, 'Menu Item', 'Read: "Chicken Soup - Hot and delicious". What food is it?', 'Menu reading', 10, '["Salad", "Chicken Soup", "Pizza"]', 1),

-- Level 2 (Elementary)
('READING', 2, 'Email Subject', 'Read: "Subject: Meeting Tomorrow at 10am". When is the meeting?', 'Email reading', 15, '["Today", "Tomorrow", "Next week"]', 1),
('READING', 2, 'Weather Forecast', 'Read: "Saturday: Sunny, 28°C". What is Saturday weather?', 'Weather reading', 15, '["Rainy", "Sunny", "Cloudy"]', 1),
('READING', 2, 'Bus Schedule', 'Read: "Bus 42 - Departs 8:30am". What time does bus 42 leave?', 'Schedule reading', 15, '["8:00am", "8:30am", "9:00am"]', 1),
('READING', 2, 'Product Description', 'Read: "This laptop has 16GB RAM and 512GB storage." How much RAM?', 'Tech specs', 20, '["8GB", "16GB", "32GB"]', 1),

-- Level 3 (Intermediate)
('READING', 3, 'News Headline', 'Scientists Discover New Species in Amazon Rainforest. Where was the discovery?', 'News article', 25, '["Africa", "Amazon", "Australia"]', 1),
('READING', 3, 'Recipe Instructions', 'Bake at 180°C for 25 minutes until golden brown. What temperature?', 'Recipe reading', 25, '["160°C", "180°C", "200°C"]', 1),
('READING', 3, 'Hotel Review', 'The hotel had excellent service but the rooms were small. What was the complaint?', 'Review reading', 25, '["Bad service", "Small rooms", "High price"]', 1),
('READING', 3, 'Job Advertisement', 'Requirements: 3 years experience, Bachelor degree. How much experience needed?', 'Job posting', 25, '["1 year", "3 years", "5 years"]', 1),

-- Level 4 (Upper-Intermediate)
('READING', 4, 'Scientific Abstract', 'The study found that exercise improves memory by 23% in elderly participants. What improved?', 'Research abstract', 35, '["Vision", "Memory", "Strength"]', 1),
('READING', 4, 'Legal Document', 'The contract is valid for 24 months from the signing date. How long is it valid?', 'Contract reading', 35, '["12 months", "24 months", "36 months"]', 1),
('READING', 4, 'Editorial Opinion', 'The author argues that renewable energy investment should triple by 2030. What is proposed?', 'Editorial reading', 35, '["Reduce investment", "Triple investment", "Stop investment"]', 1),
('READING', 4, 'Technical Manual', 'Warning: Do not exceed 50kg load capacity. What is the maximum load?', 'Manual reading', 35, '["30kg", "50kg", "70kg"]', 1),

-- Level 5 (Advanced)
('READING', 5, 'Academic Journal', 'The meta-analysis of 47 studies concluded that mindfulness reduces cortisol levels significantly. What was analyzed?', 'Journal article', 45, '["10 studies", "47 studies", "100 studies"]', 1),
('READING', 5, 'Philosophy Text', 'Kant argues that moral actions must be motivated by duty rather than consequences. According to Kant, what should motivate moral actions?', 'Philosophical reading', 45, '["Consequences", "Duty", "Pleasure"]', 1),
('READING', 5, 'Economic Report', 'GDP growth slowed to 2.1% in Q3, down from 3.4% in Q2. What was Q2 growth?', 'Economic analysis', 45, '["2.1%", "3.4%", "4.5%"]', 1),
('READING', 5, 'Literary Analysis', 'The author uses symbolism to represent the protagonist inner conflict through the recurring storm imagery. What literary device is used?', 'Literary criticism', 45, '["Metaphor", "Symbolism", "Irony"]', 1);

-- ===================== WRITING CHALLENGES (20 more) =====================
INSERT INTO challenges (type, level, title, description, content, time_limit, options, correct_option_index) VALUES
-- Level 1 (Beginner)
('WRITING', 1, 'Write Name', 'Write your full name', 'Name writing', 10, '["First name", "Last name", "Both names"]', 2),
('WRITING', 1, 'Write Number', 'Write the number "fifteen" in digits', 'Number writing', 10, '["15", "50", "5"]', 0),
('WRITING', 1, 'Complete Word', 'Complete: H_PPY (feeling good)', 'Word completion', 15, '["HAPPY", "HIPPY", "HOPPY"]', 0),
('WRITING', 1, 'Write Date', 'Write today date', 'Date format', 15, '["Day/Month/Year", "Correct format", "Complete date"]', 0),

-- Level 2 (Elementary)
('WRITING', 2, 'Shopping List', 'Write a shopping list with 5 items', 'List writing', 20, '["5 items", "Correct spelling", "Food items"]', 0),
('WRITING', 2, 'Text Message', 'Write a text to invite a friend to lunch', 'SMS writing', 25, '["Invitation clear", "Time mentioned", "Friendly tone"]', 0),
('WRITING', 2, 'Fill Form', 'Complete the form: Name, Age, Country', 'Form filling', 20, '["All fields", "Correct info", "Clear writing"]', 0),
('WRITING', 2, 'Postcard', 'Write a short postcard from vacation', 'Postcard writing', 25, '["Greeting", "Location", "Activity"]', 0),

-- Level 3 (Intermediate)
('WRITING', 3, 'Book Review', 'Write a short review of a book you read (50 words)', 'Review writing', 35, '["Book title", "Opinion", "Recommendation"]', 0),
('WRITING', 3, 'Instructions', 'Write instructions for making tea (5 steps)', 'Instruction writing', 35, '["5 steps", "Order words", "Clear steps"]', 0),
('WRITING', 3, 'Blog Post', 'Write a blog post about your hobby (80 words)', 'Blog writing', 40, '["Introduction", "Details", "Personal voice"]', 0),
('WRITING', 3, 'Formal Email', 'Write an email to request information about a course', 'Email writing', 40, '["Subject line", "Polite tone", "Clear request"]', 0),

-- Level 4 (Upper-Intermediate)
('WRITING', 4, 'News Article', 'Write a news article about a local event (150 words)', 'News writing', 50, '["Headline", "5W1H", "Quotes"]', 0),
('WRITING', 4, 'Cover Letter', 'Write a cover letter for a job application', 'Professional writing', 50, '["Introduction", "Skills", "Closing"]', 0),
('WRITING', 4, 'Compare Essay', 'Compare two methods of learning (150 words)', 'Comparison essay', 50, '["Both methods", "Similarities", "Differences"]', 0),
('WRITING', 4, 'Proposal', 'Write a proposal for a school event', 'Proposal writing', 55, '["Objective", "Plan", "Budget"]', 0),

-- Level 5 (Advanced)
('WRITING', 5, 'Argumentative Essay', 'Write an argumentative essay on technology in education (250 words)', 'Academic essay', 60, '["Thesis", "Arguments", "Counter-argument"]', 0),
('WRITING', 5, 'Research Summary', 'Summarize a research study on climate change (200 words)', 'Summary writing', 60, '["Methodology", "Findings", "Implications"]', 0),
('WRITING', 5, 'Critical Review', 'Write a critical review of an article (200 words)', 'Critical writing', 60, '["Summary", "Analysis", "Evaluation"]', 0),
('WRITING', 5, 'Policy Brief', 'Write a policy recommendation on urban housing (250 words)', 'Policy writing', 65, '["Problem", "Evidence", "Recommendation"]', 0);

-- ===================== VOCABULARY CHALLENGES (20 more) =====================
INSERT INTO challenges (type, level, title, description, content, time_limit, options, correct_option_index) VALUES
-- Level 1 (Beginner)
('VOCABULARY', 1, 'Animal Name', 'What animal says "woof"?', 'Dog sound', 10, '["Cat", "Dog", "Bird"]', 1),
('VOCABULARY', 1, 'Body Part', 'What do you use to see?', 'Eyes function', 10, '["Ears", "Eyes", "Nose"]', 1),
('VOCABULARY', 1, 'Food Category', 'Apple, banana, orange are types of?', 'Fruit category', 10, '["Vegetables", "Fruits", "Meats"]', 1),
('VOCABULARY', 1, 'Basic Verb', 'What does "eat" mean?', 'Eating action', 10, '["To drink", "To consume food", "To sleep"]', 1),

-- Level 2 (Elementary)
('VOCABULARY', 2, 'Weather Word', 'When water falls from clouds, it is called?', 'Rain definition', 15, '["Snow", "Rain", "Wind"]', 1),
('VOCABULARY', 2, 'Occupation', 'A person who teaches students is a?', 'Teacher job', 15, '["Doctor", "Teacher", "Driver"]', 1),
('VOCABULARY', 2, 'Adjective', 'The opposite of "old" is?', 'Age opposite', 15, '["New", "Young", "Big"]', 1),
('VOCABULARY', 2, 'Time Word', 'The day after today is?', 'Tomorrow meaning', 15, '["Yesterday", "Today", "Tomorrow"]', 2),

-- Level 3 (Intermediate)
('VOCABULARY', 3, 'Phrasal Verb', 'What does "look after" mean?', 'Care meaning', 20, '["To search", "To take care of", "To ignore"]', 1),
('VOCABULARY', 3, 'Idiom', 'It is raining cats and dogs means?', 'Heavy rain idiom', 20, '["Animals falling", "Raining heavily", "Pet store"]', 1),
('VOCABULARY', 3, 'Word Form', 'The noun form of "decide" is?', 'Noun formation', 20, '["Decisive", "Decision", "Decided"]', 1),
('VOCABULARY', 3, 'Prefix', 'What does "un-" mean in "unhappy"?', 'Prefix meaning', 20, '["Very", "Not", "Again"]', 1),

-- Level 4 (Upper-Intermediate)
('VOCABULARY', 4, 'Academic Word', 'What does "hypothesis" mean?', 'Scientific term', 25, '["Conclusion", "Proposed explanation", "Fact"]', 1),
('VOCABULARY', 4, 'Business Term', '"ROI" stands for Return on?', 'Business acronym', 25, '["Income", "Investment", "Interest"]', 1),
('VOCABULARY', 4, 'Connotation', 'Which has positive connotation: "cheap" or "affordable"?', 'Word connotation', 25, '["Cheap", "Affordable", "Both same"]', 1),
('VOCABULARY', 4, 'Etymology', 'The word "telephone" comes from Greek words meaning?', 'Word origin', 25, '["Far + sound", "Near + voice", "Quick + talk"]', 0),

-- Level 5 (Advanced)
('VOCABULARY', 5, 'Technical Jargon', 'In computing, what does "algorithm" mean?', 'Tech vocabulary', 30, '["Computer part", "Step-by-step procedure", "Programming language"]', 1),
('VOCABULARY', 5, 'Legal Term', 'What does "precedent" mean in law?', 'Legal vocabulary', 30, '["New law", "Previous decision used as guide", "Judge opinion"]', 1),
('VOCABULARY', 5, 'Medical Term', '"Cardiovascular" relates to?', 'Medical vocabulary', 30, '["Brain", "Heart and blood vessels", "Lungs"]', 1),
('VOCABULARY', 5, 'Literary Device', 'What is "onomatopoeia"?', 'Literary term', 30, '["Exaggeration", "Word imitating sound", "Comparison"]', 1);

-- ===================== GRAMMAR CHALLENGES (20 more) =====================
INSERT INTO challenges (type, level, title, description, content, time_limit, options, correct_option_index) VALUES
-- Level 1 (Beginner)
('GRAMMAR', 1, 'Pronoun', 'Replace "John": __ is my friend', 'He/She/It', 10, '["He", "She", "It"]', 0),
('GRAMMAR', 1, 'Plural Form', 'One cat, two __', 'Plural noun', 10, '["cat", "cats", "cates"]', 1),
('GRAMMAR', 1, 'Be Verb', 'They __ students', 'Are/Is/Am', 10, '["is", "am", "are"]', 2),
('GRAMMAR', 1, 'Possessive', 'This is __ book (I)', 'My/Mine', 10, '["my", "me", "I"]', 0),

-- Level 2 (Elementary)
('GRAMMAR', 2, 'Present Continuous', 'She __ TV now', 'Is watching', 15, '["watch", "watches", "is watching"]', 2),
('GRAMMAR', 2, 'Question Form', '__ you like coffee?', 'Do/Does/Did', 15, '["Do", "Does", "Did"]', 0),
('GRAMMAR', 2, 'Negative', 'I __ like spinach', 'Do not', 15, '["do not", "does not", "am not"]', 0),
('GRAMMAR', 2, 'There is/are', '__ many books on the shelf', 'There are', 15, '["There is", "There are", "There was"]', 1),

-- Level 3 (Intermediate)
('GRAMMAR', 3, 'Present Perfect', 'I __ to Paris twice', 'Have been', 20, '["went", "have been", "am going"]', 1),
('GRAMMAR', 3, 'Modal Verb', 'You __ study harder to pass', 'Should/Must', 20, '["should", "can", "will"]', 0),
('GRAMMAR', 3, 'Relative Clause', 'The man __ called is my uncle', 'Who/Which/That', 20, '["who", "which", "whose"]', 0),
('GRAMMAR', 3, 'Reported Speech', 'She said she __ tired', 'Was/Is', 20, '["is", "was", "were"]', 1),

-- Level 4 (Upper-Intermediate)
('GRAMMAR', 4, 'Third Conditional', 'If I had studied, I __ passed', 'Would have', 25, '["will have", "would have", "had"]', 1),
('GRAMMAR', 4, 'Inversion', 'Never __ I seen such beauty', 'Have/Had', 25, '["have", "had", "did"]', 0),
('GRAMMAR', 4, 'Causative', 'I had my car __', 'Repaired/Repair', 25, '["repair", "repaired", "repairing"]', 1),
('GRAMMAR', 4, 'Participle Clause', '__ the movie, we went home', 'Having watched', 25, '["Watch", "Having watched", "Watched"]', 1),

-- Level 5 (Advanced)
('GRAMMAR', 5, 'Mixed Conditional', 'If I had worked harder, I __ rich now', 'Would be', 30, '["will be", "would be", "am"]', 1),
('GRAMMAR', 5, 'Cleft Sentence', 'It was John __ broke the vase', 'Who/That', 30, '["who", "which", "whom"]', 0),
('GRAMMAR', 5, 'Nominal Clause', '__ he said surprised everyone', 'What/That', 30, '["What", "That", "Which"]', 0),
('GRAMMAR', 5, 'Ellipsis', 'She can swim and so __ I', 'Can/Do', 30, '["can", "do", "am"]', 0);
