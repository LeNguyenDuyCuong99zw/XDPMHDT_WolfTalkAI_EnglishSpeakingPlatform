package com.wolftalk.authservice.payload;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
