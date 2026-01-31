package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.UserUnitProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserUnitProgressRepository extends JpaRepository<UserUnitProgress, Long> {
    Optional<UserUnitProgress> findByUserIdAndUnitId(Long userId, String unitId);

    List<UserUnitProgress> findByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, String status);
}
