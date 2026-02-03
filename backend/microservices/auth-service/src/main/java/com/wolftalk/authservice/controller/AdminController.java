package com.wolftalk.authservice.controller;

import com.wolftalk.authservice.model.User;
import com.wolftalk.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    // Get all users (non-paginated)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("data", users);
        return ResponseEntity.ok(response);
    }

    // Get users with pagination
    @GetMapping("/page")
    public ResponseEntity<Map<String, Object>> getUsersPaginated(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("data", page.getContent());
        response.put("currentPage", page.getNumber());
        response.put("totalElements", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        return ResponseEntity.ok(response);
    }

    // Get user detail by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserDetail(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        Map<String, Object> response = new HashMap<>();
        response.put("data", user);
        return ResponseEntity.ok(response);
    }

    // Search users by email
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchUserByEmail(@RequestParam String email) {
        List<User> users = userRepository.searchByEmail(email);
        Map<String, Object> response = new HashMap<>();
        response.put("data", users);
        return ResponseEntity.ok(response);
    }

    // Update user status
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (statusUpdate.containsKey("isEnabled")) {
            user.setIsEnabled(statusUpdate.get("isEnabled"));
        }

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("data", user);
        return ResponseEntity.ok(response);
    }

    // Update user information
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long id,
            @RequestBody User userUpdate) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (userUpdate.getFirstName() != null)
            user.setFirstName(userUpdate.getFirstName());
        if (userUpdate.getLastName() != null)
            user.setLastName(userUpdate.getLastName());
        if (userUpdate.getRoles() != null)
            user.setRoles(userUpdate.getRoles());
        if (userUpdate.getAvatar() != null)
            user.setAvatar(userUpdate.getAvatar());
        if (userUpdate.getIsEnabled() != null)
            user.setIsEnabled(userUpdate.getIsEnabled());

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("data", user);
        return ResponseEntity.ok(response);
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}
