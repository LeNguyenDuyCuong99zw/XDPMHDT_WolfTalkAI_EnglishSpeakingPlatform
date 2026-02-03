package com.wolftalk.backend.service;

import com.wolftalk.backend.dto.MentorLearnerDTO;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.entity.UserSubscription;
import com.wolftalk.backend.entity.LearningPackage;
import com.wolftalk.backend.repository.UserRepository;
import com.wolftalk.backend.repository.UserSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MentorService {

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy danh sách learners đã đăng ký gói có mentor (Professional/Premium)
     * @param packageFilter - "PROFESSIONAL", "PREMIUM", hoặc "ALL"
     * @return List<MentorLearnerDTO>
     */
    public List<MentorLearnerDTO> getMentorLearners(String packageFilter) {
        // Lấy tất cả subscription đang ACTIVE
        List<UserSubscription> activeSubscriptions = subscriptionRepository
                .findByStatus(UserSubscription.SubscriptionStatus.ACTIVE);

        // Lọc theo gói có mentor
        List<UserSubscription> mentorSubscriptions = activeSubscriptions.stream()
                .filter(sub -> {
                    LearningPackage pkg = sub.getLearningPackage();
                    boolean hasMentor = pkg.getHasMentor();
                    
                    // Nếu filter là ALL, lấy tất cả gói (kể cả không có mentor) để hiển thị đầy đủ danh sách đăng ký
                    if ("ALL".equalsIgnoreCase(packageFilter)) {
                        return true;
                    }
                    
                    // Nếu filter cụ thể, kiểm tra package code
                    String packageCode = pkg.getPackageCode().toUpperCase();
                    return hasMentor && packageCode.contains(packageFilter.toUpperCase());
                })
                .collect(Collectors.toList());

        // Convert sang DTO
        return mentorSubscriptions.stream()
                .map(this::convertToMentorLearnerDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thống kê tổng quan cho mentor
     */
    public MentorStatsDTO getMentorStats() {
        List<UserSubscription> activeSubscriptions = subscriptionRepository
                .findByStatus(UserSubscription.SubscriptionStatus.ACTIVE);

        long totalLearners = activeSubscriptions.stream()
                .filter(sub -> sub.getLearningPackage().getHasMentor())
                .count();

        long professionalCount = activeSubscriptions.stream()
                .filter(sub -> sub.getLearningPackage().getPackageCode().toUpperCase().contains("PROFESSIONAL"))
                .count();

        long premiumCount = activeSubscriptions.stream()
                .filter(sub -> sub.getLearningPackage().getPackageCode().toUpperCase().contains("PREMIUM"))
                .count();

        return new MentorStatsDTO(totalLearners, professionalCount, premiumCount);
    }

    /**
     * Convert UserSubscription sang MentorLearnerDTO
     */
    private MentorLearnerDTO convertToMentorLearnerDTO(UserSubscription subscription) {
        User user = subscription.getUser();
        LearningPackage pkg = subscription.getLearningPackage();

        MentorLearnerDTO dto = new MentorLearnerDTO();
        dto.setId(user.getId());
        
        // Tạo full name từ firstName và lastName
        String fullName = (user.getFirstName() != null ? user.getFirstName() : "") + 
                         " " + 
                         (user.getLastName() != null ? user.getLastName() : "");
        dto.setFullName(fullName.trim().isEmpty() ? user.getEmail() : fullName.trim());
        
        dto.setEmail(user.getEmail());
        dto.setAvatar(user.getAvatar());
        
        // Subscription info
        MentorLearnerDTO.SubscriptionInfo subInfo = new MentorLearnerDTO.SubscriptionInfo();
        subInfo.setId(subscription.getId());
        subInfo.setPackageName(pkg.getPackageName());
        subInfo.setPackageCode(pkg.getPackageCode());
        subInfo.setStartDate(subscription.getStartDate());
        subInfo.setEndDate(subscription.getEndDate());
        subInfo.setMentorHoursTotal(pkg.getMentorHoursPerMonth());
        subInfo.setMentorHoursUsed(subscription.getMentorHoursUsed());
        subInfo.setStatus(subscription.getStatus().toString());
        
        dto.setSubscription(subInfo);
        
        // Learning stats (placeholder - sẽ cần query từ database thực tế)
        dto.setAssignedTests(0);
        dto.setCompletedTests(0);
        dto.setLastActivity(user.getLastActiveDate() != null ? 
                           java.util.Date.from(user.getLastActiveDate()) : null);
        
        return dto;
    }

    /**
     * DTO cho thống kê mentor
     */
    public static class MentorStatsDTO {
        private long totalLearners;
        private long professionalCount;
        private long premiumCount;

        public MentorStatsDTO(long totalLearners, long professionalCount, long premiumCount) {
            this.totalLearners = totalLearners;
            this.professionalCount = professionalCount;
            this.premiumCount = premiumCount;
        }

        // Getters
        public long getTotalLearners() { return totalLearners; }
        public long getProfessionalCount() { return professionalCount; }
        public long getPremiumCount() { return premiumCount; }
    }
}
