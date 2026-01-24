package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "lesson_grammar")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonGrammar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    @JsonIgnore
    private SyllabusLesson lesson;

    private String name;
    private String formula;

    @Column(length = 1000)
    private String explanation;

    private String example;
    private String note;
}
