package com.wolftalk.assessment.config;

import com.wolftalk.assessment.entity.Assessment;
import com.wolftalk.assessment.entity.AssessmentOption;
import com.wolftalk.assessment.entity.AssessmentQuestion;
import com.wolftalk.assessment.repository.AssessmentOptionRepository;
import com.wolftalk.assessment.repository.AssessmentQuestionRepository;
import com.wolftalk.assessment.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final AssessmentOptionRepository optionRepository;

    @Override
    public void run(String... args) {
        if (assessmentRepository.count() == 0) {
            log.info("Seeding initial assessment data...");
            seedDefaultAssessment();
            log.info("Data seeding completed!");
        }
    }

    private void seedDefaultAssessment() {
        // Tạo bài kiểm tra mặc định
        Assessment assessment = new Assessment();
        assessment.setTitle("Bài Kiểm Tra Đánh Giá Trình Độ Tiếng Anh");
        assessment.setDescription("Bài kiểm tra tổng hợp gồm 4 phần: Trắc nghiệm, Đọc hiểu, Nói và Viết");
        assessment.setLevel("INTERMEDIATE");
        assessment.setDurationMinutes(60);
        assessment.setPassingScore(60);
        assessment.setIsActive(true);
        assessment = assessmentRepository.save(assessment);

        Long assessmentId = assessment.getId();

        // PHẦN 1: 20 CÂU TRẮC NGHIỆM (Grammar & Vocabulary)
        createMultipleChoiceQuestions(assessmentId);

        // PHẦN 2: 10 CÂU ĐỌC HIỂU
        createReadingQuestions(assessmentId);

        // PHẦN 3: BÀI NÓI
        createSpeakingQuestion(assessmentId);

        // PHẦN 4: BÀI VIẾT
        createWritingQuestion(assessmentId);
    }

    private void createMultipleChoiceQuestions(Long assessmentId) {
        List<QuestionData> questions = new ArrayList<>();

        // Grammar Questions (10 câu)
        questions.add(new QuestionData(
            "She _____ to the gym every morning.",
            new String[]{"go", "goes", "going", "gone"},
            1 // Index của đáp án đúng (goes)
        ));

        questions.add(new QuestionData(
            "I _____ my homework when you called me yesterday.",
            new String[]{"do", "did", "was doing", "have done"},
            2
        ));

        questions.add(new QuestionData(
            "If I _____ rich, I would travel around the world.",
            new String[]{"am", "was", "were", "be"},
            2
        ));

        questions.add(new QuestionData(
            "This is the _____ movie I have ever seen.",
            new String[]{"good", "better", "best", "well"},
            2
        ));

        questions.add(new QuestionData(
            "The book _____ by millions of people worldwide.",
            new String[]{"reads", "is read", "was read", "has been read"},
            3
        ));

        questions.add(new QuestionData(
            "She asked me _____ I could help her with the project.",
            new String[]{"that", "if", "what", "which"},
            1
        ));

        questions.add(new QuestionData(
            "I wish I _____ speak French fluently.",
            new String[]{"can", "could", "will", "would"},
            1
        ));

        questions.add(new QuestionData(
            "By the time you arrive, I _____ dinner.",
            new String[]{"finish", "will finish", "will have finished", "finished"},
            2
        ));

        questions.add(new QuestionData(
            "The children _____ in the garden since morning.",
            new String[]{"play", "are playing", "have been playing", "played"},
            2
        ));

        questions.add(new QuestionData(
            "Neither John nor his friends _____ coming to the party.",
            new String[]{"is", "are", "was", "were"},
            1
        ));

        // Vocabulary Questions (10 câu)
        questions.add(new QuestionData(
            "The company decided to _____ the new product next month.",
            new String[]{"launch", "lunch", "lounge", "lunge"},
            0
        ));

        questions.add(new QuestionData(
            "His explanation was so _____ that nobody understood it.",
            new String[]{"clear", "vague", "obvious", "simple"},
            1
        ));

        questions.add(new QuestionData(
            "She has a _____ for learning new languages quickly.",
            new String[]{"talent", "skill", "ability", "capacity"},
            0
        ));

        questions.add(new QuestionData(
            "The weather forecast _____ rain for tomorrow.",
            new String[]{"predicts", "prevents", "protects", "provides"},
            0
        ));

        questions.add(new QuestionData(
            "He was _____ of stealing the money, but he was innocent.",
            new String[]{"accused", "blamed", "charged", "convicted"},
            0
        ));

        questions.add(new QuestionData(
            "The meeting has been _____ until next week.",
            new String[]{"delayed", "postponed", "cancelled", "advanced"},
            1
        ));

        questions.add(new QuestionData(
            "She gave a very _____ speech that moved everyone.",
            new String[]{"boring", "touching", "confusing", "annoying"},
            1
        ));

        questions.add(new QuestionData(
            "The doctor _____ him to quit smoking immediately.",
            new String[]{"advised", "suggested", "recommended", "proposed"},
            0
        ));

        questions.add(new QuestionData(
            "The company is looking for someone with _____ in marketing.",
            new String[]{"experience", "experiment", "expert", "expertise"},
            3
        ));

        questions.add(new QuestionData(
            "The new policy will _____ all employees starting next month.",
            new String[]{"effect", "affect", "infect", "defect"},
            1
        ));

        // Lưu câu hỏi vào database
        for (int i = 0; i < questions.size(); i++) {
            QuestionData qData = questions.get(i);
            AssessmentQuestion question = new AssessmentQuestion();
            question.setAssessmentId(assessmentId);
            question.setSection("MULTIPLE_CHOICE");
            question.setQuestionType("SINGLE_CHOICE");
            question.setQuestionText(qData.question);
            question.setOrderIndex(i + 1);
            question.setPoints(1);
            question = questionRepository.save(question);

            // Tạo các đáp án
            for (int j = 0; j < qData.options.length; j++) {
                AssessmentOption option = new AssessmentOption();
                option.setQuestionId(question.getId());
                option.setOptionText(qData.options[j]);
                option.setIsCorrect(j == qData.correctIndex);
                option.setOrderIndex(j);
                optionRepository.save(option);
            }
        }
    }

    private void createReadingQuestions(Long assessmentId) {
        // Đoạn văn 1
        String passage1 = "Climate change is one of the most pressing issues facing humanity today. " +
                "Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become more extreme. " +
                "Scientists agree that human activities, particularly the burning of fossil fuels, are the primary cause of this phenomenon. " +
                "To address this crisis, countries around the world must work together to reduce carbon emissions and transition to renewable energy sources. " +
                "Individual actions, such as reducing energy consumption and using public transportation, can also make a significant difference.";

        List<QuestionData> reading1 = new ArrayList<>();
        reading1.add(new QuestionData(
            "What is the main topic of the passage?",
            new String[]{"Renewable energy", "Climate change", "Public transportation", "Ice caps"},
            1
        ));

        reading1.add(new QuestionData(
            "According to the passage, what is the primary cause of climate change?",
            new String[]{"Natural disasters", "Human activities", "Ice melting", "Sea level rise"},
            1
        ));

        reading1.add(new QuestionData(
            "What solution does the passage suggest?",
            new String[]{"Building more factories", "Burning more fossil fuels", "Transitioning to renewable energy", "Increasing carbon emissions"},
            2
        ));

        reading1.add(new QuestionData(
            "What can individuals do to help according to the passage?",
            new String[]{"Buy more cars", "Reduce energy consumption", "Ignore the problem", "Move to colder areas"},
            1
        ));

        reading1.add(new QuestionData(
            "The word 'pressing' in the passage is closest in meaning to:",
            new String[]{"Urgent", "Heavy", "Pushing", "Difficult"},
            0
        ));

        // Đoạn văn 2
        String passage2 = "The invention of the internet has revolutionized the way we communicate, work, and access information. " +
                "What began as a military project in the 1960s has evolved into a global network connecting billions of people. " +
                "Today, the internet plays a crucial role in education, business, entertainment, and social interaction. " +
                "However, this technological advancement also brings challenges, including privacy concerns, cybersecurity threats, and the spread of misinformation. " +
                "As we continue to rely more heavily on digital technology, it is essential to address these issues to ensure a safe and beneficial online environment for everyone.";

        List<QuestionData> reading2 = new ArrayList<>();
        reading2.add(new QuestionData(
            "When did the internet project begin?",
            new String[]{"1950s", "1960s", "1970s", "1980s"},
            1
        ));

        reading2.add(new QuestionData(
            "What was the internet originally created for?",
            new String[]{"Education", "Business", "Military purposes", "Entertainment"},
            2
        ));

        reading2.add(new QuestionData(
            "Which of the following is NOT mentioned as a challenge of the internet?",
            new String[]{"Privacy concerns", "Cybersecurity threats", "High costs", "Misinformation"},
            2
        ));

        reading2.add(new QuestionData(
            "According to the passage, what is essential for the future of the internet?",
            new String[]{"More users", "Faster speeds", "Addressing safety issues", "More social media"},
            2
        ));

        reading2.add(new QuestionData(
            "The word 'revolutionized' in the passage means:",
            new String[]{"Destroyed", "Completely changed", "Slightly improved", "Complicated"},
            1
        ));

        // Lưu câu hỏi đọc hiểu vào database
        int orderIndex = 21; // Bắt đầu sau 20 câu trắc nghiệm

        for (QuestionData qData : reading1) {
            AssessmentQuestion question = new AssessmentQuestion();
            question.setAssessmentId(assessmentId);
            question.setSection("READING");
            question.setQuestionType("SINGLE_CHOICE");
            question.setQuestionText(qData.question);
            question.setReadingPassage(passage1);
            question.setOrderIndex(orderIndex++);
            question.setPoints(2);
            question = questionRepository.save(question);

            for (int j = 0; j < qData.options.length; j++) {
                AssessmentOption option = new AssessmentOption();
                option.setQuestionId(question.getId());
                option.setOptionText(qData.options[j]);
                option.setIsCorrect(j == qData.correctIndex);
                option.setOrderIndex(j);
                optionRepository.save(option);
            }
        }

        for (QuestionData qData : reading2) {
            AssessmentQuestion question = new AssessmentQuestion();
            question.setAssessmentId(assessmentId);
            question.setSection("READING");
            question.setQuestionType("SINGLE_CHOICE");
            question.setQuestionText(qData.question);
            question.setReadingPassage(passage2);
            question.setOrderIndex(orderIndex++);
            question.setPoints(2);
            question = questionRepository.save(question);

            for (int j = 0; j < qData.options.length; j++) {
                AssessmentOption option = new AssessmentOption();
                option.setQuestionId(question.getId());
                option.setOptionText(qData.options[j]);
                option.setIsCorrect(j == qData.correctIndex);
                option.setOrderIndex(j);
                optionRepository.save(option);
            }
        }
    }

    private void createSpeakingQuestion(Long assessmentId) {
        AssessmentQuestion question = new AssessmentQuestion();
        question.setAssessmentId(assessmentId);
        question.setSection("SPEAKING");
        question.setQuestionType("VIDEO");
        question.setQuestionText("Record a 2-minute video introducing yourself and talking about your English learning goals. " +
                "Include: your name, where you're from, why you're learning English, and what you hope to achieve.");
        question.setOrderIndex(31);
        question.setPoints(10);
        questionRepository.save(question);
    }

    private void createWritingQuestion(Long assessmentId) {
        AssessmentQuestion question = new AssessmentQuestion();
        question.setAssessmentId(assessmentId);
        question.setSection("WRITING");
        question.setQuestionType("ESSAY");
        question.setQuestionText("Write an essay (250-300 words) on the following topic: " +
                "'The advantages and disadvantages of social media in modern society.' " +
                "Support your arguments with specific examples and organize your ideas clearly.");
        question.setOrderIndex(32);
        question.setPoints(15);
        questionRepository.save(question);
    }

    // Helper class để lưu dữ liệu câu hỏi
    private static class QuestionData {
        String question;
        String[] options;
        int correctIndex;

        QuestionData(String question, String[] options, int correctIndex) {
            this.question = question;
            this.options = options;
            this.correctIndex = correctIndex;
        }
    }
}
