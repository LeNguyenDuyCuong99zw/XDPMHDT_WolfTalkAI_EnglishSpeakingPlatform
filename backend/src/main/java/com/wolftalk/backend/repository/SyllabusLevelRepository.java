package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.SyllabusLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusLevelRepository extends JpaRepository<SyllabusLevel, String> {
    List<SyllabusLevel> findAllByOrderByOrderAsc();
}
