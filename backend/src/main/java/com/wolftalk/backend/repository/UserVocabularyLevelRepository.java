package com.wolftalk.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.UserVocabularyLevel;

@Repository
public interface UserVocabularyLevelRepository extends JpaRepository<UserVocabularyLevel, Long> {
    
    Optional<UserVocabularyLevel> findByUserId(Long userId);
    
    boolean existsByUserId(Long userId);
}
