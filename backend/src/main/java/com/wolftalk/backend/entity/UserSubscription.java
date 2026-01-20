package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import java.util.Date;
import java.math.BigDecimal;

@Entity
@Table(name = "user_subscriptions")
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private LearningPackage learningPackage;

    @Column(name = "subscription_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status; // ACTIVE, EXPIRED, CANCELLED, PENDING

    @Column(name = "billing_cycle")
    @Enumerated(EnumType.STRING)
    private BillingCycle billingCycle; // MONTHLY, ANNUAL, ONE_TIME

    @Column(nullable = false)
    private BigDecimal paidAmount;

    @Column(name = "start_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @Column(name = "end_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;

    @Column(name = "next_billing_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date nextBillingDate;

    @Column(name = "mentor_hours_used")
    private Integer mentorHoursUsed; // Số giờ mentor đã sử dụng

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Constructors
    public UserSubscription() {
        this.status = SubscriptionStatus.PENDING;
        this.mentorHoursUsed = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public UserSubscription(User user, LearningPackage learningPackage, 
                           BillingCycle billingCycle, BigDecimal paidAmount,
                           Date startDate, Date endDate) {
        this.user = user;
        this.learningPackage = learningPackage;
        this.billingCycle = billingCycle;
        this.paidAmount = paidAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = SubscriptionStatus.ACTIVE;
        this.mentorHoursUsed = 0;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LearningPackage getLearningPackage() {
        return learningPackage;
    }

    public void setLearningPackage(LearningPackage learningPackage) {
        this.learningPackage = learningPackage;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(SubscriptionStatus status) {
        this.status = status;
    }

    public BillingCycle getBillingCycle() {
        return billingCycle;
    }

    public void setBillingCycle(BillingCycle billingCycle) {
        this.billingCycle = billingCycle;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getNextBillingDate() {
        return nextBillingDate;
    }

    public void setNextBillingDate(Date nextBillingDate) {
        this.nextBillingDate = nextBillingDate;
    }

    public Integer getMentorHoursUsed() {
        return mentorHoursUsed;
    }

    public void setMentorHoursUsed(Integer mentorHoursUsed) {
        this.mentorHoursUsed = mentorHoursUsed;
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

    // Enum for subscription status
    public enum SubscriptionStatus {
        ACTIVE,
        EXPIRED,
        CANCELLED,
        PENDING
    }

    // Enum for billing cycle
    public enum BillingCycle {
        MONTHLY,
        ANNUAL,
        ONE_TIME
    }
}
