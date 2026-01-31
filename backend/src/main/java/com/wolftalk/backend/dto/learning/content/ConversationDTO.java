package com.wolftalk.backend.dto.learning.content;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Long id;
    private int order;
    private String en; // Mapped from textEn
    private String vi; // Mapped from textVi
}
