package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SpeakingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long learnerId;
    private String topic;
    private String scenario;

    private LocalDateTime createdAt;

    // ===== GETTER / SETTER =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLearnerId() { return learnerId; }
    public void setLearnerId(Long learnerId) { this.learnerId = learnerId; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getScenario() { return scenario; }
    public void setScenario(String scenario) { this.scenario = scenario; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
