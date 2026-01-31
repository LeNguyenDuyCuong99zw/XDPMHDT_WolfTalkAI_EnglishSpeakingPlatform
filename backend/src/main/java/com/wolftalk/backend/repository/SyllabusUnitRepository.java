package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.SyllabusUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusUnitRepository extends JpaRepository<SyllabusUnit, String> {
    List<SyllabusUnit> findByLevelIdOrderByOrderAsc(String levelId);
}
