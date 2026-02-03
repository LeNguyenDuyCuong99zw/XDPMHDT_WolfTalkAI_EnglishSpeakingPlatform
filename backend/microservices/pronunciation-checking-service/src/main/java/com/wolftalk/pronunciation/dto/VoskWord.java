package com.wolftalk.pronunciation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoskWord {
    
    private Double conf;  // Confidence score from Vosk
    private Double start; // Start time
    private Double end;   // End time
    private String word;  // Recognized word
}
