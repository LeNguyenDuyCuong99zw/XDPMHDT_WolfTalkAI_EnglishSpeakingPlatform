package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.UserSubscription;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.entity.LearningPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {

    List<UserSubscription> findByUser(User user);

    List<UserSubscription> findByUserAndStatus(User user, UserSubscription.SubscriptionStatus status);

    Optional<UserSubscription> findByUserAndLearningPackageAndStatus(User user, LearningPackage learningPackage,
                                                                      UserSubscription.SubscriptionStatus status);

    List<UserSubscription> findByLearningPackage(LearningPackage learningPackage);

    List<UserSubscription> findByStatus(UserSubscription.SubscriptionStatus status);
}
