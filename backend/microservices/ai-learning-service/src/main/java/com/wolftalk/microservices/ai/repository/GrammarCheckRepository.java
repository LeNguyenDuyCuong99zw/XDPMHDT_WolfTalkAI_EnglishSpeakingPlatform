package com.wolftalk.microservices.ai.repository;

import com.wolftalk.microservices.ai.entity.GrammarCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrammarCheckRepository extends JpaRepository<GrammarCheck, Long> {
    List<GrammarCheck> findByUserIdOrderByCreatedAtDesc(Long userId);
}
