package com.wolftalk.backend.component;

import com.wolftalk.backend.entity.*;
import com.wolftalk.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

        private final SyllabusLevelRepository levelRepository;
        private final SyllabusUnitRepository unitRepository;
        private final SyllabusLessonRepository lessonRepository;
        private final LessonVocabularyRepository vocabRepository;
        private final LessonGrammarRepository grammarRepository;
        private final LessonConversationRepository conversationRepository;
        private final LessonPracticeQuestionRepository practiceRepository;
        private final CheckpointTestRepository testRepository;
        private final CheckpointQuestionRepository questionRepository;

        // Repositories for cleaning up progress to avoid FK violations
        private final UserUnitProgressRepository unitProgressRepository;
        private final UserLessonProgressRepository lessonProgressRepository;

        public DataSeeder(SyllabusLevelRepository levelRepository,
                        SyllabusUnitRepository unitRepository,
                        SyllabusLessonRepository lessonRepository,
                        LessonVocabularyRepository vocabRepository,
                        LessonGrammarRepository grammarRepository,
                        LessonConversationRepository conversationRepository,
                        LessonPracticeQuestionRepository practiceRepository,
                        CheckpointTestRepository testRepository,
                        CheckpointQuestionRepository questionRepository,
                        UserUnitProgressRepository unitProgressRepository,
                        UserLessonProgressRepository lessonProgressRepository) {
                this.levelRepository = levelRepository;
                this.unitRepository = unitRepository;
                this.lessonRepository = lessonRepository;
                this.vocabRepository = vocabRepository;
                this.grammarRepository = grammarRepository;
                this.conversationRepository = conversationRepository;
                this.practiceRepository = practiceRepository;
                this.testRepository = testRepository;
                this.questionRepository = questionRepository;
                this.unitProgressRepository = unitProgressRepository;
                this.lessonProgressRepository = lessonProgressRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                // Modified check: Trigger re-seed for new practice questions and units 3-5.
                // Using 250 as threshold to force re-seed on existing environments.
                if (levelRepository.count() == 0 || vocabRepository.count() < 10) {
                        System.out.println(
                                        "DataSeeder: Syllabus data missing. Re-seeding...");
                        cleanupSyllabusData();
                        seedSyllabusData();
                        System.out.println("DataSeeder: Seeding complete.");
                } else {
                        System.out.println("DataSeeder: Syllabus data exists (" + vocabRepository.count()
                                        + " words). Skipping seed.");
                }
        }

        private void cleanupSyllabusData() {
                // Delete child entities first to satisfy foreign key constraints

                // 1. Checkpoint Content
                questionRepository.deleteAll();
                testRepository.deleteAll();

                // 2. Lesson Content
                vocabRepository.deleteAll();
                grammarRepository.deleteAll();
                conversationRepository.deleteAll();
                practiceRepository.deleteAll();

                // 3. User Progress (Must delete this as it refers to units/lessons)
                // NOTE: In a production migration we would try to preserve this, but for dev
                // seeding we wipe it to ensure consistency.
                lessonProgressRepository.deleteAll();
                unitProgressRepository.deleteAll();

                // 4. Lessons
                lessonRepository.deleteAll();

                // 5. Units
                unitRepository.deleteAll();

                // 6. Levels
                levelRepository.deleteAll();
        }

        private void seedSyllabusData() {
                // Levels
                SyllabusLevel a1 = createLevel("A1", "Beginner", "Basic",
                                "Khởi động hành trình tiếng Anh. Hiểu và sử dụng các cấu trúc cơ bản nhất.",
                                "#4CAF50", 1, 10);

                SyllabusLevel a2 = createLevel("A2", "Elementary", "Basic",
                                "Giao tiếp trong các tình huống quen thuộc hàng ngày.",
                                "#2196F3", 2, 12);

                SyllabusLevel b1 = createLevel("B1", "Intermediate", "Independent",
                                "Xử lý các tình huống khi đi du lịch và công việc đơn giản.",
                                "#FF9800", 3, 15);

                SyllabusLevel b2 = createLevel("B2", "Upper Intermediate", "Independent",
                                "Giao tiếp trôi chảy, hiểu các văn bản phức tạp.",
                                "#9C27B0", 4, 15);

                levelRepository.saveAll(List.of(a1, a2, b1, b2));

                seedA1Units(a1);
                seedA2Units(a2);
                seedCheckpointTests(a1);
        }

        private SyllabusLevel createLevel(String id, String name, String group, String desc, String color, int order,
                        int totalUnits) {
                SyllabusLevel level = new SyllabusLevel();
                level.setId(id);
                level.setName(name);
                level.setGroup(group);
                level.setDescription(desc);
                level.setColor(color);
                level.setOrder(order);
                level.setTotalUnits(totalUnits);
                return level;
        }

        private void seedA1Units(SyllabusLevel level) {
                List<SyllabusUnit> units = new ArrayList<>();

                // 1. Greetings & Introductions
                SyllabusUnit u1 = createUnit("u1_greet", level, 1, "Greetings & Introductions",
                                "Học cách chào hỏi, giới thiệu bản thân.", "Social",
                                "https://img.freepik.com/free-vector/people-waving-hand-illustration-concept_52683-24227.jpg");
                units.add(u1);

                // 2. Family & Friends
                SyllabusUnit u2 = createUnit("u2_family", level, 2, "Family & Friends", "Mô tả gia đình, bạn bè.",
                                "Family",
                                "https://img.freepik.com/free-vector/happy-family-concept-illustration_114360-1784.jpg");
                units.add(u2);

                // 3. Daily Routine
                SyllabusUnit u3 = createUnit("u3_routine", level, 3, "Daily Routine", "Thói quen hàng ngày.", "Life",
                                "https://img.freepik.com/free-vector/daily-routine-concept-illustration_114360-10022.jpg");
                units.add(u3);

                // 4. Shopping (Đi siêu thị)
                SyllabusUnit u4 = createUnit("u4_shopping", level, 4, "Shopping & Market",
                                "Mua sắm tại siêu thị và chợ.",
                                "Shopping",
                                "https://img.freepik.com/free-vector/shopping-cart-concept-illustration_114360-1358.jpg");
                units.add(u4);

                // 5. Food & Drink
                SyllabusUnit u5 = createUnit("u5_food", level, 5, "Food & Drink", "Thức ăn và đồ uống.", "Food",
                                "https://img.freepik.com/free-vector/eating-healthy-food-concept-illustration_114360-2235.jpg");
                units.add(u5);

                // 6. My City
                SyllabusUnit u6 = createUnit("u6_city", level, 6, "My City", "Mô tả thành phố nơi bạn sống.", "Travel",
                                "https://img.freepik.com/free-vector/city-skyline-illustration_23-2148918227.jpg");
                units.add(u6);

                // 7. Jobs & Occupations
                SyllabusUnit u7 = createUnit("u7_jobs", level, 7, "Jobs & Occupations", "Công việc và nghề nghiệp.",
                                "Work",
                                "https://img.freepik.com/free-vector/organic-flat-customer-support-illustration_23-2148899174.jpg");
                units.add(u7);

                // 8. Hobbies & Interests
                SyllabusUnit u8 = createUnit("u8_hobbies", level, 8, "Hobbies & Interests", "Nói về sở thích cá nhân.",
                                "Social",
                                "https://img.freepik.com/free-vector/hobby-concept-illustration_114360-2831.jpg");
                units.add(u8);

                // 9. Festivals & Holidays
                SyllabusUnit u9 = createUnit("u9_festivals", level, 9, "Festivals & Holidays", "Lễ hội và kỳ nghỉ.",
                                "Culture",
                                "https://img.freepik.com/free-vector/celebration-party-concept-illustration_114360-1776.jpg");
                units.add(u9);

                // 10. Health & Body
                SyllabusUnit u10 = createUnit("u10_health", level, 10, "Health & Body", "Sức khỏe và cơ thể.", "Health",
                                "https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg");
                units.add(u10);

                unitRepository.saveAll(units);

                // --- SEED CONTENT FOR EACH UNIT ---

                // U1: Greetings
                seedCompleteUnitLessons(u1, "u1", "Greetings", "To Be (Intro)", "Meeting Someone",
                                List.of(createVocab("Hello", "/həˈləʊ/", "Xin chào", "Hello, how are you?", "Greeting"),
                                                createVocab("Hi", "/haɪ/", "Chào (thân mật)", "Hi! I'm Minh.",
                                                                "Greeting"),
                                                createVocab("Goodbye", "/ɡʊdˈbaɪ/", "Tạm biệt",
                                                                "Goodbye, see you later.",
                                                                "Closing"),
                                                createVocab("My name is", "/maɪ neɪm ɪz/", "Tên tôi là...",
                                                                "My name is Lan.", "Intro"),
                                                createVocab("Nice to meet you", "/naɪs tuː miːt jʊ/",
                                                                "Rất vui được gặp bạn", "Nice to meet you too.",
                                                                "Social"),
                                                createVocab("Excuse me", "/ɪkˈskjʊːz miː/", "Xin lỗi (để ngắt lời)",
                                                                "Excuse me, where is the toilet?", "Polite"),
                                                createVocab("Please", "/pliːz/", "Vui lòng / Làm ơn",
                                                                "Wait for me, please.", "Polite"),
                                                createVocab("How are you?", "/haʊ ɑːr jʊ/", "Bạn khỏe không?",
                                                                "How are you? I am fine.", "Social")),
                                List.of(createGrammar("To Be (Giới thiệu tên)", "I am / My name is + Name",
                                                "Dùng để giới thiệu tên của bản thân.", "I am Lan. / My name is Minh.",
                                                "Có thể viết tắt: I'm..."),
                                                createGrammar("To Be (Nơi chốn)", "I am from + Country/City",
                                                                "Dùng để nói về quê quán, nơi xuất thân.",
                                                                "I'm from Vietnam.", "From + Quốc gia/Thành phố"),
                                                createGrammar("Hỏi thăm sức khỏe", "How are you? - I'm + Adj",
                                                                "Cấu trúc hỏi và trả lời về sức khỏe.",
                                                                "How are you? - I'm fine, thanks.",
                                                                "Các tính từ: fine, good, ok, bad...")),
                                List.of(createTurn(1, "A: Hello, I'm Nam.", "A: Chào, tôi là Nam."),
                                                createTurn(2, "B: Hi Nam, I'm Sarah. Nice to meet you.",
                                                                "B: Chào Nam, tôi là Sarah. Rất vui được gặp bạn."),
                                                createTurn(3, "A: Where are you from?", "A: Bạn đến từ đâu?"),
                                                createTurn(4, "B: I'm from America. And you?",
                                                                "B: Tôi đến từ Mỹ. Còn bạn?")),
                                Arrays.asList(createPracticeMC("u1_p1",
                                                "What do you say when you meet someone for the first time?",
                                                "Nice to meet you",
                                                Arrays.asList("Goodbye", "Nice to meet you", "Thank you", "Excuse me"),
                                                "It is polite to say 'Nice to meet you' when meeting someone new."),
                                                createPracticeFillBlank("u1_p2", "I ___ from Vietnam.", "am",
                                                                Arrays.asList("am", "is", "are"),
                                                                "With the subject 'I', we use 'am'."),
                                                createPracticeMatching("u1_p3", "Match the word to its translation",
                                                                Arrays.asList(
                                                                                new PracticeMatchingPair(null, "Hello",
                                                                                                "Xin chào"),
                                                                                new PracticeMatchingPair(null,
                                                                                                "Goodbye",
                                                                                                "Tạm biệt"),
                                                                                new PracticeMatchingPair(null, "Please",
                                                                                                "Vui lòng"))),
                                                createPracticeOrdering("u1_p4", "Reorder the words to make a sentence",
                                                                Arrays.asList("is", "My", "Minh", "name"),
                                                                Arrays.asList("My", "name", "is", "Minh"))));

                // U2: Family
                seedCompleteUnitLessons(u2, "u2", "Family Members", "Possessives", "Family Talk",
                                List.of(createVocab("Family", "/ˈfæm.əl.i/", "Gia đình", "I love my family.", "Social"),
                                                createVocab("Father", "/ˈfɑː.ðər/", "Bố", "My father is a doctor.",
                                                                "Family"),
                                                createVocab("Mother", "/ˈmʌð.ər/", "Mẹ", "My mother cooks well.",
                                                                "Family"),
                                                createVocab("Brother", "/ˈbrʌð.ər/", "Anh/em trai", "I have a brother.",
                                                                "Family"),
                                                createVocab("Sister", "/ˈsɪs.tər/", "Chị/em gái", "My sister is cute.",
                                                                "Family"),
                                                createVocab("Grandfather", "/ˈɡrændˌfɑː.ðər/", "Ông",
                                                                "He is my grandfather.", "Family"),
                                                createVocab("Grandmother", "/ˈɡrændˌmʌð.ər/", "Bà",
                                                                "She is my grandmother.", "Family"),
                                                createVocab("Cousin", "/ˈkʌz.ən/", "Anh chị em họ",
                                                                "This is my cousin.", "Family")),
                                List.of(createGrammar("Possessives", "My/Your/His/Her", "Tính từ sở hữu.",
                                                "This is my mom.", "Ownership"),
                                                createGrammar("Have/Has", "S + have/has + N", "Động từ có.",
                                                                "I have two sisters.", "Possession")),
                                List.of(createTurn(1, "A: Do you have siblings?", "A: Bạn có anh chị em không?"),
                                                createTurn(2, "B: Yes, one sister.", "B: Có, một em gái.")),
                                Arrays.asList(createPracticeMC("u2_p1", "Who is the sister of your father?", "Aunt",
                                                Arrays.asList("Mother", "Sister", "Aunt", "Cousin"),
                                                "Your father's sister is your aunt."),
                                                createPracticeFillBlank("u2_p2", "She ___ a small family.", "has",
                                                                Arrays.asList("has", "have"),
                                                                "With singular subjects like 'She', we use 'has'."),
                                                createPracticeOrdering("u2_p3",
                                                                "Complete the sentence: (father / my / is / a / doctor)",
                                                                Arrays.asList("father", "my", "is", "a", "doctor"),
                                                                Arrays.asList("my", "father", "is", "a", "doctor"))));

                // U3: Daily Routine
                seedCompleteUnitLessons(u3, "u3", "Routine Verbs", "Present Simple", "Morning Routine",
                                List.of(createVocab("Wake up", "/weɪk ʌp/", "Thức dậy", "I wake up at 6 AM.", "Daily"),
                                                createVocab("Brush teeth", "/brʌʃ tiːθ/", "Đánh răng",
                                                                "I brush my teeth twice a day.", "Daily"),
                                                createVocab("Have breakfast", "/hæv ˈbrek.fəst/", "Ăn sáng",
                                                                "I have breakfast at 7 AM.", "Food"),
                                                createVocab("Go to school", "/ɡəʊ tuː skuːl/", "Đi học",
                                                                "I go to school by bus.", "School"),
                                                createVocab("Go to sleep", "/ɡəʊ tuː sliːp/", "Đi ngủ",
                                                                "I go to sleep at 10 PM.", "Rest")),
                                List.of(createGrammar("Present Simple", "S + V(s/es)",
                                                "Diễn tả thói quen lặp đi lặp lại.", "I usually get up early.",
                                                "Habits"),
                                                createGrammar("Time Prepositions (at)", "at + time",
                                                                "Chỉ giờ giấc cụ thể.", "I start at 8 AM.", "Time")),
                                List.of(createTurn(1, "A: What time do you wake up?", "A: Bạn thức dậy lúc mấy giờ?"),
                                                createTurn(2, "B: I wake up at 6 AM.", "B: Tôi dậy lúc 6 giờ sáng."),
                                                createTurn(3, "A: What do you do then?", "A: Sau đó bạn làm gì?"),
                                                createTurn(4, "B: I brush my teeth and have breakfast.",
                                                                "B: Tôi đánh răng và ăn sáng.")),
                                Arrays.asList(createPracticeMC("u3_p1", "She ___ her teeth every morning.", "brushes",
                                                Arrays.asList("brush", "brushes", "brushing"),
                                                "With She/He/It, we use s/es."),
                                                createPracticeFillBlank("u3_p2", "I go ___ school by bus.", "to",
                                                                Arrays.asList("to", "at", "on"), "Go TO somewhere."),
                                                createPracticeOrdering("u3_p3", "Order: (6 AM / I / wake / up / at)",
                                                                Arrays.asList("6 AM", "I", "wake", "up", "at"),
                                                                Arrays.asList("I", "wake", "up", "at", "6 AM"))));

                // U4: Shopping & Market
                seedCompleteUnitLessons(u4, "u4", "Shopping Items", "How much", "At the Market",
                                List.of(createVocab("Buy", "/baɪ/", "Mua", "I want to buy milk.", "Shop"),
                                                createVocab("Price", "/praɪs/", "Giá", "What is the price?", "Shop"),
                                                createVocab("Cheap", "/tʃiːp/", "Rẻ", "It is very cheap.", "Shop"),
                                                createVocab("Expensive", "/ɪkˈspen.sɪv/", "Đắt", "It is too expensive.",
                                                                "Shop"),
                                                createVocab("Apple", "/ˈæp.əl/", "Quả táo", "An apple a day.",
                                                                "Fruit")),
                                List.of(createGrammar("How much", "How much is...?", "Hỏi giá.", "How much is this?",
                                                "Shop"),
                                                createGrammar("Can I have", "Can I have...", "Yêu cầu mua.",
                                                                "Can I have 2 apples?", "Shop")),
                                List.of(createTurn(1, "A: Hello! How much is this apple?",
                                                "A: Xin chào! Quả táo này bao nhiêu tiền?"),
                                                createTurn(2, "B: It's 1 dollar.", "B: Nó giá 1 đô la."),
                                                createTurn(3, "A: Can I have two apples, please?",
                                                                "A: Cho tôi 2 quả táo nhé?"),
                                                createTurn(4, "B: Sure. Here you are.",
                                                                "B: Chắc chắn rồi. Của bạn đây.")),
                                Arrays.asList(createPracticeMC("u4_p1", "Is this expensive? - No, it is ___.", "cheap",
                                                Arrays.asList("expensive", "cheap", "big"),
                                                "The opposite of expensive is cheap."),
                                                createPracticeFillBlank("u4_p2", "How ___ is this book?", "much",
                                                                Arrays.asList("much", "many", "old"),
                                                                "How MUCH is for price."),
                                                createPracticeMatching("u4_p3", "Match the word",
                                                                Arrays.asList(new PracticeMatchingPair(null, "Buy",
                                                                                "Mua"),
                                                                                new PracticeMatchingPair(null, "Money",
                                                                                                "Tiền")))));

                // U5: Food & Drink
                seedCompleteUnitLessons(u5, "u5", "Food & Taste", "Would like", "Dining",
                                List.of(createVocab("Rice", "/raɪs/", "Cơm", "I eat rice every day.", "Food"),
                                                createVocab("Bread", "/bred/", "Bánh mì", "Bread and butter.", "Food"),
                                                createVocab("Chicken", "/ˈtʃɪk.ɪn/", "Thịt gà", "Fried chicken.",
                                                                "Food"),
                                                createVocab("Water", "/ˈwɔː.tər/", "Nước", "Drink water.", "Drink"),
                                                createVocab("Delicious", "/dɪˈlɪʃ.əs/", "Ngon", "This is delicious.",
                                                                "Taste")),
                                List.of(createGrammar("Would like", "I would like + N", "Muốn cái gì đó (lịch sự).",
                                                "I would like some water.", "Polite"),
                                                createGrammar("Countable/Uncountable", "Some/Any",
                                                                "Dùng với danh từ đếm được và không đếm được.",
                                                                "I have some rice.", "Grammar")),
                                List.of(createTurn(1, "A: What is your favorite food?",
                                                "A: Món ăn yêu thích của bạn là gì?"),
                                                createTurn(2, "B: I love chicken and rice.", "B: Tôi thích gà và cơm."),
                                                createTurn(3, "A: Do you like noodles?", "A: Bạn có thích mì không?"),
                                                createTurn(4, "B: Yes, sometimes.", "B: Có, thỉnh thoảng.")),
                                Arrays.asList(createPracticeMC("u5_p1", "I am ___. I want to eat.", "hungry",
                                                Arrays.asList("thirsty", "hungry", "tired"),
                                                "When you want to eat, you are hungry."),
                                                createPracticeFillBlank("u5_p2", "I would like ___ apple.", "an",
                                                                Arrays.asList("a", "an", "some"),
                                                                "Apple starts with a vowel."),
                                                createPracticeOrdering("u5_p3",
                                                                "Order: (would / like / water / I / some)",
                                                                Arrays.asList("would", "like", "water", "I", "some"),
                                                                Arrays.asList("I", "would", "like", "some", "water"))));

                // U6: My City
                seedCompleteUnitLessons(u6, "u6", "City Places", "Directions", "Finding a Park",
                                List.of(createVocab("City", "/ˈsɪt.i/", "Thành phố", "I live in the city.", "Place"),
                                                createVocab("Park", "/pɑːk/", "Công viên", "Let's go to the park.",
                                                                "Place"),
                                                createVocab("Cinema", "/ˈsɪn.ə.mə/", "Rạp chiếu phim",
                                                                "Watch a movie at the cinema.", "Place"),
                                                createVocab("Map", "/mæp/", "Bản đồ", "I need a map.", "Tool"),
                                                createVocab("Turn left/right", "-", "Rẽ trái/phải",
                                                                "Turn left at the bank.", "Direction")),
                                List.of(createGrammar("Imperatives (Directions)", "V (Turn/Go...)",
                                                "Câu mệnh lệnh chỉ đường.", "Turn left.", "Direction"),
                                                createGrammar("Prepositions of Place", "next to, opposite, behind",
                                                                "Chỉ vị trí địa điểm.", "The bank is next to the park.",
                                                                "Location")),
                                List.of(createTurn(1, "A: Is there a park near here?",
                                                "A: Có công viên nào gần đây không?"),
                                                createTurn(2, "B: Yes, it is next to the cinema.",
                                                                "B: Có, nó ở cạnh rạp chiếu phim."),
                                                createTurn(3, "A: Is it beautiful?", "A: Nó có đẹp không?"),
                                                createTurn(4, "B: Yes, very beautiful.", "B: Có, rất đẹp.")));

                // U7: Jobs
                seedCompleteUnitLessons(u7, "u7", "Occupations", "Job Questions", "Nói về công việc",
                                List.of(createVocab("Doctor", "/ˈdɒk.tər/", "Bác sĩ", "He is a doctor.", "Work"),
                                                createVocab("Teacher", "/ˈtiː.tʃər/", "Giáo viên", "She is a teacher.",
                                                                "Work"),
                                                createVocab("Student", "/ˈstjuː.dənt/", "Sinh viên/học sinh",
                                                                "I am a student.", "Work"),
                                                createVocab("Office", "/ˈɒf.ɪs/", "Văn phòng", "Work in an office.",
                                                                "Place"),
                                                createVocab("Engineer", "/ˌen.dʒɪˈnɪər/", "Kỹ sư", "I am an engineer.",
                                                                "Work")),
                                List.of(createGrammar("What do you do?", "What do you do?", "Hỏi nghề nghiệp.",
                                                "What do you do? - I'm a teacher.", "Work"),
                                                createGrammar("Work vs Works", "I work / He works",
                                                                "Chia động từ hiện tại đơn.", "She works in a bank.",
                                                                "Grammar")),
                                List.of(createTurn(1, "A: What do you do?", "A: Bạn làm nghề gì?"),
                                                createTurn(2, "B: I am a teacher.", "B: Tôi là giáo viên."),
                                                createTurn(3, "A: Where do you work?", "A: Bạn làm việc ở đâu?"),
                                                createTurn(4, "B: I work at a school.",
                                                                "B: Tôi làm việc ở trường học.")));

                // U8: Hobbies
                seedCompleteUnitLessons(u8, "u8", "Hobbies & Fun", "Like + Ving", "Free Time",
                                List.of(createVocab("Hobby", "/ˈhɒb.i/", "Sở thích", "What is your hobby?", "Fun"),
                                                createVocab("Like", "/laɪk/", "Thích", "I like reading.", "Verb"),
                                                createVocab("Love", "/lʌv/", "Yêu thích", "I love music.", "Verb"),
                                                createVocab("Swim", "/swɪm/", "Bơi", "I go swimming.", "Activity"),
                                                createVocab("Soccer", "/ˈsɒk.ər/", "Bóng đá", "I play soccer.",
                                                                "Sport")),
                                List.of(createGrammar("Like + V-ing", "S + like/love + V-ing", "Diễn tả sở thích.",
                                                "I like swimming.", "Activity"),
                                                createGrammar("Hobby Questions", "What is your hobby?",
                                                                "Hỏi về sở thích.", "What is your hobby?", "Social")),
                                List.of(createTurn(1, "A: What is your hobby?", "A: Sở thích của bạn là gì?"),
                                                createTurn(2, "B: I like swimming and reading.",
                                                                "B: Tôi thích bơi lội và đọc sách."),
                                                createTurn(3, "A: How often do you swim?",
                                                                "A: Bạn có thường xuyên bơi không?"),
                                                createTurn(4, "B: Twice a week.", "B: Hai lần một tuần.")));

                // U9: Festivals
                seedCompleteUnitLessons(u9, "u9", "Celebrations", "Past Simple", "Lunar New Year",
                                List.of(createVocab("Holiday", "/ˈhɒl.ə.deɪ/", "Kỳ nghỉ", "Happy holiday!", "Culture"),
                                                createVocab("Festival", "/ˈfes.tɪ.vəl/", "Lễ hội", "Tet festival.",
                                                                "Culture"),
                                                createVocab("Gift", "/ɡɪft/", "Quà tặng", "A special gift.", "Social"),
                                                createVocab("Lucky money", "/ˈlʌk.i ˈmʌn.i/", "Tiền lì xì",
                                                                "I get lucky money.", "Culture"),
                                                createVocab("Visit", "/ˈvɪz.ɪt/", "Thăm", "Visit grandparents.",
                                                                "Activity")),
                                List.of(createGrammar("Past Simple (To Be)", "Was / Were", "Quá khứ của To Be.",
                                                "It was fun.", "History"),
                                                createGrammar("Past Simple (Regular)", "V-ed",
                                                                "Động từ quy tắc quá khứ.", "I visited my grandma.",
                                                                "Grammar")),
                                List.of(createTurn(1, "A: What do you do on Tet holiday?",
                                                "A: Bạn làm gì vào dịp Tết?"),
                                                createTurn(2, "B: I visit my grandparents.", "B: Tôi đi thăm ông bà."),
                                                createTurn(3, "A: Do you get lucky money?",
                                                                "A: Bạn có nhận lì xì không?"),
                                                createTurn(4, "B: Yes, I do.", "B: Có chứ.")));

                // U10: Health
                seedCompleteUnitLessons(u10, "u10", "Health & Body", "How are you?", "At the Doctor",
                                List.of(createVocab("Fine", "/faɪn/", "Khỏe", "I'm fine, thank you.", "Health"),
                                                createVocab("Sick", "/sɪk/", "Ốm", "I feel sick.", "Health"),
                                                createVocab("Doctor", "/ˈdɒk.tər/", "Bác sĩ", "I need to see a doctor.",
                                                                "Health"),
                                                createVocab("Medicine", "/ˈmed.ɪ.sən/", "Thuốc", "Take this medicine.",
                                                                "Treatment"),
                                                createVocab("Hospital", "/ˈhɒs.pɪ.təl/", "Bệnh viện",
                                                                "Go to the hospital.", "Place")),
                                List.of(createGrammar("How questions", "How + be + S?", "Hỏi thăm trạng thái.",
                                                "How are you?", "Social"),
                                                createGrammar("Have + Illness", "S + have/has + N (bệnh)",
                                                                "Mô tả bệnh tật.", "I have a headache.", "Medical")),
                                List.of(createTurn(1, "A: How are you?", "A: Bạn khỏe không?"),
                                                createTurn(2, "B: I feel sick.", "B: Tôi thấy ốm."),
                                                createTurn(3, "A: What's the matter?", "A: Có chuyện gì vậy?"),
                                                createTurn(4, "B: I have a headache.", "B: Tôi bị đau đầu.")));

        }

        private void seedA2Units(SyllabusLevel level) {
                List<SyllabusUnit> units = new ArrayList<>();

                // 11. Transport
                SyllabusUnit u11 = createUnit("u11_transport", level, 11, "Transport & Travel",
                                "Phương tiện đi lại và du lịch.", "Travel",
                                "https://img.freepik.com/free-vector/city-traffic-concept-illustration_114360-1120.jpg");
                units.add(u11);

                // 12. Weather
                SyllabusUnit u12 = createUnit("u12_weather", level, 12, "Weather & Environment",
                                "Thời tiết và môi trường.",
                                "Nature",
                                "https://img.freepik.com/free-vector/weather-concept-illustration_114360-1189.jpg");
                units.add(u12);

                // 13. Technology
                SyllabusUnit u13 = createUnit("u13_tech", level, 13, "Technology", "Công nghệ và truyền thông.", "Tech",
                                "https://img.freepik.com/free-vector/hand-drawn-computer-science-illustration_23-2149257692.jpg");
                units.add(u13);

                // 14. Public Services
                SyllabusUnit u14 = createUnit("u14_services", level, 14, "Public Services", "Dịch vụ công cộng.",
                                "Service",
                                "https://img.freepik.com/free-vector/post-office-concept-illustration_114360-3183.jpg");
                units.add(u14);

                // 15. Restaurant A2
                SyllabusUnit u15 = createUnit("u15_eating", level, 15, "Eating Out", "Ăn uống tại nhà hàng.", "Food",
                                "https://img.freepik.com/free-vector/restaurant-waiter-concept-illustration_114360-3122.jpg");
                units.add(u15);

                // 16. Future Plans
                SyllabusUnit u16 = createUnit("u16_future", level, 16, "Future Plans", "Dự định tương lai.", "Future",
                                "https://img.freepik.com/free-vector/travel-concept-illustration_114360-1114.jpg");
                units.add(u16);

                // 17. Shopping A2
                SyllabusUnit u17 = createUnit("u17_shopping2", level, 17, "Shopping Clothes", "Mua sắm quần áo.",
                                "Shopping",
                                "https://img.freepik.com/free-vector/shop-assistant-concept-illustration_114360-3121.jpg");
                units.add(u17);

                // 18. Airport
                SyllabusUnit u18 = createUnit("u18_airport", level, 18, "At the Airport", "Tại sân bay.", "Travel",
                                "https://img.freepik.com/free-vector/airport-concept-illustration_114360-3182.jpg");
                units.add(u18);

                // 19. Directions A2
                SyllabusUnit u19 = createUnit("u19_directions", level, 19, "Asking Directions", "Hỏi đường chi tiết.",
                                "Travel",
                                "https://img.freepik.com/free-vector/map-light-concept-illustration_114360-3120.jpg");
                units.add(u19);

                // 20. Descriptions
                SyllabusUnit u20 = createUnit("u20_desc", level, 20, "Descriptions", "Mô tả địa điểm và người.", "Desc",
                                "https://img.freepik.com/free-vector/city-landscape-illustration_23-2148918227.jpg");
                units.add(u20);

                // 21. Hotel
                SyllabusUnit u21 = createUnit("u21_hotel", level, 21, "Hotel Services", "Dịch vụ khách sạn.", "Travel",
                                "https://img.freepik.com/free-vector/hotel-reception-concept-illustration_114360-3123.jpg");
                units.add(u21);

                // 22. My House
                SyllabusUnit u22 = createUnit("u22_house", level, 22, "Describing House", "Mô tả ngôi nhà chi tiết.",
                                "Life",
                                "https://img.freepik.com/free-vector/home-concept-illustration_114360-3119.jpg");
                units.add(u22);

                unitRepository.saveAll(units);

                // --- SEED CONTENT ---

                // U11: Transport
                seedCompleteUnitLessons(u11, "u11", "Transport", "Advice & Movement", "Bus Station",
                                List.of(createVocab("Vehicle", "/ˈviː.ə.kəl/", "Phương tiện",
                                                "Motorbikes remain the most popular vehicle.", "General"),
                                                createVocab("Traffic jam", "/ˈtræf.ɪk dʒæm/", "Tắc đường",
                                                                "I was stuck in a traffic jam.", "Traffic"),
                                                createVocab("Public transport", "/ˌpʌb.lɪk ˈtræn.spɔːt/",
                                                                "Giao thông công cộng", "I use public transport.",
                                                                "Traffic"),
                                                createVocab("Departure", "/dɪˈpɑː.tʃər/", "Giờ khởi hành",
                                                                "The plane's departure is at 9 AM.", "Schedule"),
                                                createVocab("Platform", "/ˈplæt.fɔːm/", "Sân ga",
                                                                "The train arrives at platform 3.", "Station")),
                                List.of(createGrammar("Should/Shouldn't", "S + should + V",
                                                "Đưa ra lời khuyên về giao thông.", "You should take a taxi.",
                                                "Advice"),
                                                createGrammar("Prepositions of Movement",
                                                                "along, across, through, past",
                                                                "Mô tả hướng đi chi tiết.", "Go along the river.",
                                                                "Direction")),
                                List.of(createTurn(1, "A: Excuse me, which bus goes to the city center?",
                                                "A: Xin lỗi, xe buýt nào đi vào trung tâm thành phố?"),
                                                createTurn(2, "B: You should take number 32.",
                                                                "B: Bạn nên bắt xe số 32."),
                                                createTurn(3, "A: How often does it run?",
                                                                "A: Bao lâu thì có một chuyến?"),
                                                createTurn(4, "B: Every 15 minutes.", "B: Mỗi 15 phút.")));

                // U12: Weather
                seedCompleteUnitLessons(u12, "u12", "Weather & Climate", "Future Will", "Weather Report",
                                List.of(createVocab("Sunny", "/ˈsʌn.i/", "Nắng", "It is sunny today.", "Weather"),
                                                createVocab("Cloudy", "/ˈklaʊ.di/", "Có mây", "It is cloudy.",
                                                                "Weather"),
                                                createVocab("Storm", "/stɔːm/", "Bão", "A storm is coming.", "Weather"),
                                                createVocab("Environment", "/ɪnˈvaɪ.rən.mənt/", "Môi trường",
                                                                "Protect the environment.", "Nature"),
                                                createVocab("Pollution", "/pəˈluː.ʃən/", "Ô nhiễm",
                                                                "Air pollution is bad.", "Problem")),
                                List.of(createGrammar("Will for Predictions", "S + will + V", "Dự báo thời tiết.",
                                                "The forecast says it will rain.", "Future"),
                                                createGrammar("Zero Conditional", "If + S + V, S + V",
                                                                "Sự thật hiển nhiên.",
                                                                "If it rains, the ground gets wet.", "Logic")),
                                List.of(createTurn(1, "A: What is the weather like today?",
                                                "A: Thời tiết hôm nay thế nào?"),
                                                createTurn(2, "B: It is sunny and hot.", "B: Trời nắng và nóng."),
                                                createTurn(3, "A: What will the weather be like tomorrow?",
                                                                "A: Thời tiết ngày mai sẽ thế nào?"),
                                                createTurn(4, "B: The forecast says it will rain.",
                                                                "B: Dự báo nói trời sẽ mưa.")));

                // U13: Tech
                seedCompleteUnitLessons(u13, "u13", "Tech Devices", "Technical Zero Conditional", "IT Support",
                                List.of(createVocab("Smartphone", "/ˈsmɑːt.fəʊn/", "Điện thoại thông minh",
                                                "She has a new smartphone.", "Device"),
                                                createVocab("Internet", "/ˈɪn.tə.net/", "Mạng internet",
                                                                "Connect to the internet.", "Network"),
                                                createVocab("Website", "/ˈweb.saɪt/", "Trang web", "Visit our website.",
                                                                "Web"),
                                                createVocab("Battery", "/ˈbæt.ər.i/", "Pin", "My battery is low.",
                                                                "Hardware"),
                                                createVocab("Keyboard", "/ˈkiː.bɔːd/", "Bàn phím",
                                                                "Type on the keyboard.", "Hardware")),
                                List.of(createGrammar("Zero Conditional (Usage)", "If + S + V, S + V",
                                                "Hướng dẫn kỹ thuật.", "If you press this button, it starts.",
                                                "Action"),
                                                createGrammar("Imperatives (Tech)", "Click, Press, Hold",
                                                                "Mệnh lệnh thức hướng dẫn sử dụng.",
                                                                "Click on the icon.", "Step")),
                                List.of(createTurn(1, "A: My laptop is not working.",
                                                "A: Laptop của tôi không hoạt động."),
                                                createTurn(2, "B: What is the problem?", "B: Vấn đề là gì?"),
                                                createTurn(3, "A: The screen is black.", "A: Màn hình bị đen."),
                                                createTurn(4, "B: Have you tried restarting it?",
                                                                "B: Bạn đã thử khởi động lại chưa?")));

                // U14: Services
                seedCompleteUnitLessons(u14, "u14", "Public Services", "Polite Requests", "At the Post Office",
                                List.of(createVocab("Bank", "/bæŋk/", "Ngân hàng", "I need to go to the bank.",
                                                "Place"),
                                                createVocab("Post office", "/ˈpəʊst ˌɒf.ɪs/", "Bưu điện",
                                                                "Where is the post office?", "Place"),
                                                createVocab("Pharmacy", "/ˈfɑː.mə.si/", "Hiệu thuốc",
                                                                "Buy medicine at the pharmacy.", "Place"),
                                                createVocab("Account", "/əˈkaʊnt/", "Tài khoản",
                                                                "I want to open an account.", "Service"),
                                                createVocab("Parcel", "/ˈpɑː.səl/", "Bưu kiện",
                                                                "I want to send a parcel.", "Service")),
                                List.of(createGrammar("Polite Requests", "Could you / Would you...?",
                                                "Yêu cầu lịch sự.", "Could you help me?", "Service"),
                                                createGrammar("May I", "May I + V?", "Xin phép trang trọng.",
                                                                "May I sit here?", "Formal")),
                                List.of(createTurn(1, "A: Good morning. I'd like to send this parcel to Da Nang.",
                                                "A: Chào buổi sáng. Tôi muốn gửi bưu kiện này đi Đà Nẵng."),
                                                createTurn(2, "B: Certainly. Put it on the scale, please.",
                                                                "B: Chắc chắn rồi. Vui lòng đặt nó lên cân."),
                                                createTurn(3, "A: How much is it?", "A: Bao nhiêu tiền vậy?"),
                                                createTurn(4, "B: It's 50,000 dong.", "B: 50,000 đồng.")));

                // U15: Eating Out
                seedCompleteUnitLessons(u15, "u15", "Restaurant Vocab", "Preferences", "Ordering Dinner",
                                List.of(createVocab("Delicious", "/dɪˈlɪʃ.əs/", "Ngon", "This meal is delicious.",
                                                "Taste"),
                                                createVocab("Vegetarian", "/ˌvedʒ.ɪˈteə.ri.ən/", "Chay",
                                                                "I am a vegetarian.", "Diet"),
                                                createVocab("Main course", "/ˌmeɪn ˈkɔːs/", "Món chính",
                                                                "The main course was steak.", "Food"),
                                                createVocab("Starter", "/ˈstɑː.tər/", "Món khai vị",
                                                                "We ordered soup as a starter.", "Food"),
                                                createVocab("Waiter", "/ˈweɪ.tər/", "Bồi bàn",
                                                                "The waiter brought the menu.", "Staff")),
                                List.of(createGrammar("Would like (Review)", "I would like + to V",
                                                "Giao tiếp tại nhà hàng.", "I would like to order now.", "Polite"),
                                                createGrammar("Suggestions", "What do you recommend?", "Hỏi ý kiến.",
                                                                "What would you recommend?", "Asking")),
                                List.of(createTurn(1, "Waiter: Good evening. Are you ready to order?",
                                                "PV: Chào buổi tối. Quý khách đã sẵn sàng gọi món chưa?"),
                                                createTurn(2, "Customer: Yes, I would like the menu, please.",
                                                                "Khách: Vâng, làm ơn cho tôi xem thực đơn."),
                                                createTurn(3, "Waiter: Here you are. Today's special is grilled steak.",
                                                                "PV: Của quý khách đây. Món đặc biệt hôm nay là bò bít tết nướng."),
                                                createTurn(4, "Customer: Sounds delicious. I'll have the steak.",
                                                                "Khách: Nghe ngon đấy. Tôi sẽ ăn bít tết.")));

                // U16: Future Plans
                seedCompleteUnitLessons(u16, "u16", "Time & Travel", "Plans & Intentions", "Weekend Plans",
                                List.of(createVocab("Tomorrow", "/təˈmɒr.əʊ/", "Ngày mai", "I'll see you tomorrow.",
                                                "Time"),
                                                createVocab("Weekend", "/ˌwiːkˈend/", "Cuối tuần",
                                                                "What are you doing this weekend?", "Time"),
                                                createVocab("Vacation", "/veɪˈkeɪ.ʃən/", "Kỳ nghỉ",
                                                                "We are going on vacation.", "Travel"),
                                                createVocab("Stay", "/steɪ/", "Ở lại", "We will stay at a hotel.",
                                                                "Travel"),
                                                createVocab("Visit", "/ˈvɪz.ɪt/", "Thăm",
                                                                "I am going to visit my grandma.", "Social")),
                                List.of(createGrammar("Be going to", "S + am/is/are + going to + V", "Diễn tả dự định.",
                                                "I am going to visit Paris.", "Future"),
                                                createGrammar("Present Continuous (Future)", "S + am/is/are + V-ing",
                                                                "Kế hoạch đã sắp xếp.", "We are meeting at 7 PM.",
                                                                "Fixed")),
                                List.of(createTurn(1, "A: What are you going to do this weekend?",
                                                "A: Bạn định làm gì cuối tuần này?"),
                                                createTurn(2, "B: I am going to visit my grandparents.",
                                                                "B: Tôi định đi thăm ông bà."),
                                                createTurn(3, "A: How are you getting there?",
                                                                "A: Bạn đến đó bằng gì?"),
                                                createTurn(4, "B: We are going by car.",
                                                                "B: Chúng tôi đi bằng ô tô.")));

                // U17: Shopping Clothes
                seedCompleteUnitLessons(u17, "u17", "Clothing & Size", "Adjectives & Comparison", "Buying a Shirt",
                                List.of(createVocab("Clothes", "/kləʊðz/", "Quần áo", "I need new clothes.", "General"),
                                                createVocab("Shirt", "/ʃɜːt/", "Áo sơ mi", "A white shirt.", "Item"),
                                                createVocab("Size", "/saɪz/", "Kích cỡ", "What is your size?",
                                                                "Detail"),
                                                createVocab("Fit", "/fɪt/", "Vừa vặn", "It fits me well.", "Detail"),
                                                createVocab("Try on", "/traɪ ɒn/", "Mặc thử", "Can I try it on?",
                                                                "Action")),
                                List.of(createGrammar("Too / Enough", "Too + Adj / Adj + enough", "Diễn tả mức độ.",
                                                "It is too expensive.", "Degree"),
                                                createGrammar("Order of Adjectives", "Op-S-A-C-O-M", "Trật tự tính từ.",
                                                                "A beautiful new red dress.", "Rules")),
                                List.of(createTurn(1, "Shop Assistant: Hello, can I help you find something?",
                                                "NV: Xin chào, tôi có thể giúp bạn tìm gì không?"),
                                                createTurn(2, "Customer: Yes, I'm looking for a white shirt.",
                                                                "Khách: Vâng, tôi đang tìm một chiếc áo sơ mi trắng."),
                                                createTurn(3, "Shop Assistant: What is your size?",
                                                                "NV: Cỡ của bạn là gì?"),
                                                createTurn(4, "Customer: I think I am a medium.",
                                                                "Khách: Tôi nghĩ tôi mặc cỡ vừa.")));

                // U18: Airport
                seedCompleteUnitLessons(u18, "u18", "Airport Procedures", "Imperatives", "Check-in counter",
                                List.of(createVocab("Gate", "/ɡeɪt/", "Cửa ra máy bay", "Go to gate 5.", "Place"),
                                                createVocab("Boarding", "/ˈbɔː.dɪŋ/", "Lên máy bay",
                                                                "Boarding starts now.", "Process"),
                                                createVocab("Passport", "/ˈpɑːs.pɔːt/", "Hộ chiếu",
                                                                "Here is my passport.", "Doc"),
                                                createVocab("Form", "/fɔːm/", "Mẫu đơn", "Please fill out this form.",
                                                                "Doc"),
                                                createVocab("Flight", "/flaɪt/", "Chuyến bay", "My flight is at 9 PM.",
                                                                "Travel")),
                                List.of(createGrammar("Imperatives (Directions)", "V + Prep", "Chỉ dẫn ở sân bay.",
                                                "Show your passport.", "Instruction")),
                                List.of(createTurn(1, "A: Passport please.", "A: Xin hộ chiếu."),
                                                createTurn(2, "B: Here it is.", "B: Đây ạ."),
                                                createTurn(3, "A: Stand behind the line, please.",
                                                                "A: Làm ơn đứng sau vạch."),
                                                createTurn(4, "B: Okay.", "B: Vâng.")));

                // U19: Directions
                seedCompleteUnitLessons(u19, "u19", "City Landmarks", "Questions & Flow", "Finding Museum",
                                List.of(createVocab("Intersection", "/ˌɪn.təˈsek.ʃən/", "Ngã tư",
                                                "Turn left at the intersection.", "Direction"),
                                                createVocab("Landmark", "/ˈlænd.mɑːk/", "Mốc địa lý",
                                                                "Look for the tall landmark.", "Direction"),
                                                createVocab("Straight", "/streɪt/", "Thẳng", "Go straight.",
                                                                "Direction"),
                                                createVocab("Across", "/əˈkrɒs/", "Băng qua", "Go across the street.",
                                                                "Direction"),
                                                createVocab("Between", "/bɪˈtwiːn/", "Ở giữa",
                                                                "It's between the bank and the park.", "Location")),
                                List.of(createGrammar("Indirect Questions", "Do you know where...?",
                                                "Hỏi đường lịch sự.", "Do you know where the bank is?", "Social"),
                                                createGrammar("Wh- questions (Review)", "Where is...?",
                                                                "Tìm kiếm thông tin.", "Where is the museum?",
                                                                "Query")),
                                List.of(createTurn(1, "A: Excuse me, can you tell me the way to the museum?",
                                                "A: Xin lỗi, bạn có thể chỉ đường cho tôi đến bảo tàng không?"),
                                                createTurn(2, "B: Yes. Go straight along this street.",
                                                                "B: Vâng. Đi thẳng dọc con phố này."),
                                                createTurn(3, "A: Is it far from here?", "A: Nó có xa đây không?"),
                                                createTurn(4, "B: No, it's about 10 minutes on foot.",
                                                                "B: Không, đi bộ khoảng 10 phút.")));

                // U20: Descriptions
                seedCompleteUnitLessons(u20, "u20", "Place Descriptions", "Comparatives", "My Hometown",
                                List.of(createVocab("Beautiful", "/ˈbjuː.tɪ.fəl/", "Đẹp", "The view is beautiful.",
                                                "Khen"),
                                                createVocab("Crowded", "/ˈkraʊ.dɪd/", "Đông đúc",
                                                                "The street is crowded.", "Place"),
                                                createVocab("Ancient", "/ˈeɪn.ʃənt/", "Cổ kính", "Hanoi is ancient.",
                                                                "History"),
                                                createVocab("Modern", "/ˈmɒd.ən/", "Hiện đại", "A modern building.",
                                                                "Place"),
                                                createVocab("Peaceful", "/ˈpiːs.fəl/", "Yên bình",
                                                                "The city is peaceful.", "Vibe")),
                                List.of(createGrammar("Comparative Adjectives", "Short Adj-er / More + Long Adj",
                                                "So sánh hơn.", "Hanoi is older than Da Nang.", "Grammar"),
                                                createGrammar("Superlative Adjectives", "The Adj-est / The Most Adj",
                                                                "So sánh nhất.", "This is the most beautiful city.",
                                                                "Grammar")),
                                List.of(createTurn(1, "A: What is your hometown like?", "A: Quê bạn thế nào?"),
                                                createTurn(2, "B: It is very ancient and beautiful.",
                                                                "B: Nó rất cổ kính và đẹp."),
                                                createTurn(3, "A: Is it crowded?", "A: Nó có đông đúc không?"),
                                                createTurn(4, "B: Not really, it's quite peaceful.",
                                                                "B: Không hẳn, nó khá yên bình.")));

                // U21: Hotel
                seedCompleteUnitLessons(u21, "u21", "Hotel Vocab", "Formal Reqs", "At the Reception",
                                List.of(createVocab("Reservation", "/ˌrez.əˈveɪ.ʃən/", "Đặt chỗ",
                                                "I have a reservation.", "Travel"),
                                                createVocab("Check-in", "/ˈtʃek.ɪn/", "Nhận phòng",
                                                                "What time is check-in?", "Travel"),
                                                createVocab("Accommodation", "/əˌkɒm.əˈdeɪ.ʃən/", "Chỗ ở",
                                                                "The price includes accommodation.", "Travel"),
                                                createVocab("Vacancy", "/ˈveɪ.kən.si/", "Phòng trống",
                                                                "Do you have any vacancies?", "Travel"),
                                                createVocab("Amenities", "/əˈmen.ə.tiz/", "Tiện nghi",
                                                                "The hotel has great amenities.", "Travel")),
                                List.of(createGrammar("Formal Requests", "I would like to + V",
                                                "Yêu cầu tại khách sạn.", "I would like to book a room.", "Formal")),
                                List.of(createTurn(1, "A: I'd like to check in.", "A: Tôi muốn nhận phòng."),
                                                createTurn(2, "B: Certainly. May I have your name, please?",
                                                                "B: Chắc chắn rồi. Cho tôi biết tên bạn được không?"),
                                                createTurn(3, "A: It's Nam Nguyen.", "A: Là Nam Nguyễn."),
                                                createTurn(4, "B: Here is your key card, room 302.",
                                                                "B: Đây là thẻ phòng của bạn, phòng 302.")));

                // U22: House
                seedCompleteUnitLessons(u22, "u22", "House Detail", "Prepositions+", "Room Tour",
                                List.of(createVocab("Kitchen", "/ˈkɪtʃ.ɪn/", "Nhà bếp", "She cooks in the kitchen.",
                                                "Room"),
                                                createVocab("Bedroom", "/ˈbed.ruːm/", "Phòng ngủ",
                                                                "I sleep in the bedroom.", "Room"),
                                                createVocab("Bathroom", "/ˈbɑːθ.ruːm/", "Phòng tắm",
                                                                "The bathroom is clean.", "Room"),
                                                createVocab("Living room", "/ˈlɪv.ɪŋ ruːm/", "Phòng khách",
                                                                "We watch TV here.", "Room"),
                                                createVocab("Backyard", "/ˌbækˈjɑːrd/", "Sân sau",
                                                                "My dogs play in the backyard.", "Area")),
                                List.of(createGrammar("Prepositions of Place (Review)", "in, on, at, under, behind",
                                                "Vị trí trong nhà.", "The cat is under the table.", "Spatial")),
                                List.of(createTurn(1, "A: Do you live in a house or a flat?",
                                                "A: Bạn sống ở nhà riêng hay căn hộ?"),
                                                createTurn(2, "B: I live in a small house.",
                                                                "B: Tôi sống trong một ngôi nhà nhỏ."),
                                                createTurn(3, "A: How many rooms are there?", "A: Có bao nhiêu phòng?"),
                                                createTurn(4, "B: There are 4 rooms.", "B: Có 4 phòng.")));
        }

        // Helper to seed full lessons + content
        private void seedCompleteUnitLessons(SyllabusUnit unit, String prefix, String t1, String t2, String t3,
                        List<LessonVocabulary> vocab, List<LessonGrammar> grammar, List<LessonConversation> conv,
                        List<LessonPracticeQuestion> practice) {

                SyllabusLesson l_vocab = createLesson(prefix + "_1", unit, 1, "Từ vựng: " + t1, "vocabulary", 10);
                SyllabusLesson l_gram = createLesson(prefix + "_2", unit, 2, "Ngữ pháp: " + t2, "grammar", 15);
                SyllabusLesson l_conv = createLesson(prefix + "_3", unit, 3, "Hội thoại: " + t3, "conversation", 15);
                SyllabusLesson l_prac = createLesson(prefix + "_4", unit, 4, "Luyện tập tình huống", "practice", 20);
                SyllabusLesson l_sum = createLesson(prefix + "_5", unit, 5, "Tổng kết", "summary", 5);

                lessonRepository.saveAll(List.of(l_vocab, l_gram, l_conv, l_prac, l_sum));

                seedLessonVocabulary(l_vocab, vocab);
                seedLessonGrammar(l_gram, grammar);
                seedLessonConversation(l_conv, conv);
                seedLessonPractice(l_prac, practice);
        }

        // Overload for cases where practice is not provided yet to avoid breaking code
        // while updating
        private void seedCompleteUnitLessons(SyllabusUnit unit, String prefix, String t1, String t2, String t3,
                        List<LessonVocabulary> vocab, List<LessonGrammar> grammar, List<LessonConversation> conv) {
                seedCompleteUnitLessons(unit, prefix, t1, t2, t3, vocab, grammar, conv, List.of());
        }

        private void seedLessonPractice(SyllabusLesson lesson, List<LessonPracticeQuestion> items) {
                for (LessonPracticeQuestion item : items) {
                        item.setLesson(lesson);
                }
                practiceRepository.saveAll(items);
        }

        private void seedCheckpointTests(SyllabusLevel level) {
                // Existing logic...
                CheckpointTest test = new CheckpointTest();
                test.setId("test_a1");
                test.setLevel(level);
                test.setTitle("Test A1");
                test.setDurationMinutes(20);
                test.setPassingScore(80);
                testRepository.save(test);
        }

        // --- Helpers ---

        private void seedLessonVocabulary(SyllabusLesson lesson, List<LessonVocabulary> items) {
                for (LessonVocabulary item : items) {
                        item.setLesson(lesson);
                }
                vocabRepository.saveAll(items);
        }

        private void seedLessonGrammar(SyllabusLesson lesson, List<LessonGrammar> items) {
                for (LessonGrammar item : items) {
                        item.setLesson(lesson);
                }
                grammarRepository.saveAll(items);
        }

        private void seedLessonConversation(SyllabusLesson lesson, List<LessonConversation> items) {
                for (LessonConversation item : items) {
                        item.setLesson(lesson);
                }
                conversationRepository.saveAll(items);
        }

        private SyllabusUnit createUnit(String id, SyllabusLevel level, int order, String title, String desc,
                        String topic, String img) {
                SyllabusUnit unit = new SyllabusUnit();
                unit.setId(id);
                unit.setLevel(level);
                unit.setOrder(order);
                unit.setTitle(title);
                unit.setDescription(desc);
                unit.setTopic(topic);
                unit.setImageUrl(img);
                return unit;
        }

        private SyllabusLesson createLesson(String id, SyllabusUnit unit, int order, String title, String type,
                        int duration) {
                SyllabusLesson lesson = new SyllabusLesson();
                lesson.setId(id);
                lesson.setUnit(unit);
                lesson.setOrder(order);
                lesson.setTitle(title);
                lesson.setType(type);
                lesson.setDurationMinutes(duration);
                return lesson;
        }

        private LessonVocabulary createVocab(String word, String phonetic, String meaning, String example,
                        String usage) {
                LessonVocabulary v = new LessonVocabulary();
                v.setWord(word);
                v.setPhonetic(phonetic);
                v.setMeaning(meaning);
                v.setExample(example);
                v.setUsageNote(usage);
                return v;
        }

        private LessonGrammar createGrammar(String name, String formula, String explanation, String example,
                        String note) {
                LessonGrammar g = new LessonGrammar();
                g.setName(name);
                g.setFormula(formula);
                g.setExplanation(explanation);
                g.setExample(example);
                g.setNote(note);
                return g;
        }

        private LessonConversation createTurn(int order, String en, String vi) {
                LessonConversation c = new LessonConversation();
                c.setOrder(order);
                c.setTextEn(en);
                c.setTextVi(vi);
                return c;
        }

        private LessonPracticeQuestion createPracticeMC(String id, String question, String correct,
                        List<String> options, String exp) {
                LessonPracticeQuestion q = new LessonPracticeQuestion();
                q.setType("multiple-choice");
                q.setQuestion(question);
                q.setCorrectAnswer(correct);
                q.setOptions(options);
                q.setExplanation(exp);
                return q;
        }

        private LessonPracticeQuestion createPracticeFillBlank(String id, String question, String correct,
                        List<String> options, String exp) {
                LessonPracticeQuestion q = new LessonPracticeQuestion();
                q.setType("fill-blank");
                q.setQuestion(question);
                q.setCorrectAnswer(correct);
                q.setOptions(options);
                q.setExplanation(exp);
                return q;
        }

        private LessonPracticeQuestion createPracticeMatching(String id, String question,
                        List<PracticeMatchingPair> pairs) {
                LessonPracticeQuestion q = new LessonPracticeQuestion();
                q.setType("matching");
                q.setQuestion(question);
                q.setPairs(pairs);
                return q;
        }

        private LessonPracticeQuestion createPracticeOrdering(String id, String question, List<String> segments,
                        List<String> correctOrder) {
                LessonPracticeQuestion q = new LessonPracticeQuestion();
                q.setType("ordering");
                q.setQuestion(question);
                q.setSegments(segments);
                q.setCorrectOrder(correctOrder);
                return q;
        }
}
