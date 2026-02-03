package com.wolftalk.pronunciation.repository;

import com.wolftalk.pronunciation.entity.PronunciationAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PronunciationAttemptRepository extends JpaRepository<PronunciationAttempt, Long> {
    
    List<PronunciationAttempt> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<PronunciationAttempt> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
