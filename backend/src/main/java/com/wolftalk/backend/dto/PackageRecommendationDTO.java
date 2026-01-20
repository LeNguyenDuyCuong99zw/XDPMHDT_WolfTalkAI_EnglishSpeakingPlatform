package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PackageRecommendationDTO {
    private Long packageId;
    private String packageName;
    private String packageCode;
    private String description;
    private String price;
    private Boolean hasMentor;
    private Integer mentorHoursPerMonth;
    private String recommendationReason;
    private Integer compatibilityScore; // 0-100, mức độ phù hợp
}
