package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "syllabus_levels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SyllabusLevel {

    @Id
    @Column(length = 10)
    private String id; // e.g., 'A1', 'A2'

    private String name; // e.g., 'Beginner'

    @Column(name = "group_name")
    private String group; // e.g., 'Basic'

    @Column(length = 500)
    private String description;

    private String color;

    @Column(name = "level_order")
    private Integer order;

    // Total units can be calculated, but storing it for quick access is fine
    private Integer totalUnits;

    @OneToMany(mappedBy = "level", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("order ASC")
    private List<SyllabusUnit> units;

}
