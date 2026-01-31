package com.wolftalk.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.wolftalk.backend.dto.FriendRequestDTO;
import com.wolftalk.backend.dto.FriendResponseDTO;
import com.wolftalk.backend.dto.FriendshipDTO;
import com.wolftalk.backend.dto.UserFriendDTO;
import com.wolftalk.backend.repository.UserRepository;
import com.wolftalk.backend.service.FriendshipService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/friendships")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FriendshipController {

    private final FriendshipService friendshipService;
    private final UserRepository userRepository;

    /**
     * Gửi lời mời kết bạn
     * POST /api/v1/friendships/request
     */
    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(
            Principal principal,
            @RequestBody FriendRequestDTO request) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long userId = extractUserIdFromPrincipal(principal);
            FriendshipDTO friendship = friendshipService.sendFriendRequest(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(friendship);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Chấp nhận lời mời kết bạn
     * POST /api/v1/friendships/{friendshipId}/accept
     */
    @PostMapping("/{friendshipId}/accept")
    public ResponseEntity<?> acceptFriendRequest(
            Principal principal,
            @PathVariable Long friendshipId) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long userId = extractUserIdFromPrincipal(principal);
            FriendshipDTO friendship = friendshipService.acceptFriendRequest(userId, friendshipId);
            return ResponseEntity.ok(friendship);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Từ chối lời mời kết bạn
     * POST /api/v1/friendships/{friendshipId}/reject
     */
    @PostMapping("/{friendshipId}/reject")
    public ResponseEntity<?> rejectFriendRequest(
            Principal principal,
            @PathVariable Long friendshipId) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long userId = extractUserIdFromPrincipal(principal);
            friendshipService.rejectFriendRequest(userId, friendshipId);
            return ResponseEntity.ok(new SuccessResponse("Lời mời kết bạn đã bị từ chối"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Hủy kết bạn
     * POST /api/v1/friendships/{friendId}/unfriend
     */
    @PostMapping("/{friendId}/unfriend")
    public ResponseEntity<?> unfriend(
            Principal principal,
            @PathVariable Long friendId) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long userId = extractUserIdFromPrincipal(principal);
            friendshipService.unfriend(userId, friendId);
            return ResponseEntity.ok(new SuccessResponse("Bạn bè đã bị xóa"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Chặn người dùng
     * POST /api/v1/friendships/{userId}/block
     */
    @PostMapping("/{userId}/block")
    public ResponseEntity<?> blockUser(
            Principal principal,
            @PathVariable Long userId) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long currentUserId = extractUserIdFromPrincipal(principal);
            friendshipService.blockUser(currentUserId, userId);
            return ResponseEntity.ok(new SuccessResponse("Người dùng đã bị chặn"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Bỏ chặn người dùng
     * POST /api/v1/friendships/{userId}/unblock
     */
    @PostMapping("/{userId}/unblock")
    public ResponseEntity<?> unblockUser(
            Principal principal,
            @PathVariable Long userId) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long currentUserId = extractUserIdFromPrincipal(principal);
            friendshipService.unblockUser(currentUserId, userId);
            return ResponseEntity.ok(new SuccessResponse("Người dùng đã bị bỏ chặn"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Lấy danh sách lời mời kết bạn đang chờ
     * GET /api/v1/friendships/pending-requests
     */
    @GetMapping("/pending-requests")
    public ResponseEntity<?> getPendingFriendRequests(Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long userId = extractUserIdFromPrincipal(principal);
            List<FriendshipDTO> friendships = friendshipService.getPendingFriendRequests(userId);
            return ResponseEntity.ok(friendships);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Lấy danh sách lời mời kết bạn đã gửi
     * GET /api/v1/friendships/sent-requests
     */
    @GetMapping("/sent-requests")
    public ResponseEntity<?> getSentFriendRequests(Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long userId = extractUserIdFromPrincipal(principal);
            List<FriendshipDTO> friendships = friendshipService.getSentFriendRequests(userId);
            return ResponseEntity.ok(friendships);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Lấy danh sách bạn bè
     * GET /api/v1/friendships/friends
     */
    @GetMapping("/friends")
    public ResponseEntity<?> getFriendsList(Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long userId = extractUserIdFromPrincipal(principal);
            List<UserFriendDTO> friends = friendshipService.getFriendsList(userId);
            return ResponseEntity.ok(friends);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Kiểm tra xem hai user đã kết bạn chưa
     * GET /api/v1/friendships/check/{userId}
     */
    @GetMapping("/check/{userId}")
    public ResponseEntity<?> checkFriendship(
            Principal principal,
            @PathVariable Long userId) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long currentUserId = extractUserIdFromPrincipal(principal);
            boolean areFriends = friendshipService.areFriends(currentUserId, userId);
            return ResponseEntity.ok(new AreFriendsResponse(areFriends));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Đếm số bạn bè
     * GET /api/v1/friendships/count
     */
    @GetMapping("/count")
    public ResponseEntity<?> countFriends(Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long userId = extractUserIdFromPrincipal(principal);
            Long count = friendshipService.countFriends(userId);
            return ResponseEntity.ok(new CountFriendsResponse(count));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Tìm kiếm người dùng
     * GET /api/v1/friendships/search?q=keyword
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String q) {
        try {
            if (q == null || q.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Từ khóa tìm kiếm không được để trống"));
            }
            
            List<UserFriendDTO> users = friendshipService.searchUsers(q);
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Lấy danh sách tất cả users để hiển thị khi tìm bạn
     * GET /api/v1/friendships/all-users
     */
    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Không được xác thực"));
            }
            
            Long currentUserId = extractUserIdFromPrincipal(principal);
            List<UserFriendDTO> allUsers = friendshipService.getAllUsersExcludingCurrent(currentUserId, page, size);
            return ResponseEntity.ok(allUsers);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Helper method để extract userId từ Principal
    private Long extractUserIdFromPrincipal(Principal principal) {
        String email = principal.getName();
        return userRepository.findByEmailIgnoreCase(email)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    /**
     * Tìm kiếm người dùng theo last_name
     * GET /api/v1/friendships/search-by-last-name?lastName=...
     */
    @GetMapping("/search-by-last-name")
    public ResponseEntity<?> searchByLastName(@RequestParam String lastName) {
        try {
            if (lastName == null || lastName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Vui lòng nhập last name để tìm kiếm"));
            }
            
            List<UserFriendDTO> results = friendshipService.searchByLastName(lastName);
            return ResponseEntity.ok(results);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Tìm kiếm người dùng theo email
     * GET /api/v1/friendships/search-by-email?email=...
     */
    @GetMapping("/search-by-email")
    public ResponseEntity<?> searchByEmail(@RequestParam String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Vui lòng nhập email để tìm kiếm"));
            }
            
            List<UserFriendDTO> results = friendshipService.searchByEmail(email);
            return ResponseEntity.ok(results);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Response DTOs
    static class ErrorResponse {
        public String error;

        public ErrorResponse(String error) {
            this.error = error;
        }
    }

    static class SuccessResponse {
        public String message;

        public SuccessResponse(String message) {
            this.message = message;
        }
    }

    static class AreFriendsResponse {
        public boolean areFriends;

        public AreFriendsResponse(boolean areFriends) {
            this.areFriends = areFriends;
        }
    }

    static class CountFriendsResponse {
        public Long count;

        public CountFriendsResponse(Long count) {
            this.count = count;
        }
    }
}
