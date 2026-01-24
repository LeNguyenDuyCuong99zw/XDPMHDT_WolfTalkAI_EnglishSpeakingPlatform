package com.wolftalk.backend.service;

import com.wolftalk.backend.dto.learning.content.CheckpointQuestionDTO;
import com.wolftalk.backend.dto.learning.content.CheckpointTestDTO;
import com.wolftalk.backend.entity.CheckpointTest;
import com.wolftalk.backend.repository.CheckpointTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckpointService {

    private final CheckpointTestRepository testRepository;

    @Transactional(readOnly = true)
    public CheckpointTestDTO getTestForLevel(String levelId) {
        return testRepository.findByLevelId(levelId).map(test -> new CheckpointTestDTO(
                test.getId(),
                test.getLevel().getId(),
                test.getTitle(),
                test.getDescription(),
                test.getDurationMinutes(),
                test.getPassingScore(),
                test.getQuestions().stream().map(q -> new CheckpointQuestionDTO(
                        q.getId(),
                        q.getText(),
                        q.getType(),
                        q.getAudioUrl(),
                        q.getOptions(),
                        q.getCorrectOption())).collect(Collectors.toList())))
                .orElse(null);
    }

    @Transactional
    public com.wolftalk.backend.dto.TestResultDTO submitTest(String email,
            com.wolftalk.backend.dto.TestSubmissionDTO submission) {
        CheckpointTest test = testRepository.findById(submission.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found"));

        int correctCount = 0;
        int totalQuestions = test.getQuestions() != null ? test.getQuestions().size() : 0;

        if (totalQuestions == 0)
            return new com.wolftalk.backend.dto.TestResultDTO(test.getId(), 0, false, java.time.Instant.now(),
                    java.util.Collections.emptyList());

        for (com.wolftalk.backend.entity.CheckpointQuestion q : test.getQuestions()) {
            Integer userAns = submission.getAnswers().stream()
                    .filter(a -> a.getQuestionId().equals(q.getId()))
                    .findFirst()
                    .map(com.wolftalk.backend.dto.TestSubmissionDTO.AnswerDTO::getSelectedOption)
                    .orElse(null);

            // Assuming getCorrectOption returns 0-based index or matching integer
            if (userAns != null && userAns.equals(q.getCorrectOption())) {
                correctCount++;
            }
        }

        int score = (int) (((double) correctCount / totalQuestions) * 100);
        boolean passed = score >= test.getPassingScore();

        return new com.wolftalk.backend.dto.TestResultDTO(test.getId(), score, passed, java.time.Instant.now(),
                java.util.Collections.emptyList());
    }
}
