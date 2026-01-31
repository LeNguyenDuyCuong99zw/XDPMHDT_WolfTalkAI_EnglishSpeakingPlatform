package com.wolftalk.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.util.List;
import java.time.Instant;

@Data
@AllArgsConstructor
public class TestResultDTO {
    private String testId;
    private int score;
    private boolean isPassed;
    private Instant completedAt;
    private List<String> weakSkills;
}
