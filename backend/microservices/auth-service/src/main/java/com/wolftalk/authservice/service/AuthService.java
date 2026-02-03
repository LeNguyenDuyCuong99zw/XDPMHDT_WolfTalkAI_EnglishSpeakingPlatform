package com.wolftalk.authservice.service;

import com.wolftalk.authservice.dto.AuthResponse;
import com.wolftalk.authservice.dto.LoginRequest;
import com.wolftalk.authservice.dto.RegisterRequest;
import com.wolftalk.authservice.model.User;
import com.wolftalk.authservice.repository.UserRepository;
import com.wolftalk.authservice.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User u = new User();
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setFirstName(req.getFirstName());
        u.setLastName(req.getLastName());
        u.setLearningLanguage(req.getLearningLanguage());
        u.setRoles("ROLE_USER");
        userRepository.save(u);
        String token = jwtUtil.generateToken(u.getEmail(), "ROLE_USER");
        return new AuthResponse(token);
    }
    public AuthResponse login(LoginRequest req) {
        Optional<User> found = userRepository.findByEmailIgnoreCase(req.getEmail());
        if (found.isEmpty()) throw new IllegalArgumentException("Invalid credentials");
        User u = found.get();
        if (!passwordEncoder.matches(req.getPassword(), u.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(u.getEmail(), u.getRoles());
        return new AuthResponse(token, u);
    }
}
