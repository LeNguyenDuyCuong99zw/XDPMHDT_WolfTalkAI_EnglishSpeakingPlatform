package com.wolftalk.backend.service;

import com.wolftalk.backend.dto.SubscriptionDTO;
import com.wolftalk.backend.dto.CreateSubscriptionRequest;
import com.wolftalk.backend.entity.UserSubscription;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.entity.LearningPackage;
import com.wolftalk.backend.repository.UserSubscriptionRepository;
import com.wolftalk.backend.repository.UserRepository;
import com.wolftalk.backend.repository.LearningPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    @Autowired
    private UserSubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearningPackageRepository learningPackageRepository;

    // Lấy subscription của user
    public List<SubscriptionDTO> getUserSubscriptions(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            List<UserSubscription> subscriptions = subscriptionRepository.findByUser(user.get());
            return subscriptions.stream().map(this::convertToDTO).collect(Collectors.toList());
        }
        return List.of();
    }

    // Lấy active subscription của user
    public SubscriptionDTO getActiveSubscription(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            List<UserSubscription> subscriptions = subscriptionRepository.findByUserAndStatus(
                    user.get(), UserSubscription.SubscriptionStatus.ACTIVE);
            if (!subscriptions.isEmpty()) {
                return convertToDTO(subscriptions.get(0));
            }
        }
        return null;
    }

    // Tạo subscription mới
    public SubscriptionDTO createSubscription(CreateSubscriptionRequest request) {
        Optional<User> user = userRepository.findById(request.getUserId());
        Optional<LearningPackage> pkg = learningPackageRepository.findById(request.getPackageId());

        if (user.isPresent() && pkg.isPresent()) {
            // Tính toán ngày bắt đầu và kết thúc
            Date startDate = new Date();
            Date endDate = calculateEndDate(startDate, request.getBillingCycle());
            Date nextBillingDate = calculateNextBillingDate(endDate, request.getBillingCycle());

            // Tạo subscription
            UserSubscription subscription = new UserSubscription(
                    user.get(),
                    pkg.get(),
                    request.getBillingCycle(),
                    pkg.get().getPrice(),
                    startDate,
                    endDate
            );
            subscription.setNextBillingDate(nextBillingDate);
            subscription.setStatus(UserSubscription.SubscriptionStatus.ACTIVE);

            UserSubscription saved = subscriptionRepository.save(subscription);
            return convertToDTO(saved);
        }
        return null;
    }

    // Cập nhật subscription status
    public SubscriptionDTO updateSubscriptionStatus(Long subscriptionId, UserSubscription.SubscriptionStatus status) {
        Optional<UserSubscription> optSub = subscriptionRepository.findById(subscriptionId);
        if (optSub.isPresent()) {
            UserSubscription sub = optSub.get();
            sub.setStatus(status);
            UserSubscription updated = subscriptionRepository.save(sub);
            return convertToDTO(updated);
        }
        return null;
    }

    // Hủy subscription
    public void cancelSubscription(Long subscriptionId) {
        Optional<UserSubscription> optSub = subscriptionRepository.findById(subscriptionId);
        if (optSub.isPresent()) {
            UserSubscription sub = optSub.get();
            sub.setStatus(UserSubscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(sub);
        }
    }

    // Cập nhật mentor hours used
    public void updateMentorHoursUsed(Long subscriptionId, Integer hoursUsed) {
        Optional<UserSubscription> optSub = subscriptionRepository.findById(subscriptionId);
        if (optSub.isPresent()) {
            UserSubscription sub = optSub.get();
            sub.setMentorHoursUsed(hoursUsed);
            subscriptionRepository.save(sub);
        }
    }

    // Kiểm tra subscription còn hạn không
    public boolean isSubscriptionValid(Long subscriptionId) {
        Optional<UserSubscription> optSub = subscriptionRepository.findById(subscriptionId);
        if (optSub.isPresent()) {
            UserSubscription sub = optSub.get();
            Date now = new Date();
            return sub.getStatus() == UserSubscription.SubscriptionStatus.ACTIVE &&
                   sub.getEndDate().after(now);
        }
        return false;
    }

    // Tính ngày kết thúc dựa trên billing cycle
    private Date calculateEndDate(Date startDate, UserSubscription.BillingCycle billingCycle) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);

        switch (billingCycle) {
            case MONTHLY:
                calendar.add(Calendar.MONTH, 1);
                break;
            case ANNUAL:
                calendar.add(Calendar.YEAR, 1);
                break;
            case ONE_TIME:
                calendar.add(Calendar.YEAR, 1); // Default 1 năm nếu one-time
                break;
        }
        return calendar.getTime();
    }

    // Tính ngày thanh toán tiếp theo
    private Date calculateNextBillingDate(Date endDate, UserSubscription.BillingCycle billingCycle) {
        if (billingCycle == UserSubscription.BillingCycle.ONE_TIME) {
            return null; // Không có thanh toán tiếp theo
        }
        return endDate;
    }

    // Chuyển đổi Entity sang DTO
    private SubscriptionDTO convertToDTO(UserSubscription sub) {
        SubscriptionDTO dto = new SubscriptionDTO();
        dto.setId(sub.getId());
        dto.setUserId(sub.getUser().getId());
        dto.setPackageId(sub.getLearningPackage().getId());
        dto.setPackageName(sub.getLearningPackage().getPackageName());
        dto.setPackageCode(sub.getLearningPackage().getPackageCode());
        dto.setStatus(sub.getStatus());
        dto.setBillingCycle(sub.getBillingCycle());
        dto.setPaidAmount(sub.getPaidAmount());
        dto.setStartDate(sub.getStartDate());
        dto.setEndDate(sub.getEndDate());
        dto.setNextBillingDate(sub.getNextBillingDate());
        dto.setMentorHoursUsed(sub.getMentorHoursUsed());
        dto.setMentorHoursTotal(sub.getLearningPackage().getMentorHoursPerMonth());
        dto.setActive(sub.getStatus() == UserSubscription.SubscriptionStatus.ACTIVE);
        return dto;
    }
}
