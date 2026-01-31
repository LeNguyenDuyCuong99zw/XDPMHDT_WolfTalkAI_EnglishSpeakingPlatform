package com.wolftalk.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wolftalk.backend.dto.FriendRequestDTO;
import com.wolftalk.backend.dto.FriendResponseDTO;
import com.wolftalk.backend.dto.FriendshipDTO;
import com.wolftalk.backend.dto.UserFriendDTO;
import com.wolftalk.backend.entity.Friendship;
import com.wolftalk.backend.entity.Friendship.FriendshipStatus;
import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.FriendshipRepository;
import com.wolftalk.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    /**
     * Gửi lời mời kết bạn
     */
    public FriendshipDTO sendFriendRequest(Long requesterId, FriendRequestDTO request) {
        // Kiểm tra user có tồn tại không
        User requester = userRepository.findById(requesterId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + requesterId));
        
        User receiver = userRepository.findById(request.getReceiverId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + request.getReceiverId()));

        // Không thể gửi lời mời cho chính mình
        if (requesterId.equals(request.getReceiverId())) {
            throw new RuntimeException("Không thể gửi lời mời kết bạn cho chính mình");
        }

        // Kiểm tra xem đã kết bạn chưa
        if (friendshipRepository.findFriendship(requesterId, request.getReceiverId()).isPresent()) {
            throw new RuntimeException("Bạn đã kết bạn với người dùng này");
        }

        // Kiểm tra xem có lời mời đang chờ hoặc bị chặn không
        Optional<Friendship> existing = friendshipRepository.findPendingOrBlockedFriendship(requesterId, request.getReceiverId());
        if (existing.isPresent()) {
            Friendship friendship = existing.get();
            if (friendship.getStatus() == FriendshipStatus.BLOCKED) {
                throw new RuntimeException("Bạn hoặc người dùng này đã chặn lẫn nhau");
            }
            throw new RuntimeException("Lời mời kết bạn này đã tồn tại");
        }

        // Kiểm tra xem bị chặn không
        if (friendshipRepository.findBlockedFriendship(request.getReceiverId(), requesterId).isPresent()) {
            throw new RuntimeException("Người dùng này đã chặn bạn");
        }

        // Tạo lời mời kết bạn mới
        Friendship friendship = new Friendship();
        friendship.setRequester(requester);
        friendship.setReceiver(receiver);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendship.setCreatedAt(Instant.now());
        friendship.setUpdatedAt(Instant.now());

        Friendship savedFriendship = friendshipRepository.save(friendship);
        return mapToDTO(savedFriendship);
    }

    /**
     * Chấp nhận lời mời kết bạn
     */
    public FriendshipDTO acceptFriendRequest(Long receiverId, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lời mời kết bạn"));

        // Kiểm tra người dùng có phải là người nhận không
        if (!friendship.getReceiver().getId().equals(receiverId)) {
            throw new RuntimeException("Bạn không được phép chấp nhận lời mời này");
        }

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new RuntimeException("Lời mời kết bạn này không còn hiệu lực");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendship.setUpdatedAt(Instant.now());
        
        Friendship updatedFriendship = friendshipRepository.save(friendship);
        return mapToDTO(updatedFriendship);
    }

    /**
     * Từ chối lời mời kết bạn (xóa lời mời)
     */
    public void rejectFriendRequest(Long receiverId, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lời mời kết bạn"));

        // Kiểm tra người dùng có phải là người nhận không
        if (!friendship.getReceiver().getId().equals(receiverId)) {
            throw new RuntimeException("Bạn không được phép từ chối lời mời này");
        }

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new RuntimeException("Lời mời kết bạn này không còn hiệu lực");
        }

        friendshipRepository.delete(friendship);
    }

    /**
     * Chặn người dùng
     */
    public void blockUser(Long userId, Long userToBlockId) {
        if (userId.equals(userToBlockId)) {
            throw new RuntimeException("Không thể chặn chính mình");
        }

        User blocker = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + userId));
        
        User targetUser = userRepository.findById(userToBlockId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + userToBlockId));

        // Xóa mối quan hệ kết bạn hiện tại (nếu có)
        Optional<Friendship> existing = friendshipRepository.findFriendship(userId, userToBlockId);
        existing.ifPresent(friendshipRepository::delete);

        // Tạo bản ghi chặn
        Optional<Friendship> blocked = friendshipRepository.findBlockedFriendship(userId, userToBlockId);
        if (blocked.isEmpty()) {
            Friendship blockFriendship = new Friendship();
            blockFriendship.setRequester(blocker);
            blockFriendship.setReceiver(targetUser);
            blockFriendship.setStatus(FriendshipStatus.BLOCKED);
            blockFriendship.setBlockReason("Người dùng đã chặn bạn");
            blockFriendship.setCreatedAt(Instant.now());
            blockFriendship.setUpdatedAt(Instant.now());
            
            friendshipRepository.save(blockFriendship);
        }
    }

    /**
     * Bỏ chặn người dùng
     */
    public void unblockUser(Long userId, Long userToUnblockId) {
        Optional<Friendship> blocked = friendshipRepository.findBlockedFriendship(userId, userToUnblockId);
        blocked.ifPresent(friendshipRepository::delete);
    }

    /**
     * Hủy kết bạn
     */
    public void unfriend(Long userId, Long friendId) {
        Optional<Friendship> friendship = friendshipRepository.findFriendship(userId, friendId);
        friendship.ifPresent(friendshipRepository::delete);
    }

    /**
     * Lấy danh sách lời mời kết bạn đang chờ
     */
    public List<FriendshipDTO> getPendingFriendRequests(Long userId) {
        List<Friendship> friendships = friendshipRepository.findPendingRequests(userId);
        return friendships.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    /**
     * Lấy danh sách bạn bè đã chấp nhận
     */
    public List<UserFriendDTO> getFriendsList(Long userId) {
        List<Friendship> friendships = friendshipRepository.findAcceptedFriends(userId);
        return friendships.stream()
            .map(f -> f.getRequester().getId().equals(userId) ? f.getReceiver() : f.getRequester())
            .map(this::mapUserToFriendDTO)
            .collect(Collectors.toList());
    }

    /**
     * Kiểm tra xem hai user đã kết bạn chưa
     */
    public boolean areFriends(Long userId1, Long userId2) {
        return friendshipRepository.findFriendship(userId1, userId2).isPresent();
    }

    /**
     * Đếm số bạn bè của user
     */
    public Long countFriends(Long userId) {
        return friendshipRepository.countFriendsFor(userId);
    }

    /**
     * Lấy danh sách lời mời kết bạn đã gửi
     */
    public List<FriendshipDTO> getSentFriendRequests(Long userId) {
        List<Friendship> friendships = friendshipRepository.findSentPendingRequests(userId);
        return friendships.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    /**
     * Tìm kiếm người dùng để kết bạn
     */
    public List<UserFriendDTO> searchUsers(String searchTerm) {
        return userRepository.searchByName(searchTerm).stream()
            .map(this::mapUserToFriendDTO)
            .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm người dùng theo last_name
     */
    public List<UserFriendDTO> searchByLastName(String lastName) {
        return userRepository.searchByLastName(lastName).stream()
            .map(this::mapUserToFriendDTO)
            .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm người dùng theo email
     */
    public List<UserFriendDTO> searchByEmail(String email) {
        return userRepository.searchByEmail(email).stream()
            .map(this::mapUserToFriendDTO)
            .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách tất cả users trừ user hiện tại, chỉ lấy users có ROLE_USER
     */
    public List<UserFriendDTO> getAllUsersExcludingCurrent(Long currentUserId, int page, int size) {
        // Lấy tất cả users
        List<User> allUsers = userRepository.findAll();
        
        // Lọc ra user hiện tại, chỉ lấy ROLE_USER, và sắp xếp
        return allUsers.stream()
            .filter(user -> !user.getId().equals(currentUserId))
            .filter(user -> user.getRoles() != null && user.getRoles().contains("ROLE_USER"))
            .sorted((a, b) -> {
                // Sắp xếp theo firstName
                int nameCompare = (a.getFirstName() + " " + a.getLastName())
                    .compareTo(b.getFirstName() + " " + b.getLastName());
                return nameCompare;
            })
            .skip((long) page * size)
            .limit(size)
            .map(this::mapUserToFriendDTO)
            .collect(Collectors.toList());
    }

    // Helper methods
    private FriendshipDTO mapToDTO(Friendship friendship) {
        FriendshipDTO dto = new FriendshipDTO();
        dto.setId(friendship.getId());
        dto.setRequesterId(friendship.getRequester().getId());
        dto.setRequesterName(friendship.getRequester().getFirstName() + " " + friendship.getRequester().getLastName());
        dto.setRequesterAvatar(friendship.getRequester().getAvatar());
        dto.setReceiverId(friendship.getReceiver().getId());
        dto.setReceiverName(friendship.getReceiver().getFirstName() + " " + friendship.getReceiver().getLastName());
        dto.setReceiverAvatar(friendship.getReceiver().getAvatar());
        dto.setStatus(friendship.getStatus());
        dto.setCreatedAt(friendship.getCreatedAt());
        dto.setUpdatedAt(friendship.getUpdatedAt());
        return dto;
    }

    private UserFriendDTO mapUserToFriendDTO(User user) {
        UserFriendDTO dto = new UserFriendDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setAvatar(user.getAvatar());
        dto.setLearningLanguage(user.getLearningLanguage());
        dto.setPoints(user.getPoints());
        dto.setStreak(user.getStreak());
        dto.setLastActiveDate(user.getLastActiveDate());
        return dto;
    }
}
