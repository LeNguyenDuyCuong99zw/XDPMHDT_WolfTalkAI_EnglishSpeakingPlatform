package com.wolftalk.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class PackageComparisonDTO {

    private Long packageId;
    private String packageName;
    private String packageCode;
    private BigDecimal monthlyPrice;
    private BigDecimal annualPrice;
    private Boolean hasMentor;
    private Integer mentorHoursPerMonth;
    private String description;
    private List<PackageFeatureDTO> features;
    private Boolean isMostPopular; // Đánh dấu gói phổ biến nhất
    private String badge; // "MOST POPULAR", "BEST VALUE", etc.

    // Constructors
    public PackageComparisonDTO() {}

    public PackageComparisonDTO(Long packageId, String packageName, String packageCode,
                               BigDecimal monthlyPrice, Boolean hasMentor) {
        this.packageId = packageId;
        this.packageName = packageName;
        this.packageCode = packageCode;
        this.monthlyPrice = monthlyPrice;
        this.hasMentor = hasMentor;
        this.isMostPopular = false;
    }

    // Getters and Setters
    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public BigDecimal getMonthlyPrice() {
        return monthlyPrice;
    }

    public void setMonthlyPrice(BigDecimal monthlyPrice) {
        this.monthlyPrice = monthlyPrice;
    }

    public BigDecimal getAnnualPrice() {
        return annualPrice;
    }

    public void setAnnualPrice(BigDecimal annualPrice) {
        this.annualPrice = annualPrice;
    }

    public Boolean getHasMentor() {
        return hasMentor;
    }

    public void setHasMentor(Boolean hasMentor) {
        this.hasMentor = hasMentor;
    }

    public Integer getMentorHoursPerMonth() {
        return mentorHoursPerMonth;
    }

    public void setMentorHoursPerMonth(Integer mentorHoursPerMonth) {
        this.mentorHoursPerMonth = mentorHoursPerMonth;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<PackageFeatureDTO> getFeatures() {
        return features;
    }

    public void setFeatures(List<PackageFeatureDTO> features) {
        this.features = features;
    }

    public Boolean getIsMostPopular() {
        return isMostPopular;
    }

    public void setIsMostPopular(Boolean isMostPopular) {
        this.isMostPopular = isMostPopular;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    // Inner DTO for features
    public static class PackageFeatureDTO {
        private String featureName;
        private Boolean included;
        private String description;

        public PackageFeatureDTO() {}

        public PackageFeatureDTO(String featureName, Boolean included) {
            this.featureName = featureName;
            this.included = included;
        }

        public String getFeatureName() {
            return featureName;
        }

        public void setFeatureName(String featureName) {
            this.featureName = featureName;
        }

        public Boolean getIncluded() {
            return included;
        }

        public void setIncluded(Boolean included) {
            this.included = included;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
}
