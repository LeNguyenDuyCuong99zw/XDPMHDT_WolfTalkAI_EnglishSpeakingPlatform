package com.wolftalk.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wolftalk.backend.dto.ResetPasswordDTO;
import com.wolftalk.backend.dto.UpdateUserDTO;
import com.wolftalk.backend.dto.UpdateUserStatusDTO;
import com.wolftalk.backend.dto.UserDetailDTO;
import com.wolftalk.backend.dto.UserListDTO;
import com.wolftalk.backend.dto.CreateUserDTO;
import com.wolftalk.backend.service.AdminUserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * Lấy danh sách tất cả người dùng
     * GET /api/admin/users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserListDTO> users = adminUserService.getAllUsers();
            return ResponseEntity.ok(Map.of("success", true, "data", users, "total", users.size()));
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Lấy danh sách người dùng theo trang
     * GET /api/admin/users?page=0&size=10
     */
    @GetMapping("/users/page")
    public ResponseEntity<?> getUsersPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<UserListDTO> usersPage = adminUserService.getUsersPage(pageable);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", usersPage.getContent(),
                "totalPages", usersPage.getTotalPages(),
                "totalElements", usersPage.getTotalElements(),
                "currentPage", page
            ));
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Lấy chi tiết người dùng
     * GET /api/admin/users/{userId}
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserDetail(@PathVariable Long userId) {
        try {
            UserDetailDTO user = adminUserService.getUserDetail(userId);
            return ResponseEntity.ok(Map.of("success", true, "data", user));
        } catch (Exception e) {
            return ResponseEntity.status(404)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Tạo người dùng mới
     * POST /api/admin/users
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserDTO createDTO) {
        try {
            UserDetailDTO user = adminUserService.createUser(createDTO);
            return ResponseEntity.status(201).body(Map.of("success", true, "data", user,
                    "message", "Tạo người dùng mới thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Cập nhật trạng thái tài khoản (bật/tắt)
     * PUT /api/admin/users/{userId}/status
     */
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UpdateUserStatusDTO statusDTO) {
        try {
            UserDetailDTO user = adminUserService.updateUserStatus(userId, statusDTO);
            return ResponseEntity.ok(Map.of("success", true, "data", user, 
                    "message", "Cập nhật trạng thái tài khoản thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Cập nhật thông tin người dùng
     * PUT /api/admin/users/{userId}
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId,
            @RequestBody UpdateUserDTO updateDTO) {
        try {
            UserDetailDTO user = adminUserService.updateUser(userId, updateDTO);
            return ResponseEntity.ok(Map.of("success", true, "data", user,
                    "message", "Cập nhật thông tin người dùng thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Xóa người dùng
     * DELETE /api/admin/users/{userId}
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            adminUserService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("success", true, 
                    "message", "Xóa người dùng thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Tìm kiếm người dùng theo email
     * GET /api/admin/users/search?email=user@example.com
     */
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUserByEmail(@RequestParam String email) {
        try {
            UserListDTO user = adminUserService.findByEmail(email);
            return ResponseEntity.ok(Map.of("success", true, "data", user));
        } catch (Exception e) {
            return ResponseEntity.status(404)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Reset mật khẩu người dùng
     * POST /api/admin/users/{userId}/reset-password
     */
    @PostMapping("/users/{userId}/reset-password")
    public ResponseEntity<?> resetPassword(
            @PathVariable Long userId,
            @RequestBody ResetPasswordDTO resetDTO) {
        try {
            adminUserService.resetUserPassword(userId, resetDTO.getNewPassword());
            return ResponseEntity.ok(Map.of("success", true, 
                    "message", "Reset mật khẩu thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
