package com.wolftalk.microservices.ai.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
@Slf4j
public class GeminiService {
    
    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;
    private final Integer maxTokens;
    private final Double temperature;
    
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    
    public GeminiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.model}") String model,
            @Value("${gemini.max.tokens}") Integer maxTokens,
            @Value("${gemini.temperature}") Double temperature) {
        this.httpClient = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
        this.apiKey = apiKey;
        this.model = model;
        this.maxTokens = maxTokens;
        this.temperature = temperature;
    }
    
    @Cacheable(value = "geminiPronunciationSuggestions", key = "#transcript + #expectedText")
    public List<String> generatePronunciationSuggestions(String transcript, String expectedText) {
        String prompt = String.format(
                "As an English pronunciation coach, compare the student's speech transcript with the expected text. " +
                "Provide 3-5 specific, actionable pronunciation improvement suggestions.\n\n" +
                "Expected: %s\n" +
                "Student said: %s\n\n" +
                "Suggestions (one per line):",
                expectedText, transcript
        );
        
        String response = callGemini(prompt);
        return Arrays.asList(response.split("\n"));
    }
    
    @Cacheable(value = "geminiPronunciationFeedback", key = "#transcript + #expectedText + #score")
    public String generatePronunciationFeedback(String transcript, String expectedText, BigDecimal score) {
        String prompt = String.format(
                "As an encouraging English teacher, provide brief, positive feedback on the student's pronunciation attempt.\n\n" +
                "Expected: %s\n" +
                "Student said: %s\n" +
                "Score: %.2f/100\n\n" +
                "Feedback (2-3 sentences):",
                expectedText, transcript, score
        );
        
        return callGemini(prompt);
    }
    
    @Cacheable(value = "geminiGrammarCorrection", key = "#text")
    public String correctGrammar(String text) {
        String prompt = String.format(
                "Correct the following English text for grammar, spelling, and punctuation errors. " +
                "Return ONLY the corrected text without explanations.\n\n" +
                "Text: %s\n\n" +
                "Corrected:",
                text
        );
        
        return callGemini(prompt);
    }
    
    @Cacheable(value = "geminiGrammarExplanation", key = "#originalText + #correctedText")
    public List<String> explainGrammarErrors(String originalText, String correctedText) {
        String prompt = String.format(
                "Analyze the grammar errors between the original and corrected text. " +
                "For each specific error, provide a JSON object with this exact format:\n" +
                "{\"incorrectText\":\"the wrong word or phrase\",\"correctText\":\"the correct word or phrase\",\"explanation\":\"brief explanation\"}\n\n" +
                "IMPORTANT:\n" +
                "- Only include the specific WORD or SHORT PHRASE that is wrong (not the entire sentence)\n" +
                "- Extract the exact incorrect portion and its correction\n" +
                "- One JSON object per line\n" +
                "- Do not include any other text, markdown, or formatting\n\n" +
                "Original: %s\n" +
                "Corrected: %s\n\n" +
                "Errors (one JSON per line):",
                originalText, correctedText
        );
        
        String response = callGemini(prompt);
        return Arrays.asList(response.split("\n"));
    }
    
    @Cacheable(value = "geminiVocabularySuggestions", key = "#context + #level")
    public List<String> suggestVocabulary(String context, String level) {
        String prompt = String.format(
                "Suggest 5 useful English vocabulary words for a %s level student in the context of: %s\n\n" +
                "For each word, provide: word, definition, example sentence (format: word | definition | example)\n\n" +
                "Vocabulary:",
                level, context
        );
        
        String response = callGemini(prompt);
        return Arrays.asList(response.split("\n"));
    }
    
    @Cacheable(value = "geminiConversationResponse", key = "#userMessage + #context")
    public String generateConversationResponse(String userMessage, String context, String difficulty) {
        String prompt = String.format(
                "You are an AI English conversation partner. The student is at %s level. " +
                "Context: %s\n\n" +
                "Student: %s\n\n" +
                "Respond naturally and appropriately. Keep your response conversational and at the student's level.",
                difficulty, context, userMessage
        );
        
        return callGemini(prompt);
    }
    
    @Cacheable(value = "geminiConversationSuggestions", key = "#userMessage + #context")
    public List<String> generateConversationSuggestions(String userMessage, String context) {
        String prompt = String.format(
                "The student is in a conversation about: %s\n" +
                "They just said: %s\n\n" +
                "Suggest 3 alternative ways they could have expressed this idea more naturally or accurately. " +
                "One per line:",
                context, userMessage
        );
        
        String response = callGemini(prompt);
        return Arrays.asList(response.split("\n"));
    }
    
    public String generateDetailedFeedback(String studentText, String topic, BigDecimal score) {
        String prompt = String.format(
                "As an English teacher, provide detailed feedback on the student's performance.\n\n" +
                "Topic: %s\n" +
                "Student's text: %s\n" +
                "Score: %.2f/100\n\n" +
                "Provide feedback covering:\n" +
                "1. Strengths\n" +
                "2. Areas for improvement\n" +
                "3. Specific recommendations\n\n" +
                "Feedback:",
                topic, studentText, score
        );
        
        return callGemini(prompt);
    }
    
    /**
     * Generic method to get AI response for any prompt
     * Used for new features like Writing, Reading, Grammar Exercises
     */
    public String getGenericResponse(String prompt) {
        log.info("Getting generic Gemini response for prompt length: {}", prompt.length());
        return callGemini(prompt);
    }
    
    private String callGemini(String prompt) {
        try {
            // Build request body
            String requestBody = String.format(
                    "{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}]," +
                    "\"generationConfig\":{\"temperature\":%.1f,\"maxOutputTokens\":%d}}",
                    escapeJson(prompt), temperature, maxTokens
            );
            
            // Build request
            String url = GEMINI_API_URL + model + ":generateContent?key=" + apiKey;
            Request request = new Request.Builder()
                    .url(url)
                    .post(RequestBody.create(requestBody, JSON))
                    .build();
            
            // Execute request
            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    log.error("Gemini API error: {}", response.code());
                    return "Sorry, I couldn't generate a response at this time.";
                }
                
                String responseBody = response.body().string();
                JsonNode jsonResponse = objectMapper.readTree(responseBody);
                
                // Extract text from response
                JsonNode candidates = jsonResponse.get("candidates");
                if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                    JsonNode content = candidates.get(0).get("content");
                    if (content != null) {
                        JsonNode parts = content.get("parts");
                        if (parts != null && parts.isArray() && parts.size() > 0) {
                            String text = parts.get(0).get("text").asText();
                            log.debug("Gemini response: {}", text);
                            return text.trim();
                        }
                    }
                }
                
                return "Sorry, I couldn't generate a response at this time.";
            }
            
        } catch (IOException e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            return "Sorry, I couldn't generate a response at this time.";
        }
    }
    
    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
