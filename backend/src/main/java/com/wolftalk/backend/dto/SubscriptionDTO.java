package com.wolftalk.backend.dto;

import com.wolftalk.backend.entity.UserSubscription.SubscriptionStatus;
import com.wolftalk.backend.entity.UserSubscription.BillingCycle;
import java.math.BigDecimal;
import java.util.Date;

public class SubscriptionDTO {

    private Long id;
    private Long userId;
    private Long packageId;
    private String packageName;
    private String packageCode;
    private SubscriptionStatus status;
    private BillingCycle billingCycle;
    private BigDecimal paidAmount;
    private Date startDate;
    private Date endDate;
    private Date nextBillingDate;
    private Integer mentorHoursUsed;
    private Integer mentorHoursTotal;
    private Boolean active;

    // Constructors
    public SubscriptionDTO() {}

    public SubscriptionDTO(Long id, Long userId, Long packageId, String packageName,
                          SubscriptionStatus status, BillingCycle billingCycle,
                          Date startDate, Date endDate) {
        this.id = id;
        this.userId = userId;
        this.packageId = packageId;
        this.packageName = packageName;
        this.status = status;
        this.billingCycle = billingCycle;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

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

    public Integer getMentorHoursTotal() {
        return mentorHoursTotal;
    }

    public void setMentorHoursTotal(Integer mentorHoursTotal) {
        this.mentorHoursTotal = mentorHoursTotal;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
