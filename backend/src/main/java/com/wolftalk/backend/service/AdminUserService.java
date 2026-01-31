package com.wolftalk.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.wolftalk.backend.dto.CreateUserDTO;
import com.wolftalk.backend.dto.UpdateUserDTO;
import com.wolftalk.backend.dto.UpdateUserStatusDTO;
import com.wolftalk.backend.dto.UserDetailDTO;
import com.wolftalk.backend.dto.UserListDTO;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.UserRepository;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Lấy danh sách tất cả người dùng
     */
    public List<UserListDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToListDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách người dùng theo trang (pagination)
     */
    public Page<UserListDTO> getUsersPage(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::convertToListDTO);
    }

    /**
     * Lấy chi tiết người dùng theo ID
     */
    public UserDetailDTO getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tìm thấy"));
        return convertToDetailDTO(user);
    }

    /**
     * Tạo người dùng mới
     */
    public UserDetailDTO createUser(CreateUserDTO createDTO) {
        // Check email already exists
        if (userRepository.existsByEmail(createDTO.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        
        User user = new User();
        user.setEmail(createDTO.getEmail());
        user.setPassword(passwordEncoder.encode(createDTO.getPassword()));
        user.setFirstName(createDTO.getFirstName());
        user.setLastName(createDTO.getLastName());
        user.setRoles(createDTO.getRoles() != null ? createDTO.getRoles() : "ROLE_USER");
        user.setLearningLanguage(createDTO.getLearningLanguage() != null ? createDTO.getLearningLanguage() : "en");
        user.setIsEnabled(createDTO.getIsEnabled() != null ? createDTO.getIsEnabled() : true);
        user.setIsFirstLogin(true);
        user.setHasCompletedPlacementTest(false);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        
        User savedUser = userRepository.save(user);
        return convertToDetailDTO(savedUser);
    }

    /**
     * Cập nhật trạng thái (bật/tắt) tài khoản
     */
    public UserDetailDTO updateUserStatus(Long userId, UpdateUserStatusDTO statusDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tìm thấy"));
        
        user.setIsEnabled(statusDTO.getIsEnabled());
        user.setUpdatedAt(Instant.now());
        User updatedUser = userRepository.save(user);
        
        return convertToDetailDTO(updatedUser);
    }

    /**
     * Cập nhật thông tin người dùng
     */
    public UserDetailDTO updateUser(Long userId, UpdateUserDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tìm thấy"));
        
        if (updateDTO.getFirstName() != null) {
            user.setFirstName(updateDTO.getFirstName());
        }
        if (updateDTO.getLastName() != null) {
            user.setLastName(updateDTO.getLastName());
        }
        if (updateDTO.getRoles() != null) {
            user.setRoles(updateDTO.getRoles());
        }
        if (updateDTO.getAvatar() != null) {
            user.setAvatar(updateDTO.getAvatar());
        }
        if (updateDTO.getIsEnabled() != null) {
            user.setIsEnabled(updateDTO.getIsEnabled());
        }
        
        user.setUpdatedAt(Instant.now());
        User updatedUser = userRepository.save(user);
        
        return convertToDetailDTO(updatedUser);
    }

    /**
     * Xóa người dùng
     */
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tìm thấy"));
        userRepository.delete(user);
    }

    /**
     * Tìm kiếm người dùng theo email
     */
    public UserListDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tìm thấy"));
        return convertToListDTO(user);
    }

    /**
     * Reset mật khẩu người dùng
     */
    public void resetUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tìm thấy"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    /**
     * Chuyển đổi User entity sang UserListDTO
     */
    private UserListDTO convertToListDTO(User user) {
        return new UserListDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRoles(),
            user.getIsEnabled(),
            user.getHasCompletedPlacementTest(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    /**
     * Chuyển đổi User entity sang UserDetailDTO
     */
    private UserDetailDTO convertToDetailDTO(User user) {
        return new UserDetailDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRoles(),
            user.getAvatar(),
            user.getLearningLanguage(),
            user.getIsEnabled(),
            user.getHasCompletedPlacementTest(),
            user.getIsFirstLogin(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
