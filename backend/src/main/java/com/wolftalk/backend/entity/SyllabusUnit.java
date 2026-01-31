package com.wolftalk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "syllabus_units")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SyllabusUnit {

    @Id
    @Column(length = 50)
    private String id; // e.g., 'u1_greet'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_id")
    @JsonIgnore
    private SyllabusLevel level;

    @Column(name = "unit_order")
    private Integer order;

    private String title;

    @Column(length = 500)
    private String description;

    private String topic;

    private String imageUrl;

    // Utility field to facilitate mapping (optional in strict JPA but helpful)
    @Column(name = "level_id", insertable = false, updatable = false)
    private String levelId;

    @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("order ASC")
    private List<SyllabusLesson> lessons;

}
