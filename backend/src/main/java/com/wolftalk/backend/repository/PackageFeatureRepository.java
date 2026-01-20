package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.PackageFeature;
import com.wolftalk.backend.entity.LearningPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageFeatureRepository extends JpaRepository<PackageFeature, Long> {

    List<PackageFeature> findByLearningPackageAndActiveTrue(LearningPackage learningPackage);

    List<PackageFeature> findByLearningPackage(LearningPackage learningPackage);

    List<PackageFeature> findByLearningPackageAndIncludedTrue(LearningPackage learningPackage);
}
