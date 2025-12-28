package com.wolftalk.backend.service;

import com.wolftalk.backend.entity.SpeakingResult;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class SpeakingService {

    public SpeakingResult generateMockResult(Long sessionId) {
        Random r = new Random();

        SpeakingResult result = new SpeakingResult();
        result.setSessionId(sessionId);
        result.setPronunciationScore(70 + r.nextInt(10));
        result.setGrammarScore(70 + r.nextInt(10));
        result.setVocabularyScore(70 + r.nextInt(10));
        result.setFluencyScore(70 + r.nextInt(10));

        int overall =
                (result.getPronunciationScore()
              + result.getGrammarScore()
              + result.getVocabularyScore()
              + result.getFluencyScore()) / 4;

        result.setOverallScore(overall);
        result.setFeedback("Good fluency. Improve pronunciation stress.");

        return result;
    }
}
