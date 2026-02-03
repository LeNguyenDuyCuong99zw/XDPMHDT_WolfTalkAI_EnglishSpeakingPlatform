package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerAssessmentDTO {
    private Long assignmentId;
    private Long assessmentId;
    private String title;
    private String description;
    private String level;
    private Integer durationMinutes;
    private Integer totalQuestions;
    private String status; // ASSIGNED, IN_PROGRESS, SUBMITTED, GRADED
    private String assignedAt;
    private String dueDate;
    private Long attemptId; // ID của bài làm nếu đã bắt đầu
}
