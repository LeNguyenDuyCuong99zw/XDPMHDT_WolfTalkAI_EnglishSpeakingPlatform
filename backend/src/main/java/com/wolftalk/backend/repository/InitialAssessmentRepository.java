package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.InitialAssessment;
import com.wolftalk.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InitialAssessmentRepository extends JpaRepository<InitialAssessment, Long> {
    
    // Lấy bài test mới nhất của user
    Optional<InitialAssessment> findFirstByUserOrderByCreatedAtDesc(User user);
    
    // Lấy tất cả bài test của user
    List<InitialAssessment> findByUser(User user);
    
    // Lấy bài test theo trạng thái
    List<InitialAssessment> findByUserAndStatus(User user, String status);
}
