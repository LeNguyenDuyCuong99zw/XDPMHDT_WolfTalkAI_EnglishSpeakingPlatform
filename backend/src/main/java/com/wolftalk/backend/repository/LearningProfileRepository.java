package com.wolftalk.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.LearningProfile;
import com.wolftalk.backend.entity.User;

@Repository
public interface LearningProfileRepository extends JpaRepository<LearningProfile, Long> {
    Optional<LearningProfile> findByUser(User user);
    Optional<LearningProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
