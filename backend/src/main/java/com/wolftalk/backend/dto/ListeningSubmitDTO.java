package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListeningSubmitDTO {
    private Long challengeId;
    private String userAnswer;
    private Long timeTaken; // milliseconds
}
