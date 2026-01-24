package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "practice_matching_pairs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PracticeMatchingPair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pair_left")
    private String left;

    @Column(name = "pair_right")
    private String right;
}
