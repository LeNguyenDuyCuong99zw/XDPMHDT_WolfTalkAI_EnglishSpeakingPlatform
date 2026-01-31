package com.wolftalk.backend.dto.learning.content;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckpointQuestionDTO {
    private String id;
    private String text;
    private String type;
    private String audioUrl;
    private List<String> options;
    private Integer correctOption;
}
