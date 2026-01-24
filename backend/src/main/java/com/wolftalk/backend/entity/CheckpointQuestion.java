package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "checkpoint_question")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckpointQuestion {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id")
    @JsonIgnore
    private CheckpointTest test;

    @Column(length = 1000)
    private String text;

    private String type; // multiple-choice, listening, reading, speaking

    private String audioUrl; // for listening type

    @ElementCollection
    private List<String> options;

    private Integer correctOption; // Index of correct option
}
