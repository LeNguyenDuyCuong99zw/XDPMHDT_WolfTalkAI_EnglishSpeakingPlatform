package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "checkpoint_test")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckpointTest {

    @Id
    @Column(length = 50)
    private String id; // e.g. 'test_a1'

    @OneToOne
    @JoinColumn(name = "level_id")
    private SyllabusLevel level;

    private String title;
    private String description;
    private Integer durationMinutes;
    private Integer passingScore;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    private List<CheckpointQuestion> questions;
}
