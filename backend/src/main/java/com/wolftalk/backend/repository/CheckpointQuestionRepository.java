package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.CheckpointQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckpointQuestionRepository extends JpaRepository<CheckpointQuestion, String> {
}
