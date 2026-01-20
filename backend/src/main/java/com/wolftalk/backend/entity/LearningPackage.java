package com.wolftalk.backend.entity;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "learning_packages")
public class LearningPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String packageCode; // BASIC, PREMIUM, PROFESSIONAL

    @Column(nullable = false)
    private String packageName; // Tên gói: "Gói Cơ Bản", "Gói Premium", "Gói Chuyên Nghiệp"

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private BigDecimal price; // Giá gói

    @Column(name = "monthly_price")
    private BigDecimal monthlyPrice; // Giá theo tháng

    @Column(name = "annual_price")
    private BigDecimal annualPrice; // Giá theo năm

    @Column(nullable = false)
    private Boolean hasMentor; // Có hỗ trợ mentor hay không

    @Column(name = "mentor_hours_per_month")
    private Integer mentorHoursPerMonth; // Số giờ mentor mỗi tháng (0 nếu không có)

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Constructors
    public LearningPackage() {
        this.active = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public LearningPackage(String packageCode, String packageName, String description,
                          BigDecimal price, Boolean hasMentor, Integer mentorHoursPerMonth) {
        this.packageCode = packageCode;
        this.packageName = packageName;
        this.description = description;
        this.price = price;
        this.hasMentor = hasMentor;
        this.mentorHoursPerMonth = mentorHoursPerMonth != null ? mentorHoursPerMonth : 0;
        this.active = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
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

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
