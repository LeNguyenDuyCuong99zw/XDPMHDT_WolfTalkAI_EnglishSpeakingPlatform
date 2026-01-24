package com.wolftalk.backend.service;

import com.wolftalk.backend.dto.learning.LessonDTO;
import com.wolftalk.backend.dto.learning.LevelDTO;
import com.wolftalk.backend.dto.learning.UnitDTO;
import com.wolftalk.backend.dto.learning.TopicDTO;
import com.wolftalk.backend.dto.learning.ScenarioDetailDTO;
import com.wolftalk.backend.dto.learning.content.ConversationDTO;
import com.wolftalk.backend.dto.learning.content.GrammarDTO;
import com.wolftalk.backend.dto.learning.content.VocabularyDTO;
import com.wolftalk.backend.dto.learning.content.PracticeExerciseDTO;
import com.wolftalk.backend.dto.learning.content.PracticeQuestionDTO;
import com.wolftalk.backend.entity.*;
import com.wolftalk.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SyllabusService {

    private final SyllabusLevelRepository levelRepository;
    private final SyllabusUnitRepository unitRepository;
    private final UserUnitProgressRepository unitProgressRepository;
    private final UserLessonProgressRepository lessonProgressRepository;
    private final UserRepository userRepository;

    private final LessonVocabularyRepository vocabRepository;
    private final LessonGrammarRepository grammarRepository;
    private final LessonConversationRepository conversationRepository;
    private final LessonPracticeQuestionRepository practiceRepository;
    private final SyllabusLessonRepository lessonRepository;
    private final DashboardService dashboardService;

    @Transactional(readOnly = true)
    public List<LevelDTO> getLevels(String userEmail) {
        User user = userRepository.findByEmailIgnoreCase(userEmail).orElse(null);
        Long userId = user != null ? user.getId() : null;

        List<SyllabusLevel> levels = levelRepository.findAllByOrderByOrderAsc();

        return levels.stream().map(level -> {
            LevelDTO dto = new LevelDTO();
            dto.setId(level.getId());
            dto.setName(level.getName());
            dto.setGroup(level.getGroup());
            dto.setDescription(level.getDescription());
            dto.setColor(level.getColor());
            dto.setTotalUnits(level.getTotalUnits() != null ? level.getTotalUnits() : 0);

            int completedCount = 0;
            String status = "locked";

            if (userId != null) {
                List<SyllabusUnit> units = unitRepository.findByLevelIdOrderByOrderAsc(level.getId());
                for (SyllabusUnit u : units) {
                    Optional<UserUnitProgress> p = unitProgressRepository.findByUserIdAndUnitId(userId, u.getId());
                    if (p.isPresent() && "completed".equals(p.get().getStatus())) {
                        completedCount++;
                    }
                }
            }

            dto.setCompletedUnits(completedCount);

            if ("A1".equals(level.getId())) {
                status = "active";
            } else if (completedCount == dto.getTotalUnits() && dto.getTotalUnits() > 0) {
                status = "completed";
            }

            dto.setStatus(status);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UnitDTO> getUnitsByLevel(String userEmail, String levelId) {
        User user = userRepository.findByEmailIgnoreCase(userEmail).orElse(null);
        Long userId = user != null ? user.getId() : null;

        List<SyllabusUnit> units = unitRepository.findByLevelIdOrderByOrderAsc(levelId);

        return units.stream().map(unit -> {
            UnitDTO dto = new UnitDTO();
            dto.setId(unit.getId());
            dto.setLevelId(unit.getLevel().getId());
            dto.setOrder(unit.getOrder());
            dto.setTitle(unit.getTitle());
            dto.setDescription(unit.getDescription());
            dto.setTopic(unit.getTopic());
            dto.setImageUrl(unit.getImageUrl());

            dto.setStatus("locked");
            dto.setCompletedLessons(0);
            dto.setScore(0);

            if (userId != null) {
                Optional<UserUnitProgress> progress = unitProgressRepository.findByUserIdAndUnitId(userId,
                        unit.getId());
                if (progress.isPresent()) {
                    dto.setStatus(progress.get().getStatus());
                    dto.setScore(progress.get().getScore());
                } else {
                    if ("u1_greet".equals(unit.getId())) {
                        dto.setStatus("unlocked");
                    }
                }
            } else {
                if ("u1_greet".equals(unit.getId())) {
                    dto.setStatus("unlocked");
                }
            }

            List<SyllabusLesson> lessons = unit.getLessons();
            dto.setTotalLessons(lessons.size());

            List<LessonDTO> lessonDTOs = lessons.stream().map(lesson -> {
                LessonDTO lDto = new LessonDTO();
                lDto.setId(lesson.getId());
                lDto.setTitle(lesson.getTitle());
                lDto.setType(lesson.getType());
                lDto.setDurationMinutes(lesson.getDurationMinutes());
                lDto.setCompleted(false);

                if (userId != null) {
                    Optional<UserLessonProgress> lp = lessonProgressRepository.findByUserIdAndLessonId(userId,
                            lesson.getId());
                    if (lp.isPresent() && Boolean.TRUE.equals(lp.get().getIsCompleted())) {
                        lDto.setCompleted(true);
                    }
                }
                return lDto;
            }).collect(Collectors.toList());

            dto.setLessons(lessonDTOs);

            long completedLessonsCount = lessonDTOs.stream().filter(LessonDTO::isCompleted).count();
            dto.setCompletedLessons((int) completedLessonsCount);

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VocabularyDTO> getLessonVocabulary(String lessonId) {
        return vocabRepository.findByLessonId(lessonId).stream()
                .map(v -> new VocabularyDTO(v.getId(), v.getWord(), v.getPhonetic(), v.getMeaning(), v.getExample(),
                        v.getUsageNote()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GrammarDTO> getLessonGrammar(String lessonId) {
        return grammarRepository.findByLessonId(lessonId).stream()
                .map(g -> new GrammarDTO(g.getId(), g.getName(), g.getFormula(), g.getExplanation(), g.getExample(),
                        g.getNote()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConversationDTO> getLessonConversation(String lessonId) {
        return conversationRepository.findByLessonIdOrderByOrderAsc(lessonId).stream()
                .map(c -> new ConversationDTO(c.getId(), c.getOrder(), c.getTextEn(), c.getTextVi()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PracticeExerciseDTO getLessonPractice(String lessonId, String scenarioId) {
        List<PracticeQuestionDTO> questions = practiceRepository.findByLessonId(lessonId).stream()
                .map(q -> {
                    List<PracticeQuestionDTO.MatchingPairDTO> pairs = q.getPairs() != null ? q.getPairs().stream()
                            .map(p -> new PracticeQuestionDTO.MatchingPairDTO(p.getId().toString(), p.getLeft(),
                                    p.getRight()))
                            .collect(Collectors.toList()) : List.of();

                    return new PracticeQuestionDTO(q.getId().toString(), q.getType(), q.getQuestion(),
                            q.getExplanation(), q.getCorrectAnswer(), q.getOptions(), q.getSegments(),
                            q.getCorrectOrder(), pairs, q.getImageUrl(), q.getAudioUrl());
                })
                .collect(Collectors.toList());

        return new PracticeExerciseDTO(scenarioId, questions);
    }

    @Transactional
    public void unlockUnit(String userEmail, String unitId) {
        User user = userRepository.findByEmailIgnoreCase(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        UserUnitProgress progress = unitProgressRepository.findByUserIdAndUnitId(user.getId(), unitId)
                .orElse(new UserUnitProgress(null, user.getId(), unitId, "locked", 0, null));

        progress.setStatus("unlocked");
        unitProgressRepository.save(progress);
    }

    @Transactional
    public void completeUnit(String userEmail, String unitId, int score) {
        User user = userRepository.findByEmailIgnoreCase(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        UserUnitProgress progress = unitProgressRepository.findByUserIdAndUnitId(user.getId(), unitId)
                .orElse(new UserUnitProgress(null, user.getId(), unitId, "unlocked", 0, null));

        progress.setStatus("completed");
        if (score > (progress.getScore() != null ? progress.getScore() : 0)) {
            progress.setScore(score);
        }
        progress.setCompletedAt(Instant.now());
        unitProgressRepository.save(progress);

        // Update streak/activity
        dashboardService.markActivity(userEmail);

        // Mark all lessons in this unit as completed
        List<SyllabusLesson> lessons = lessonRepository.findByUnitIdOrderByOrderAsc(unitId);
        System.out
                .println("Completing unit " + unitId + " for " + userEmail + ". Found " + lessons.size() + " lessons.");

        for (SyllabusLesson lesson : lessons) {
            UserLessonProgress lp = lessonProgressRepository.findByUserIdAndLessonId(user.getId(), lesson.getId())
                    .orElse(new UserLessonProgress(null, user.getId(), lesson.getId(), false, null));
            if (!Boolean.TRUE.equals(lp.getIsCompleted())) {
                lp.setIsCompleted(true);
                lp.setCompletedAt(Instant.now());
                UserLessonProgress saved = lessonProgressRepository.save(lp);
                user.setPoints((user.getPoints() != null ? user.getPoints() : 0) + 5);
                System.out.println("DEBUG SyllabusService: Saved progress lesson=" + lesson.getId() + ", ID="
                        + saved.getId() + ", completed=" + saved.getIsCompleted());
            } else {
                System.out.println("DEBUG SyllabusService: Lesson " + lesson.getId() + " already completed.");
            }
        }
        userRepository.save(user);

        // Unlock next unit
        SyllabusUnit currentUnit = unitRepository.findById(unitId).orElse(null);
        if (currentUnit != null) {
            List<SyllabusUnit> levelUnits = unitRepository.findByLevelIdOrderByOrderAsc(currentUnit.getLevel().getId());
            for (int i = 0; i < levelUnits.size() - 1; i++) {
                if (levelUnits.get(i).getId().equals(unitId)) {
                    SyllabusUnit next = levelUnits.get(i + 1);
                    unlockUnit(userEmail, next.getId());
                    break;
                }
            }
        }
    }

    @Transactional
    public void completeLesson(String userEmail, String lessonId) {
        User user = userRepository.findByEmailIgnoreCase(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        UserLessonProgress progress = lessonProgressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
                .orElse(new UserLessonProgress(null, user.getId(), lessonId, false, null));

        if (!Boolean.TRUE.equals(progress.getIsCompleted())) {
            progress.setIsCompleted(true);
            progress.setCompletedAt(Instant.now());
            lessonProgressRepository.save(progress);

            // Update streak/activity
            dashboardService.markActivity(userEmail);

            user.setPoints((user.getPoints() != null ? user.getPoints() : 0) + 10);
            userRepository.save(user);
        }
    }

    @Transactional(readOnly = true)
    public List<TopicDTO> getTopicGroups() {
        List<SyllabusUnit> allUnits = unitRepository.findAll();
        Map<String, List<SyllabusUnit>> groupedByTopic = allUnits.stream()
                .filter(u -> u.getTopic() != null)
                .collect(Collectors.groupingBy(SyllabusUnit::getTopic));

        return groupedByTopic.entrySet().stream().map(entry -> {
            String topicName = entry.getKey();
            List<SyllabusUnit> unitsInTopic = entry.getValue();

            TopicDTO dto = new TopicDTO();
            dto.setId("topic_" + topicName.toLowerCase().replace(" ", "_"));
            dto.setGroup(topicName);
            dto.setMinLevel(unitsInTopic.stream()
                    .map(u -> u.getLevel().getId())
                    .min(String::compareTo).orElse("A1"));
            dto.setTopics(unitsInTopic.stream().map(SyllabusUnit::getTitle).collect(Collectors.toList()));
            dto.setExamples(List.of());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getScenariosByTopic(String topicName) {
        return unitRepository.findAll().stream()
                .filter(u -> topicName.equalsIgnoreCase(u.getTopic()))
                .map(SyllabusUnit::getTitle)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScenarioDetailDTO getScenarioDetail(String unitIdOrTitle) {
        SyllabusUnit unit = unitRepository.findById(unitIdOrTitle)
                .orElseGet(() -> unitRepository.findAll().stream()
                        .filter(u -> u.getTitle().equalsIgnoreCase(unitIdOrTitle))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Scenario not found: " + unitIdOrTitle)));

        ScenarioDetailDTO dto = new ScenarioDetailDTO();
        dto.setScenarioName(unit.getTitle());

        List<VocabularyDTO> vocabList = List.of();
        List<GrammarDTO> grammarList = List.of();
        List<ConversationDTO> conversationList = List.of();
        PracticeExerciseDTO practice = null;

        for (SyllabusLesson lesson : unit.getLessons()) {
            if ("vocabulary".equals(lesson.getType())) {
                vocabList = getLessonVocabulary(lesson.getId());
            } else if ("grammar".equals(lesson.getType())) {
                grammarList = getLessonGrammar(lesson.getId());
            } else if ("conversation".equals(lesson.getType())) {
                conversationList = getLessonConversation(lesson.getId());
            } else if ("practice".equals(lesson.getType())) {
                practice = getLessonPractice(lesson.getId(), unit.getTitle());
            }
        }

        dto.setVocabulary(vocabList);
        dto.setGrammar(grammarList);
        dto.setConversation(conversationList);
        dto.setPractice(practice);

        return dto;
    }
}
