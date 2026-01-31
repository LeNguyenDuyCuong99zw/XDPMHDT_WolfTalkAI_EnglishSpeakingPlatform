package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.CheckpointTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CheckpointTestRepository extends JpaRepository<CheckpointTest, String> {
    Optional<CheckpointTest> findByLevelId(String levelId);
}
