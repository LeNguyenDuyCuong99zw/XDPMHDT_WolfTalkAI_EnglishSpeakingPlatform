package com.wolftalk.backend.dto.learning;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnitDTO {
    private String id;
    private String levelId;
    private int order;
    private String title;
    private String description;
    private String topic;
    private String status; // locked, unlocked, completed
    private int totalLessons;
    private int completedLessons;
    private String imageUrl;
    private Integer score;
    private List<LessonDTO> lessons;
}
