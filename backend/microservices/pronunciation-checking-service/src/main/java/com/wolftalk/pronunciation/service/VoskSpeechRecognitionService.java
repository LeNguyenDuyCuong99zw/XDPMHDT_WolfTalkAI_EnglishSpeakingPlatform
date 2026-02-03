package com.wolftalk.pronunciation.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wolftalk.pronunciation.dto.VoskWord;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.vosk.Model;
import org.vosk.Recognizer;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class VoskSpeechRecognitionService {

    private Model model;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String MODEL_PATH = "models/vosk-model-small-en-us-0.15";

    @PostConstruct
    public void init() {
        try {
            // Check if running in container (path mapped to /app/models) or local
            String modelPath = System.getenv("VOSK_MODEL_PATH");
            if (modelPath == null) {
                modelPath = MODEL_PATH;
            }
            
            log.info("Loading Vosk model from: {}", modelPath);
            model = new Model(modelPath);
            log.info("Vosk model loaded successfully");
        } catch (Exception e) {
            log.error("Failed to load Vosk model: " + e.getMessage());
            // We don't throw exception here to allow service to start, 
            // but recognition will fail if called
        }
    }

    public TranscriptionResult transcribeAudio(byte[] audioData) throws IOException {
        if (model == null) {
            throw new IOException("Vosk model is not loaded");
        }

        try (Recognizer recognizer = new Recognizer(model, 16000)) {
            recognizer.setWords(true);
            recognizer.acceptWaveForm(audioData, audioData.length);
            String rankResult = recognizer.getFinalResult();
            
            return parseResult(rankResult);
        }
    }

    private TranscriptionResult parseResult(String jsonResult) throws IOException {
        try {
            Map result = objectMapper.readValue(jsonResult, Map.class);
            String text = (String) result.get("text");
            
            List<VoskWord> words = new ArrayList<>();
            if (result.containsKey("result")) {
                List<Map<String, Object>> resultWords = (List<Map<String, Object>>) result.get("result");
                for (Map<String, Object> w : resultWords) {
                    VoskWord word = new VoskWord();
                    word.setWord((String) w.get("word"));
                    word.setConf(((Number) w.get("conf")).doubleValue());
                    word.setStart(((Number) w.get("start")).doubleValue());
                    word.setEnd(((Number) w.get("end")).doubleValue());
                    words.add(word);
                }
            }
            
            return new TranscriptionResult(text, words);
        } catch (Exception e) {
            log.error("Error parsing Vosk result", e);
            return new TranscriptionResult("", new ArrayList<>());
        }
    }

    @Data
    public static class TranscriptionResult {
        private final String transcript;
        private final List<VoskWord> words;
        
        public TranscriptionResult(String transcript, List<VoskWord> words) {
            this.transcript = transcript;
            this.words = words;
        }
    }
}
