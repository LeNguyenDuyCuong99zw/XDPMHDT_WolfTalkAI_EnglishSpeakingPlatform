package com.wolftalk.backend.dto.learning.content;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyDTO {
    private Long id;
    private String word;
    private String phonetic;
    private String meaning;
    private String example;
    private String usage;
}
