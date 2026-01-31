package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "lesson_conversation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    @JsonIgnore
    private SyllabusLesson lesson;

    @Column(name = "turn_order")
    private Integer order;

    @Column(length = 1000)
    private String textEn;

    @Column(length = 1000)
    private String textVi;

    private String speaker; // Optional, e.g. "A", "B", "Waiter"
}
