package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "lesson_vocabulary")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonVocabulary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    @JsonIgnore
    private SyllabusLesson lesson;

    private String word;
    private String phonetic;
    private String meaning;
    private String example;
    private String usageNote; // 'usage' in TS

    // Optional: level if needed for filtering, but usually linked to lesson -> unit
    // -> level
}
