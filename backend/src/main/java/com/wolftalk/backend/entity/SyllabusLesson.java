package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "syllabus_lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SyllabusLesson {

    @Id
    @Column(length = 50)
    private String id; // e.g., 'l1_vocab'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    @JsonIgnore
    private SyllabusUnit unit;

    @Column(name = "lesson_order")
    private Integer order;

    private String title;

    private String type; // vocabulary, grammar, conversation

    private Integer durationMinutes;

    // Utility field
    @Column(name = "unit_id", insertable = false, updatable = false)
    private String unitId;

}
