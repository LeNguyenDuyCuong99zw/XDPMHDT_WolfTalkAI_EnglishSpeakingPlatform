package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "package_features")
public class PackageFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private LearningPackage learningPackage;

    @Column(nullable = false)
    private String featureName; // Tên tính năng: "Bài học video", "Bài tập nghe", etc.

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Boolean included; // Có được bao gồm trong gói này không

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Constructors
    public PackageFeature() {
        this.active = true;
        this.included = true;
        this.createdAt = new Date();
    }

    public PackageFeature(LearningPackage learningPackage, String featureName, String description, Boolean included) {
        this.learningPackage = learningPackage;
        this.featureName = featureName;
        this.description = description;
        this.included = included;
        this.active = true;
        this.createdAt = new Date();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LearningPackage getLearningPackage() {
        return learningPackage;
    }

    public void setLearningPackage(LearningPackage learningPackage) {
        this.learningPackage = learningPackage;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIncluded() {
        return included;
    }

    public void setIncluded(Boolean included) {
        this.included = included;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
