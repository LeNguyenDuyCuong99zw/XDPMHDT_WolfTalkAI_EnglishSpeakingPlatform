package com.wolftalk.assessment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignAssessmentRequest {
    private Long assessmentId;
    private List<Long> learnerIds;
    private String dueDate; // ISO format: 2024-01-10T23:59:59
}
