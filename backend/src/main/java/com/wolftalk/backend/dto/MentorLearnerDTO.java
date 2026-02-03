package com.wolftalk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * DTO cho thông tin learner được gán cho mentor
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentorLearnerDTO {
    private Long id;
    private String fullName;
    private String email;
    private String avatar;
    
    // Subscription info
    private SubscriptionInfo subscription;
    
    // Learning stats
    private Integer assignedTests;
    private Integer completedTests;
    private Date lastActivity;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubscriptionInfo {
        private Long id;
        private String packageName;
        private String packageCode;
        private Date startDate;
        private Date endDate;
        private Integer mentorHoursTotal;
        private Integer mentorHoursUsed;
        private String status;
    }
}
