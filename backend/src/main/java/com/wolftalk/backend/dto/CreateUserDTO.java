package com.wolftalk.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserDTO {
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String password;
    
    private String firstName;
    private String lastName;
    private String roles = "ROLE_USER";
    private String learningLanguage = "en";
    private Boolean isEnabled = true;
}
