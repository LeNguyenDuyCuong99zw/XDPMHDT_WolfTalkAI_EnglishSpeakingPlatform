-- SEED VOCABULARY DATA
-- ============================================
-- Table columns: word, phonetic, meaning, example, topic, level, word_type

-- Level 1: Basic vocabulary (4 topics: Greetings, Family, Numbers, Colors)

-- GREETINGS - Level 1
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('hello', '/həˈloʊ/', 'xin chào', 'Hello! How are you?', 'GREETINGS', 1, 'INTERJECTION'),
('goodbye', '/ɡʊdˈbaɪ/', 'tạm biệt', 'Goodbye, see you tomorrow!', 'GREETINGS', 1, 'INTERJECTION'),
('good morning', '/ɡʊd ˈmɔːrnɪŋ/', 'chào buổi sáng', 'Good morning, teacher!', 'GREETINGS', 1, 'PHRASE'),
('good afternoon', '/ɡʊd ˌæftərˈnuːn/', 'chào buổi chiều', 'Good afternoon, everyone!', 'GREETINGS', 1, 'PHRASE'),
('good evening', '/ɡʊd ˈiːvnɪŋ/', 'chào buổi tối', 'Good evening, sir.', 'GREETINGS', 1, 'PHRASE'),
('good night', '/ɡʊd naɪt/', 'chúc ngủ ngon', 'Good night, sweet dreams!', 'GREETINGS', 1, 'PHRASE'),
('thank you', '/θæŋk juː/', 'cảm ơn', 'Thank you very much!', 'GREETINGS', 1, 'PHRASE'),
('please', '/pliːz/', 'làm ơn', 'Please help me.', 'GREETINGS', 1, 'ADVERB'),
('sorry', '/ˈsɒri/', 'xin lỗi', 'I am sorry for being late.', 'GREETINGS', 1, 'INTERJECTION'),
('excuse me', '/ɪkˈskjuːz miː/', 'xin phép', 'Excuse me, where is the bank?', 'GREETINGS', 1, 'PHRASE'),
('welcome', '/ˈwelkəm/', 'chào mừng', 'Welcome to our school!', 'GREETINGS', 1, 'INTERJECTION'),
('nice to meet you', '/naɪs tuː miːt juː/', 'rất vui được gặp bạn', 'Nice to meet you, John.', 'GREETINGS', 1, 'PHRASE'),
('how are you', '/haʊ ɑːr juː/', 'bạn khỏe không', 'How are you today?', 'GREETINGS', 1, 'PHRASE'),
('fine', '/faɪn/', 'khỏe, tốt', 'I am fine, thank you.', 'GREETINGS', 1, 'ADJECTIVE'),
('yes', '/jes/', 'vâng, có', 'Yes, I understand.', 'GREETINGS', 1, 'ADVERB');

-- FAMILY - Level 1
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('father', '/ˈfɑːðər/', 'bố, cha', 'My father is a doctor.', 'FAMILY', 1, 'NOUN'),
('mother', '/ˈmʌðər/', 'mẹ', 'My mother cooks delicious food.', 'FAMILY', 1, 'NOUN'),
('brother', '/ˈbrʌðər/', 'anh/em trai', 'I have two brothers.', 'FAMILY', 1, 'NOUN'),
('sister', '/ˈsɪstər/', 'chị/em gái', 'My sister is older than me.', 'FAMILY', 1, 'NOUN'),
('grandfather', '/ˈɡrænfɑːðər/', 'ông nội/ngoại', 'My grandfather is 80 years old.', 'FAMILY', 1, 'NOUN'),
('grandmother', '/ˈɡrænmʌðər/', 'bà nội/ngoại', 'My grandmother makes great cookies.', 'FAMILY', 1, 'NOUN'),
('son', '/sʌn/', 'con trai', 'They have one son.', 'FAMILY', 1, 'NOUN'),
('daughter', '/ˈdɔːtər/', 'con gái', 'She is my daughter.', 'FAMILY', 1, 'NOUN'),
('husband', '/ˈhʌzbənd/', 'chồng', 'Her husband works in a bank.', 'FAMILY', 1, 'NOUN'),
('wife', '/waɪf/', 'vợ', 'His wife is a teacher.', 'FAMILY', 1, 'NOUN'),
('uncle', '/ˈʌŋkl/', 'chú, bác, cậu', 'My uncle lives in Hanoi.', 'FAMILY', 1, 'NOUN'),
('aunt', '/ænt/', 'cô, dì, bác gái', 'My aunt gave me this gift.', 'FAMILY', 1, 'NOUN'),
('cousin', '/ˈkʌzn/', 'anh/chị/em họ', 'I play with my cousins.', 'FAMILY', 1, 'NOUN'),
('family', '/ˈfæməli/', 'gia đình', 'I love my family.', 'FAMILY', 1, 'NOUN'),
('parents', '/ˈperənts/', 'cha mẹ', 'My parents are kind.', 'FAMILY', 1, 'NOUN');

-- NUMBERS - Level 1
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('one', '/wʌn/', 'một', 'I have one apple.', 'NUMBERS', 1, 'NOUN'),
('two', '/tuː/', 'hai', 'Two plus two equals four.', 'NUMBERS', 1, 'NOUN'),
('three', '/θriː/', 'ba', 'There are three cats.', 'NUMBERS', 1, 'NOUN'),
('four', '/fɔːr/', 'bốn', 'The table has four legs.', 'NUMBERS', 1, 'NOUN'),
('five', '/faɪv/', 'năm', 'I have five fingers.', 'NUMBERS', 1, 'NOUN'),
('six', '/sɪks/', 'sáu', 'There are six chairs.', 'NUMBERS', 1, 'NOUN'),
('seven', '/ˈsevn/', 'bảy', 'A week has seven days.', 'NUMBERS', 1, 'NOUN'),
('eight', '/eɪt/', 'tám', 'The octopus has eight arms.', 'NUMBERS', 1, 'NOUN'),
('nine', '/naɪn/', 'chín', 'Nine is my lucky number.', 'NUMBERS', 1, 'NOUN'),
('ten', '/ten/', 'mười', 'I have ten toes.', 'NUMBERS', 1, 'NOUN'),
('zero', '/ˈzɪroʊ/', 'không, số 0', 'Zero is an even number.', 'NUMBERS', 1, 'NOUN'),
('first', '/fɜːrst/', 'thứ nhất', 'I came in first place.', 'NUMBERS', 1, 'ADJECTIVE'),
('second', '/ˈsekənd/', 'thứ hai', 'He finished second.', 'NUMBERS', 1, 'ADJECTIVE'),
('third', '/θɜːrd/', 'thứ ba', 'She lives on the third floor.', 'NUMBERS', 1, 'ADJECTIVE'),
('hundred', '/ˈhʌndrəd/', 'một trăm', 'I saved one hundred dollars.', 'NUMBERS', 1, 'NOUN');

-- COLORS - Level 1
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('red', '/red/', 'màu đỏ', 'The apple is red.', 'COLORS', 1, 'ADJECTIVE'),
('blue', '/bluː/', 'màu xanh dương', 'The sky is blue.', 'COLORS', 1, 'ADJECTIVE'),
('green', '/ɡriːn/', 'màu xanh lá', 'The grass is green.', 'COLORS', 1, 'ADJECTIVE'),
('yellow', '/ˈjeloʊ/', 'màu vàng', 'The sun is yellow.', 'COLORS', 1, 'ADJECTIVE'),
('black', '/blæk/', 'màu đen', 'My hair is black.', 'COLORS', 1, 'ADJECTIVE'),
('white', '/waɪt/', 'màu trắng', 'Snow is white.', 'COLORS', 1, 'ADJECTIVE'),
('orange', '/ˈɔːrɪndʒ/', 'màu cam', 'The carrot is orange.', 'COLORS', 1, 'ADJECTIVE'),
('pink', '/pɪŋk/', 'màu hồng', 'She wears a pink dress.', 'COLORS', 1, 'ADJECTIVE'),
('purple', '/ˈpɜːrpl/', 'màu tím', 'Grapes can be purple.', 'COLORS', 1, 'ADJECTIVE'),
('brown', '/braʊn/', 'màu nâu', 'The dog is brown.', 'COLORS', 1, 'ADJECTIVE'),
('gray', '/ɡreɪ/', 'màu xám', 'The elephant is gray.', 'COLORS', 1, 'ADJECTIVE'),
('color', '/ˈkʌlər/', 'màu sắc', 'What is your favorite color?', 'COLORS', 1, 'NOUN'),
('light', '/laɪt/', 'nhạt, sáng', 'I like light blue.', 'COLORS', 1, 'ADJECTIVE'),
('dark', '/dɑːrk/', 'đậm, tối', 'He wears dark clothes.', 'COLORS', 1, 'ADJECTIVE'),
('bright', '/braɪt/', 'sáng, rực rỡ', 'The sun is bright.', 'COLORS', 1, 'ADJECTIVE');

-- Level 2: More vocabulary (add 3 topics: Food, Animals, Body Parts)

-- FOOD - Level 2
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('rice', '/raɪs/', 'gạo, cơm', 'Vietnamese people eat rice.', 'FOOD', 2, 'NOUN'),
('bread', '/bred/', 'bánh mì', 'I eat bread for breakfast.', 'FOOD', 2, 'NOUN'),
('meat', '/miːt/', 'thịt', 'Meat is a source of protein.', 'FOOD', 2, 'NOUN'),
('fish', '/fɪʃ/', 'cá', 'I like grilled fish.', 'FOOD', 2, 'NOUN'),
('chicken', '/ˈtʃɪkɪn/', 'gà', 'Chicken soup is delicious.', 'FOOD', 2, 'NOUN'),
('egg', '/eɡ/', 'trứng', 'I eat eggs every morning.', 'FOOD', 2, 'NOUN'),
('vegetable', '/ˈvedʒtəbl/', 'rau', 'Eat more vegetables.', 'FOOD', 2, 'NOUN'),
('fruit', '/fruːt/', 'trái cây', 'Fruit is healthy.', 'FOOD', 2, 'NOUN'),
('apple', '/ˈæpl/', 'táo', 'An apple a day keeps the doctor away.', 'FOOD', 2, 'NOUN'),
('banana', '/bəˈnænə/', 'chuối', 'Monkeys love bananas.', 'FOOD', 2, 'NOUN'),
('water', '/ˈwɔːtər/', 'nước', 'Drink plenty of water.', 'FOOD', 2, 'NOUN'),
('milk', '/mɪlk/', 'sữa', 'Milk is good for bones.', 'FOOD', 2, 'NOUN'),
('coffee', '/ˈkɔːfi/', 'cà phê', 'I drink coffee in the morning.', 'FOOD', 2, 'NOUN'),
('tea', '/tiː/', 'trà', 'Green tea is healthy.', 'FOOD', 2, 'NOUN'),
('sugar', '/ˈʃʊɡər/', 'đường', 'Too much sugar is bad for health.', 'FOOD', 2, 'NOUN'),
('salt', '/sɔːlt/', 'muối', 'Add some salt to the soup.', 'FOOD', 2, 'NOUN'),
('soup', '/suːp/', 'súp, canh', 'The soup is hot.', 'FOOD', 2, 'NOUN'),
('noodle', '/ˈnuːdl/', 'mì', 'I like instant noodles.', 'FOOD', 2, 'NOUN'),
('cake', '/keɪk/', 'bánh ngọt', 'Birthday cake is sweet.', 'FOOD', 2, 'NOUN'),
('ice cream', '/aɪs kriːm/', 'kem', 'Children love ice cream.', 'FOOD', 2, 'NOUN');

-- ANIMALS - Level 2
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('dog', '/dɔːɡ/', 'chó', 'The dog is man''s best friend.', 'ANIMALS', 2, 'NOUN'),
('cat', '/kæt/', 'mèo', 'Cats like to sleep.', 'ANIMALS', 2, 'NOUN'),
('bird', '/bɜːrd/', 'chim', 'Birds can fly.', 'ANIMALS', 2, 'NOUN'),
('cow', '/kaʊ/', 'bò', 'Cows give us milk.', 'ANIMALS', 2, 'NOUN'),
('pig', '/pɪɡ/', 'lợn, heo', 'Pigs are smart animals.', 'ANIMALS', 2, 'NOUN'),
('horse', '/hɔːrs/', 'ngựa', 'The horse runs fast.', 'ANIMALS', 2, 'NOUN'),
('sheep', '/ʃiːp/', 'cừu', 'Sheep give us wool.', 'ANIMALS', 2, 'NOUN'),
('duck', '/dʌk/', 'vịt', 'Ducks swim in the pond.', 'ANIMALS', 2, 'NOUN'),
('elephant', '/ˈelɪfənt/', 'con voi', 'Elephants are very big.', 'ANIMALS', 2, 'NOUN'),
('lion', '/ˈlaɪən/', 'sư tử', 'The lion is the king of the jungle.', 'ANIMALS', 2, 'NOUN'),
('tiger', '/ˈtaɪɡər/', 'con hổ', 'Tigers have stripes.', 'ANIMALS', 2, 'NOUN'),
('monkey', '/ˈmʌŋki/', 'con khỉ', 'Monkeys climb trees.', 'ANIMALS', 2, 'NOUN'),
('rabbit', '/ˈræbɪt/', 'con thỏ', 'Rabbits eat carrots.', 'ANIMALS', 2, 'NOUN'),
('mouse', '/maʊs/', 'chuột', 'The mouse is small.', 'ANIMALS', 2, 'NOUN'),
('snake', '/sneɪk/', 'con rắn', 'Snakes don''t have legs.', 'ANIMALS', 2, 'NOUN'),
('frog', '/frɒɡ/', 'con ếch', 'Frogs can jump high.', 'ANIMALS', 2, 'NOUN'),
('bear', '/ber/', 'con gấu', 'Bears like honey.', 'ANIMALS', 2, 'NOUN'),
('butterfly', '/ˈbʌtərflaɪ/', 'con bướm', 'The butterfly is beautiful.', 'ANIMALS', 2, 'NOUN');

-- BODY_PARTS - Level 2
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('head', '/hed/', 'đầu', 'I have a headache.', 'BODY_PARTS', 2, 'NOUN'),
('hair', '/her/', 'tóc', 'She has long hair.', 'BODY_PARTS', 2, 'NOUN'),
('face', '/feɪs/', 'mặt', 'Wash your face.', 'BODY_PARTS', 2, 'NOUN'),
('eye', '/aɪ/', 'mắt', 'She has beautiful eyes.', 'BODY_PARTS', 2, 'NOUN'),
('ear', '/ɪr/', 'tai', 'I can hear with my ears.', 'BODY_PARTS', 2, 'NOUN'),
('nose', '/noʊz/', 'mũi', 'Dogs have wet noses.', 'BODY_PARTS', 2, 'NOUN'),
('mouth', '/maʊθ/', 'miệng', 'Open your mouth.', 'BODY_PARTS', 2, 'NOUN'),
('tooth', '/tuːθ/', 'răng', 'Brush your teeth twice a day.', 'BODY_PARTS', 2, 'NOUN'),
('hand', '/hænd/', 'bàn tay', 'Wash your hands.', 'BODY_PARTS', 2, 'NOUN'),
('finger', '/ˈfɪŋɡər/', 'ngón tay', 'We have ten fingers.', 'BODY_PARTS', 2, 'NOUN'),
('arm', '/ɑːrm/', 'cánh tay', 'Raise your arm.', 'BODY_PARTS', 2, 'NOUN'),
('leg', '/leɡ/', 'chân (cả chân)', 'He broke his leg.', 'BODY_PARTS', 2, 'NOUN'),
('foot', '/fʊt/', 'bàn chân', 'My foot hurts.', 'BODY_PARTS', 2, 'NOUN'),
('body', '/ˈbɒdi/', 'cơ thể', 'Exercise is good for the body.', 'BODY_PARTS', 2, 'NOUN'),
('heart', '/hɑːrt/', 'tim', 'The heart pumps blood.', 'BODY_PARTS', 2, 'NOUN');

-- Level 3: Intermediate vocabulary (add Weather, Clothes, Transportation, House)

-- WEATHER - Level 3
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('sunny', '/ˈsʌni/', 'nắng', 'It''s a sunny day.', 'WEATHER', 3, 'ADJECTIVE'),
('cloudy', '/ˈklaʊdi/', 'nhiều mây', 'The sky is cloudy.', 'WEATHER', 3, 'ADJECTIVE'),
('rainy', '/ˈreɪni/', 'mưa', 'It''s rainy today.', 'WEATHER', 3, 'ADJECTIVE'),
('windy', '/ˈwɪndi/', 'có gió', 'It''s very windy outside.', 'WEATHER', 3, 'ADJECTIVE'),
('hot', '/hɒt/', 'nóng', 'Summer is very hot.', 'WEATHER', 3, 'ADJECTIVE'),
('cold', '/koʊld/', 'lạnh', 'Winter is cold.', 'WEATHER', 3, 'ADJECTIVE'),
('warm', '/wɔːrm/', 'ấm', 'Spring is warm.', 'WEATHER', 3, 'ADJECTIVE'),
('cool', '/kuːl/', 'mát', 'The weather is cool today.', 'WEATHER', 3, 'ADJECTIVE'),
('snow', '/snoʊ/', 'tuyết', 'It''s snowing outside.', 'WEATHER', 3, 'NOUN'),
('rain', '/reɪn/', 'mưa', 'The rain is heavy.', 'WEATHER', 3, 'NOUN'),
('storm', '/stɔːrm/', 'bão', 'A big storm is coming.', 'WEATHER', 3, 'NOUN'),
('thunder', '/ˈθʌndər/', 'sấm', 'I heard thunder.', 'WEATHER', 3, 'NOUN'),
('fog', '/fɒɡ/', 'sương mù', 'There''s thick fog today.', 'WEATHER', 3, 'NOUN'),
('temperature', '/ˈtemprətʃər/', 'nhiệt độ', 'The temperature is 30 degrees.', 'WEATHER', 3, 'NOUN'),
('season', '/ˈsiːzn/', 'mùa', 'My favorite season is autumn.', 'WEATHER', 3, 'NOUN');

-- CLOTHES - Level 3
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('shirt', '/ʃɜːrt/', 'áo sơ mi', 'He wears a white shirt.', 'CLOTHES', 3, 'NOUN'),
('pants', '/pænts/', 'quần dài', 'These pants are too long.', 'CLOTHES', 3, 'NOUN'),
('dress', '/dres/', 'váy', 'She wears a beautiful dress.', 'CLOTHES', 3, 'NOUN'),
('skirt', '/skɜːrt/', 'chân váy', 'The skirt is too short.', 'CLOTHES', 3, 'NOUN'),
('jacket', '/ˈdʒækɪt/', 'áo khoác', 'Wear a jacket, it''s cold.', 'CLOTHES', 3, 'NOUN'),
('coat', '/koʊt/', 'áo khoác dài', 'The winter coat is warm.', 'CLOTHES', 3, 'NOUN'),
('shoes', '/ʃuːz/', 'giày', 'These shoes are comfortable.', 'CLOTHES', 3, 'NOUN'),
('socks', '/sɒks/', 'tất, vớ', 'I need new socks.', 'CLOTHES', 3, 'NOUN'),
('hat', '/hæt/', 'mũ', 'Wear a hat in the sun.', 'CLOTHES', 3, 'NOUN'),
('gloves', '/ɡlʌvz/', 'găng tay', 'Wear gloves when it''s cold.', 'CLOTHES', 3, 'NOUN'),
('scarf', '/skɑːrf/', 'khăn quàng cổ', 'The scarf keeps me warm.', 'CLOTHES', 3, 'NOUN'),
('sweater', '/ˈswetər/', 'áo len', 'This sweater is soft.', 'CLOTHES', 3, 'NOUN'),
('jeans', '/dʒiːnz/', 'quần jean', 'I love wearing jeans.', 'CLOTHES', 3, 'NOUN'),
('T-shirt', '/ˈtiː ʃɜːrt/', 'áo phông', 'I bought a new T-shirt.', 'CLOTHES', 3, 'NOUN'),
('uniform', '/ˈjuːnɪfɔːrm/', 'đồng phục', 'Students wear uniforms.', 'CLOTHES', 3, 'NOUN');

-- TRANSPORTATION - Level 3
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('car', '/kɑːr/', 'xe hơi', 'My father drives a car.', 'TRANSPORTATION', 3, 'NOUN'),
('bus', '/bʌs/', 'xe buýt', 'I take the bus to school.', 'TRANSPORTATION', 3, 'NOUN'),
('train', '/treɪn/', 'tàu hỏa', 'The train is fast.', 'TRANSPORTATION', 3, 'NOUN'),
('plane', '/pleɪn/', 'máy bay', 'We fly by plane.', 'TRANSPORTATION', 3, 'NOUN'),
('bicycle', '/ˈbaɪsɪkl/', 'xe đạp', 'I ride my bicycle to school.', 'TRANSPORTATION', 3, 'NOUN'),
('motorcycle', '/ˈmoʊtərsaɪkl/', 'xe máy', 'Many people ride motorcycles.', 'TRANSPORTATION', 3, 'NOUN'),
('ship', '/ʃɪp/', 'tàu thủy', 'The ship crosses the ocean.', 'TRANSPORTATION', 3, 'NOUN'),
('boat', '/boʊt/', 'thuyền', 'We sailed in a small boat.', 'TRANSPORTATION', 3, 'NOUN'),
('taxi', '/ˈtæksi/', 'xe taxi', 'Let''s take a taxi.', 'TRANSPORTATION', 3, 'NOUN'),
('helicopter', '/ˈhelɪkɒptər/', 'máy bay trực thăng', 'The helicopter landed safely.', 'TRANSPORTATION', 3, 'NOUN'),
('subway', '/ˈsʌbweɪ/', 'tàu điện ngầm', 'The subway is convenient.', 'TRANSPORTATION', 3, 'NOUN'),
('truck', '/trʌk/', 'xe tải', 'The truck carries goods.', 'TRANSPORTATION', 3, 'NOUN'),
('drive', '/draɪv/', 'lái xe', 'I can drive a car.', 'TRANSPORTATION', 3, 'VERB'),
('ride', '/raɪd/', 'đi (xe)', 'I ride my bike every day.', 'TRANSPORTATION', 3, 'VERB'),
('traffic', '/ˈtræfɪk/', 'giao thông', 'There''s heavy traffic.', 'TRANSPORTATION', 3, 'NOUN');

-- HOUSE - Level 3
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('house', '/haʊs/', 'nhà', 'This is my house.', 'HOUSE', 3, 'NOUN'),
('room', '/ruːm/', 'phòng', 'My room is small.', 'HOUSE', 3, 'NOUN'),
('bedroom', '/ˈbedruːm/', 'phòng ngủ', 'The bedroom is upstairs.', 'HOUSE', 3, 'NOUN'),
('bathroom', '/ˈbæθruːm/', 'phòng tắm', 'The bathroom is clean.', 'HOUSE', 3, 'NOUN'),
('kitchen', '/ˈkɪtʃɪn/', 'nhà bếp', 'Mom cooks in the kitchen.', 'HOUSE', 3, 'NOUN'),
('living room', '/ˈlɪvɪŋ ruːm/', 'phòng khách', 'We watch TV in the living room.', 'HOUSE', 3, 'NOUN'),
('door', '/dɔːr/', 'cửa', 'Please close the door.', 'HOUSE', 3, 'NOUN'),
('window', '/ˈwɪndoʊ/', 'cửa sổ', 'Open the window for fresh air.', 'HOUSE', 3, 'NOUN'),
('floor', '/flɔːr/', 'sàn nhà', 'Clean the floor.', 'HOUSE', 3, 'NOUN'),
('wall', '/wɔːl/', 'tường', 'There''s a picture on the wall.', 'HOUSE', 3, 'NOUN'),
('roof', '/ruːf/', 'mái nhà', 'The roof is red.', 'HOUSE', 3, 'NOUN'),
('garden', '/ˈɡɑːrdn/', 'vườn', 'We have a beautiful garden.', 'HOUSE', 3, 'NOUN'),
('furniture', '/ˈfɜːrnɪtʃər/', 'đồ nội thất', 'We bought new furniture.', 'HOUSE', 3, 'NOUN'),
('bed', '/bed/', 'giường', 'The bed is comfortable.', 'HOUSE', 3, 'NOUN'),
('table', '/ˈteɪbl/', 'bàn', 'Put the book on the table.', 'HOUSE', 3, 'NOUN');

-- Level 4: Advanced vocabulary (add School, Work, Travel, Health, Sports)

-- SCHOOL - Level 4
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('school', '/skuːl/', 'trường học', 'I go to school every day.', 'SCHOOL', 4, 'NOUN'),
('classroom', '/ˈklæsruːm/', 'phòng học', 'The classroom is large.', 'SCHOOL', 4, 'NOUN'),
('teacher', '/ˈtiːtʃər/', 'giáo viên', 'My teacher is kind.', 'SCHOOL', 4, 'NOUN'),
('student', '/ˈstuːdnt/', 'học sinh', 'I am a good student.', 'SCHOOL', 4, 'NOUN'),
('book', '/bʊk/', 'sách', 'I read many books.', 'SCHOOL', 4, 'NOUN'),
('notebook', '/ˈnoʊtbʊk/', 'vở', 'Write in your notebook.', 'SCHOOL', 4, 'NOUN'),
('pen', '/pen/', 'bút bi', 'Can I borrow your pen?', 'SCHOOL', 4, 'NOUN'),
('pencil', '/ˈpensl/', 'bút chì', 'The pencil is sharp.', 'SCHOOL', 4, 'NOUN'),
('homework', '/ˈhoʊmwɜːrk/', 'bài tập về nhà', 'I finished my homework.', 'SCHOOL', 4, 'NOUN'),
('exam', '/ɪɡˈzæm/', 'kỳ thi', 'The exam is tomorrow.', 'SCHOOL', 4, 'NOUN'),
('lesson', '/ˈlesn/', 'bài học', 'Today''s lesson is interesting.', 'SCHOOL', 4, 'NOUN'),
('subject', '/ˈsʌbdʒɪkt/', 'môn học', 'Math is my favorite subject.', 'SCHOOL', 4, 'NOUN'),
('library', '/ˈlaɪbreri/', 'thư viện', 'I study in the library.', 'SCHOOL', 4, 'NOUN'),
('study', '/ˈstʌdi/', 'học', 'I study English every day.', 'SCHOOL', 4, 'VERB'),
('learn', '/lɜːrn/', 'học', 'I want to learn new things.', 'SCHOOL', 4, 'VERB');

-- WORK - Level 4
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('job', '/dʒɒb/', 'công việc', 'I have a new job.', 'WORK', 4, 'NOUN'),
('office', '/ˈɒfɪs/', 'văn phòng', 'I work in an office.', 'WORK', 4, 'NOUN'),
('company', '/ˈkʌmpəni/', 'công ty', 'The company is successful.', 'WORK', 4, 'NOUN'),
('boss', '/bɒs/', 'sếp', 'My boss is strict.', 'WORK', 4, 'NOUN'),
('colleague', '/ˈkɒliːɡ/', 'đồng nghiệp', 'My colleagues are friendly.', 'WORK', 4, 'NOUN'),
('salary', '/ˈsæləri/', 'lương', 'I receive my salary monthly.', 'WORK', 4, 'NOUN'),
('meeting', '/ˈmiːtɪŋ/', 'cuộc họp', 'The meeting starts at 9 AM.', 'WORK', 4, 'NOUN'),
('project', '/ˈprɒdʒekt/', 'dự án', 'We are working on a new project.', 'WORK', 4, 'NOUN'),
('deadline', '/ˈdedlaɪn/', 'hạn chót', 'The deadline is next week.', 'WORK', 4, 'NOUN'),
('interview', '/ˈɪntərvjuː/', 'phỏng vấn', 'I have a job interview tomorrow.', 'WORK', 4, 'NOUN'),
('career', '/kəˈrɪr/', 'sự nghiệp', 'I want a successful career.', 'WORK', 4, 'NOUN'),
('work', '/wɜːrk/', 'làm việc', 'I work from 9 to 5.', 'WORK', 4, 'VERB'),
('manager', '/ˈmænɪdʒər/', 'quản lý', 'The manager approved the plan.', 'WORK', 4, 'NOUN'),
('employee', '/ɪmˈplɔɪiː/', 'nhân viên', 'The company has 100 employees.', 'WORK', 4, 'NOUN'),
('experience', '/ɪkˈspɪriəns/', 'kinh nghiệm', 'I have 5 years of experience.', 'WORK', 4, 'NOUN');

-- TRAVEL - Level 4
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('travel', '/ˈtrævl/', 'du lịch', 'I love to travel.', 'TRAVEL', 4, 'VERB'),
('trip', '/trɪp/', 'chuyến đi', 'We had a great trip.', 'TRAVEL', 4, 'NOUN'),
('vacation', '/veɪˈkeɪʃn/', 'kỳ nghỉ', 'I need a vacation.', 'TRAVEL', 4, 'NOUN'),
('tourist', '/ˈtʊrɪst/', 'du khách', 'There are many tourists here.', 'TRAVEL', 4, 'NOUN'),
('hotel', '/hoʊˈtel/', 'khách sạn', 'The hotel is expensive.', 'TRAVEL', 4, 'NOUN'),
('airport', '/ˈerˌpɔːrt/', 'sân bay', 'We arrived at the airport.', 'TRAVEL', 4, 'NOUN'),
('passport', '/ˈpæspɔːrt/', 'hộ chiếu', 'Don''t forget your passport.', 'TRAVEL', 4, 'NOUN'),
('luggage', '/ˈlʌɡɪdʒ/', 'hành lý', 'My luggage is heavy.', 'TRAVEL', 4, 'NOUN'),
('ticket', '/ˈtɪkɪt/', 'vé', 'I bought two tickets.', 'TRAVEL', 4, 'NOUN'),
('map', '/mæp/', 'bản đồ', 'I need a map of the city.', 'TRAVEL', 4, 'NOUN'),
('guide', '/ɡaɪd/', 'hướng dẫn viên', 'The guide speaks English.', 'TRAVEL', 4, 'NOUN'),
('beach', '/biːtʃ/', 'bãi biển', 'Let''s go to the beach.', 'TRAVEL', 4, 'NOUN'),
('mountain', '/ˈmaʊntən/', 'núi', 'The mountain is high.', 'TRAVEL', 4, 'NOUN'),
('visit', '/ˈvɪzɪt/', 'thăm', 'I want to visit Paris.', 'TRAVEL', 4, 'VERB'),
('explore', '/ɪkˈsplɔːr/', 'khám phá', 'Let''s explore the city.', 'TRAVEL', 4, 'VERB');

-- HEALTH - Level 4
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('health', '/helθ/', 'sức khỏe', 'Health is important.', 'HEALTH', 4, 'NOUN'),
('healthy', '/ˈhelθi/', 'khỏe mạnh', 'Eat healthy food.', 'HEALTH', 4, 'ADJECTIVE'),
('sick', '/sɪk/', 'ốm', 'I feel sick today.', 'HEALTH', 4, 'ADJECTIVE'),
('medicine', '/ˈmedsn/', 'thuốc', 'Take your medicine.', 'HEALTH', 4, 'NOUN'),
('doctor', '/ˈdɒktər/', 'bác sĩ', 'See a doctor if you''re sick.', 'HEALTH', 4, 'NOUN'),
('hospital', '/ˈhɒspɪtl/', 'bệnh viện', 'He is in the hospital.', 'HEALTH', 4, 'NOUN'),
('headache', '/ˈhedeɪk/', 'đau đầu', 'I have a headache.', 'HEALTH', 4, 'NOUN'),
('fever', '/ˈfiːvər/', 'sốt', 'She has a high fever.', 'HEALTH', 4, 'NOUN'),
('cough', '/kɒf/', 'ho', 'The cough is getting worse.', 'HEALTH', 4, 'NOUN'),
('pain', '/peɪn/', 'đau', 'I have pain in my back.', 'HEALTH', 4, 'NOUN'),
('exercise', '/ˈeksərsaɪz/', 'tập thể dục', 'Exercise is good for health.', 'HEALTH', 4, 'NOUN'),
('rest', '/rest/', 'nghỉ ngơi', 'You need to rest.', 'HEALTH', 4, 'VERB'),
('sleep', '/sliːp/', 'ngủ', 'Get enough sleep.', 'HEALTH', 4, 'VERB'),
('diet', '/ˈdaɪət/', 'chế độ ăn', 'A balanced diet is important.', 'HEALTH', 4, 'NOUN');

-- SPORTS - Level 4
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('sport', '/spɔːrt/', 'thể thao', 'Football is my favorite sport.', 'SPORTS', 4, 'NOUN'),
('football', '/ˈfʊtbɔːl/', 'bóng đá', 'I play football every weekend.', 'SPORTS', 4, 'NOUN'),
('basketball', '/ˈbæskɪtbɔːl/', 'bóng rổ', 'Basketball is exciting.', 'SPORTS', 4, 'NOUN'),
('tennis', '/ˈtenɪs/', 'quần vợt', 'I like watching tennis.', 'SPORTS', 4, 'NOUN'),
('swimming', '/ˈswɪmɪŋ/', 'bơi lội', 'Swimming is good exercise.', 'SPORTS', 4, 'NOUN'),
('running', '/ˈrʌnɪŋ/', 'chạy bộ', 'Running keeps me fit.', 'SPORTS', 4, 'NOUN'),
('volleyball', '/ˈvɒlibɔːl/', 'bóng chuyền', 'We play volleyball at school.', 'SPORTS', 4, 'NOUN'),
('badminton', '/ˈbædmɪntən/', 'cầu lông', 'Badminton is popular in Vietnam.', 'SPORTS', 4, 'NOUN'),
('team', '/tiːm/', 'đội', 'Our team won the match.', 'SPORTS', 4, 'NOUN'),
('player', '/ˈpleɪər/', 'cầu thủ', 'He is a good player.', 'SPORTS', 4, 'NOUN'),
('win', '/wɪn/', 'thắng', 'We must win this game.', 'SPORTS', 4, 'VERB'),
('lose', '/luːz/', 'thua', 'Don''t be sad if you lose.', 'SPORTS', 4, 'VERB'),
('game', '/ɡeɪm/', 'trận đấu', 'The game starts at 7 PM.', 'SPORTS', 4, 'NOUN'),
('coach', '/koʊtʃ/', 'huấn luyện viên', 'The coach trains the team.', 'SPORTS', 4, 'NOUN'),
('champion', '/ˈtʃæmpiən/', 'vô địch', 'They are the champions.', 'SPORTS', 4, 'NOUN');

-- Level 5: Expert vocabulary (add Technology, Science, Business, etc.)

-- TECHNOLOGY - Level 5
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('computer', '/kəmˈpjuːtər/', 'máy tính', 'I work on a computer.', 'TECHNOLOGY', 5, 'NOUN'),
('internet', '/ˈɪntərnet/', 'mạng internet', 'The internet is useful.', 'TECHNOLOGY', 5, 'NOUN'),
('smartphone', '/ˈsmɑːrtfoʊn/', 'điện thoại thông minh', 'Everyone has a smartphone.', 'TECHNOLOGY', 5, 'NOUN'),
('software', '/ˈsɒftweər/', 'phần mềm', 'Update the software.', 'TECHNOLOGY', 5, 'NOUN'),
('hardware', '/ˈhɑːrdweər/', 'phần cứng', 'The hardware needs repair.', 'TECHNOLOGY', 5, 'NOUN'),
('website', '/ˈwebsaɪt/', 'trang web', 'Visit our website.', 'TECHNOLOGY', 5, 'NOUN'),
('application', '/ˌæplɪˈkeɪʃn/', 'ứng dụng', 'Download the application.', 'TECHNOLOGY', 5, 'NOUN'),
('password', '/ˈpæswɜːrd/', 'mật khẩu', 'Don''t share your password.', 'TECHNOLOGY', 5, 'NOUN'),
('download', '/ˈdaʊnloʊd/', 'tải xuống', 'Download the file.', 'TECHNOLOGY', 5, 'VERB'),
('upload', '/ʌpˈloʊd/', 'tải lên', 'Upload your photo.', 'TECHNOLOGY', 5, 'VERB'),
('data', '/ˈdeɪtə/', 'dữ liệu', 'Protect your data.', 'TECHNOLOGY', 5, 'NOUN'),
('digital', '/ˈdɪdʒɪtl/', 'kỹ thuật số', 'We live in a digital age.', 'TECHNOLOGY', 5, 'ADJECTIVE'),
('artificial intelligence', '/ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns/', 'trí tuệ nhân tạo', 'AI is changing the world.', 'TECHNOLOGY', 5, 'NOUN'),
('network', '/ˈnetwɜːrk/', 'mạng', 'The network is down.', 'TECHNOLOGY', 5, 'NOUN'),
('device', '/dɪˈvaɪs/', 'thiết bị', 'This device is new.', 'TECHNOLOGY', 5, 'NOUN');

-- BUSINESS - Level 5
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('business', '/ˈbɪznəs/', 'kinh doanh', 'He runs his own business.', 'BUSINESS', 5, 'NOUN'),
('market', '/ˈmɑːrkɪt/', 'thị trường', 'The market is competitive.', 'BUSINESS', 5, 'NOUN'),
('investment', '/ɪnˈvestmənt/', 'đầu tư', 'This is a good investment.', 'BUSINESS', 5, 'NOUN'),
('profit', '/ˈprɒfɪt/', 'lợi nhuận', 'The company made a profit.', 'BUSINESS', 5, 'NOUN'),
('customer', '/ˈkʌstəmər/', 'khách hàng', 'The customer is always right.', 'BUSINESS', 5, 'NOUN'),
('contract', '/ˈkɒntrækt/', 'hợp đồng', 'Sign the contract.', 'BUSINESS', 5, 'NOUN'),
('negotiation', '/nɪˌɡoʊʃiˈeɪʃn/', 'đàm phán', 'The negotiation was successful.', 'BUSINESS', 5, 'NOUN'),
('budget', '/ˈbʌdʒɪt/', 'ngân sách', 'Stay within the budget.', 'BUSINESS', 5, 'NOUN'),
('revenue', '/ˈrevənjuː/', 'doanh thu', 'Revenue increased this year.', 'BUSINESS', 5, 'NOUN'),
('strategy', '/ˈstrætədʒi/', 'chiến lược', 'We need a new strategy.', 'BUSINESS', 5, 'NOUN'),
('entrepreneur', '/ˌɒntrəprəˈnɜːr/', 'doanh nhân', 'She is a successful entrepreneur.', 'BUSINESS', 5, 'NOUN'),
('startup', '/ˈstɑːrtʌp/', 'công ty khởi nghiệp', 'The startup is growing fast.', 'BUSINESS', 5, 'NOUN'),
('partnership', '/ˈpɑːrtnərʃɪp/', 'đối tác', 'We formed a partnership.', 'BUSINESS', 5, 'NOUN'),
('competition', '/ˌkɒmpəˈtɪʃn/', 'cạnh tranh', 'The competition is fierce.', 'BUSINESS', 5, 'NOUN'),
('global', '/ˈɡloʊbl/', 'toàn cầu', 'We have a global market.', 'BUSINESS', 5, 'ADJECTIVE');

-- SCIENCE - Level 5
INSERT INTO vocabulary_words (word, phonetic, meaning, example, topic, level, word_type) VALUES
('science', '/ˈsaɪəns/', 'khoa học', 'Science is fascinating.', 'SCIENCE', 5, 'NOUN'),
('research', '/ˈriːsɜːrtʃ/', 'nghiên cứu', 'The research is ongoing.', 'SCIENCE', 5, 'NOUN'),
('experiment', '/ɪkˈsperɪmənt/', 'thí nghiệm', 'The experiment was successful.', 'SCIENCE', 5, 'NOUN'),
('discovery', '/dɪˈskʌvəri/', 'phát hiện', 'It was an important discovery.', 'SCIENCE', 5, 'NOUN'),
('theory', '/ˈθɪəri/', 'lý thuyết', 'The theory was proven.', 'SCIENCE', 5, 'NOUN'),
('laboratory', '/ˈlæbrətɔːri/', 'phòng thí nghiệm', 'Work in the laboratory.', 'SCIENCE', 5, 'NOUN'),
('scientist', '/ˈsaɪəntɪst/', 'nhà khoa học', 'The scientist made a discovery.', 'SCIENCE', 5, 'NOUN'),
('atom', '/ˈætəm/', 'nguyên tử', 'Everything is made of atoms.', 'SCIENCE', 5, 'NOUN'),
('molecule', '/ˈmɒlɪkjuːl/', 'phân tử', 'Water molecule is H2O.', 'SCIENCE', 5, 'NOUN'),
('energy', '/ˈenərdʒi/', 'năng lượng', 'We need clean energy.', 'SCIENCE', 5, 'NOUN'),
('environment', '/ɪnˈvaɪrənmənt/', 'môi trường', 'Protect the environment.', 'SCIENCE', 5, 'NOUN'),
('climate', '/ˈklaɪmət/', 'khí hậu', 'Climate change is serious.', 'SCIENCE', 5, 'NOUN'),
('biology', '/baɪˈɒlədʒi/', 'sinh học', 'I study biology.', 'SCIENCE', 5, 'NOUN'),
('chemistry', '/ˈkemɪstri/', 'hóa học', 'Chemistry is interesting.', 'SCIENCE', 5, 'NOUN'),
('physics', '/ˈfɪzɪks/', 'vật lý', 'Physics explains how things work.', 'SCIENCE', 5, 'NOUN');
