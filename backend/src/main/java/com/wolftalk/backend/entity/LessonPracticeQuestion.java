package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "lesson_practice_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonPracticeQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    @JsonIgnore
    private SyllabusLesson lesson;

    private String type; // matching, fill-blank, multiple-choice, ordering, listening, speaking, writing

    @Column(length = 1000)
    private String question;

    @Column(length = 1000)
    private String explanation;

    private String correctAnswer;

    @ElementCollection
    private List<String> options;

    @ElementCollection
    private List<String> segments;

    @ElementCollection
    private List<String> correctOrder;

    private String imageUrl;
    private String audioUrl;

    // For matching type
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "question_id")
    private List<PracticeMatchingPair> pairs;
}
