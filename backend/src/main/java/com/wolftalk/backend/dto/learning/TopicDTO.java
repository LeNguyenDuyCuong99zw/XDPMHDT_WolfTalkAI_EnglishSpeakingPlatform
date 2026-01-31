package com.wolftalk.backend.dto.learning;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicDTO {
    private String id;
    private String group;
    private String minLevel;
    private List<String> topics; // Scenario names
    private List<String> examples;
}
