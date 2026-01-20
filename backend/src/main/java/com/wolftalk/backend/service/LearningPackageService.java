package com.wolftalk.backend.service;

import com.wolftalk.backend.dto.LearningPackageDTO;
import com.wolftalk.backend.dto.PackageComparisonDTO;
import com.wolftalk.backend.dto.CreatePackageRequest;
import com.wolftalk.backend.entity.LearningPackage;
import com.wolftalk.backend.entity.PackageFeature;
import com.wolftalk.backend.repository.LearningPackageRepository;
import com.wolftalk.backend.repository.PackageFeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LearningPackageService {

    @Autowired
    private LearningPackageRepository learningPackageRepository;

    @Autowired
    private PackageFeatureRepository packageFeatureRepository;

    // Lấy tất cả các gói học
    public List<LearningPackageDTO> getAllPackages() {
        List<LearningPackage> packages = learningPackageRepository.findByActiveTrue();
        return packages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Lấy gói học theo ID
    public LearningPackageDTO getPackageById(Long id) {
        Optional<LearningPackage> pkg = learningPackageRepository.findById(id);
        return pkg.map(this::convertToDTO).orElse(null);
    }

    // Lấy gói học theo code
    public LearningPackageDTO getPackageByCode(String code) {
        Optional<LearningPackage> pkg = learningPackageRepository.findByPackageCode(code);
        return pkg.map(this::convertToDTO).orElse(null);
    }

    // Lấy tất cả các gói có mentor
    public List<LearningPackageDTO> getPackagesWithMentor() {
        List<LearningPackage> packages = learningPackageRepository.findByHasMentorTrue();
        return packages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Lấy tất cả các gói không có mentor
    public List<LearningPackageDTO> getPackagesWithoutMentor() {
        List<LearningPackage> packages = learningPackageRepository.findByHasMentorFalse();
        return packages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Tạo gói học mới
    public LearningPackageDTO createPackage(CreatePackageRequest request) {
        LearningPackage pkg = new LearningPackage();
        pkg.setPackageCode(request.getPackageCode());
        pkg.setPackageName(request.getPackageName());
        pkg.setDescription(request.getDescription());
        pkg.setPrice(request.getPrice());
        pkg.setMonthlyPrice(request.getMonthlyPrice());
        pkg.setAnnualPrice(request.getAnnualPrice());
        pkg.setHasMentor(request.getHasMentor());
        pkg.setMentorHoursPerMonth(request.getMentorHoursPerMonth() != null ? request.getMentorHoursPerMonth() : 0);
        pkg.setActive(true);

        LearningPackage savedPkg = learningPackageRepository.save(pkg);
        return convertToDTO(savedPkg);
    }

    // Cập nhật gói học
    public LearningPackageDTO updatePackage(Long id, CreatePackageRequest request) {
        Optional<LearningPackage> optPkg = learningPackageRepository.findById(id);
        if (optPkg.isPresent()) {
            LearningPackage pkg = optPkg.get();
            if (request.getPackageName() != null) pkg.setPackageName(request.getPackageName());
            if (request.getDescription() != null) pkg.setDescription(request.getDescription());
            if (request.getPrice() != null) pkg.setPrice(request.getPrice());
            if (request.getMonthlyPrice() != null) pkg.setMonthlyPrice(request.getMonthlyPrice());
            if (request.getAnnualPrice() != null) pkg.setAnnualPrice(request.getAnnualPrice());
            if (request.getHasMentor() != null) pkg.setHasMentor(request.getHasMentor());
            if (request.getMentorHoursPerMonth() != null) pkg.setMentorHoursPerMonth(request.getMentorHoursPerMonth());

            LearningPackage updatedPkg = learningPackageRepository.save(pkg);
            return convertToDTO(updatedPkg);
        }
        return null;
    }

    // Xóa gói học (soft delete)
    public void deletePackage(Long id) {
        Optional<LearningPackage> optPkg = learningPackageRepository.findById(id);
        if (optPkg.isPresent()) {
            LearningPackage pkg = optPkg.get();
            pkg.setActive(false);
            learningPackageRepository.save(pkg);
        }
    }

    // Lấy thông tin so sánh các gói
    public List<PackageComparisonDTO> getPackageComparison() {
        List<LearningPackage> packages = learningPackageRepository.findByActiveTrue();
        List<PackageComparisonDTO> comparisons = new ArrayList<>();

        for (LearningPackage pkg : packages) {
            PackageComparisonDTO comparison = new PackageComparisonDTO();
            comparison.setPackageId(pkg.getId());
            comparison.setPackageName(pkg.getPackageName());
            comparison.setPackageCode(pkg.getPackageCode());
            comparison.setMonthlyPrice(pkg.getMonthlyPrice());
            comparison.setAnnualPrice(pkg.getAnnualPrice());
            comparison.setHasMentor(pkg.getHasMentor());
            comparison.setMentorHoursPerMonth(pkg.getMentorHoursPerMonth());
            comparison.setDescription(pkg.getDescription());

            // Đánh dấu gói phổ biến nhất (Premium)
            if ("PREMIUM".equals(pkg.getPackageCode())) {
                comparison.setIsMostPopular(true);
                comparison.setBadge("MOST POPULAR");
            }

            // Lấy danh sách tính năng
            List<PackageFeature> features = packageFeatureRepository.findByLearningPackageAndActiveTrue(pkg);
            List<PackageComparisonDTO.PackageFeatureDTO> featureDTOs = features.stream()
                    .map(f -> new PackageComparisonDTO.PackageFeatureDTO(f.getFeatureName(), f.getIncluded()))
                    .collect(Collectors.toList());
            comparison.setFeatures(featureDTOs);

            comparisons.add(comparison);
        }

        return comparisons;
    }

    // Thêm tính năng vào gói
    public void addFeatureToPackage(Long packageId, String featureName, String description, Boolean included) {
        Optional<LearningPackage> optPkg = learningPackageRepository.findById(packageId);
        if (optPkg.isPresent()) {
            PackageFeature feature = new PackageFeature(optPkg.get(), featureName, description, included);
            packageFeatureRepository.save(feature);
        }
    }

    // Chuyển đổi Entity sang DTO
    private LearningPackageDTO convertToDTO(LearningPackage pkg) {
        LearningPackageDTO dto = new LearningPackageDTO();
        dto.setId(pkg.getId());
        dto.setPackageCode(pkg.getPackageCode());
        dto.setPackageName(pkg.getPackageName());
        dto.setDescription(pkg.getDescription());
        dto.setPrice(pkg.getPrice());
        dto.setMonthlyPrice(pkg.getMonthlyPrice());
        dto.setAnnualPrice(pkg.getAnnualPrice());
        dto.setHasMentor(pkg.getHasMentor());
        dto.setMentorHoursPerMonth(pkg.getMentorHoursPerMonth());
        dto.setActive(pkg.getActive());

        // Lấy danh sách tính năng
        List<PackageFeature> features = packageFeatureRepository.findByLearningPackageAndActiveTrue(pkg);
        List<String> featureNames = features.stream()
                .filter(PackageFeature::getIncluded)
                .map(PackageFeature::getFeatureName)
                .collect(Collectors.toList());
        dto.setFeatures(featureNames);

        return dto;
    }
}
