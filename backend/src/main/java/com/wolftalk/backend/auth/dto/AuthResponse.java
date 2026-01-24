package com.wolftalk.backend.auth.dto;

import com.wolftalk.backend.entity.User;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserInfo user;

    public AuthResponse() {}
    public AuthResponse(String token) { this.token = token; }
    public AuthResponse(String token, User user) { 
        this.token = token; 
        this.user = new UserInfo(user);
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }

    public static class UserInfo {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;

        public UserInfo() {}
        public UserInfo(User user) {
            this.id = user.getId();
            this.email = user.getEmail();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.role = user.getRoles() != null ? user.getRoles().replace("ROLE_", "").split(",")[0] : "USER";
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
