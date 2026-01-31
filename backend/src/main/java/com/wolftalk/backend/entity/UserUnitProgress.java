package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "user_unit_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUnitProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "unit_id")
    private String unitId;

    private String status; // locked, unlocked, completed

    private Integer score;

    private Instant completedAt;

}
