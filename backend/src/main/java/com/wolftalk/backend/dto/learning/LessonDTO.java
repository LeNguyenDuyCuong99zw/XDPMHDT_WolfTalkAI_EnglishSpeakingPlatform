package com.wolftalk.backend.dto.learning;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private String id;
    private String title;
    private String type;
    private int durationMinutes;
    private boolean isCompleted;
}
