package com.wolftalk.backend.dto.learning.content;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrammarDTO {
    private Long id;
    private String name;
    private String formula;
    private String explanation;
    private String example;
    private String note;
}
