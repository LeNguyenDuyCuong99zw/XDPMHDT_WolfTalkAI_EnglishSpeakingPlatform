package com.wolftalk.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "assessment_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "question_id", nullable = false)
    private Long questionId;
    
    @Column(name = "option_text", nullable = false, length = 1000)
    private String optionText;
    
    @Column(name = "is_correct")
    private Boolean isCorrect = false;
    
    @Column(name = "order_index")
    private Integer orderIndex;
}
