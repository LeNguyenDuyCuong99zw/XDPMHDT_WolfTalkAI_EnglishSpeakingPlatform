package com.wolftalk.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListeningTaskDTO {
    private Long id;
    private String title;
    private String description;
    private Integer targetPoints;
    private Integer rewardPoints;
    private String rewardDescription;
    private Boolean completed;
    private LocalDate dueDate;
    private String taskType;
}
