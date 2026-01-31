package com.wolftalk.backend.dto.learning;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LevelDTO {
    private String id;
    private String name;
    private String group;
    private String description;
    private int totalUnits;
    private int completedUnits;
    private String status; // locked, active, completed
    private String color;
}
