package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.LearningPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningPackageRepository extends JpaRepository<LearningPackage, Long> {

    Optional<LearningPackage> findByPackageCode(String packageCode);

    List<LearningPackage> findByActiveTrue();

    List<LearningPackage> findByHasMentorTrue();

    List<LearningPackage> findByHasMentorFalse();

    List<LearningPackage> findAllByOrderByPrice();
}
