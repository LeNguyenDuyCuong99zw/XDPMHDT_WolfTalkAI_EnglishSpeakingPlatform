package com.wolftalk.microservices.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WritingAnalysisRequest {
    private String text;
    private String type; // essay, email, article
    private String topic;
}
