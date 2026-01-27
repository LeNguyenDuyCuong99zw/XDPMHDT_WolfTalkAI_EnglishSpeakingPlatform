package com.wolftalk.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wolftalk.backend.entity.Friendship;
import com.wolftalk.backend.entity.Friendship.FriendshipStatus;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    // Lấy tất cả lời mời kết bạn đang chờ của user
    @Query("SELECT f FROM Friendship f WHERE f.receiver.id = :userId AND f.status = 'PENDING'")
    List<Friendship> findPendingRequests(@Param("userId") Long userId);

    // Lấy tất cả bạn bè đã chấp nhận
    @Query("SELECT f FROM Friendship f WHERE (f.requester.id = :userId OR f.receiver.id = :userId) AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriends(@Param("userId") Long userId);

    // Kiểm tra xem hai user đã kết bạn chưa
    @Query("SELECT f FROM Friendship f WHERE ((f.requester.id = :userId1 AND f.receiver.id = :userId2) OR (f.requester.id = :userId2 AND f.receiver.id = :userId1)) AND f.status = 'ACCEPTED'")
    Optional<Friendship> findFriendship(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    // Lấy yêu cầu kết bạn đang chờ giữa 2 user
    @Query("SELECT f FROM Friendship f WHERE ((f.requester.id = :requesterId AND f.receiver.id = :receiverId) OR (f.requester.id = :receiverId AND f.receiver.id = :requesterId)) AND f.status IN ('PENDING', 'BLOCKED')")
    Optional<Friendship> findPendingOrBlockedFriendship(@Param("requesterId") Long requesterId, @Param("receiverId") Long receiverId);

    // Kiểm tra user có bị chặn bởi user khác không
    @Query("SELECT f FROM Friendship f WHERE f.requester.id = :blockerId AND f.receiver.id = :targetUserId AND f.status = 'BLOCKED'")
    Optional<Friendship> findBlockedFriendship(@Param("blockerId") Long blockerId, @Param("targetUserId") Long targetUserId);

    // Đếm số bạn bè của user
    @Query("SELECT COUNT(f) FROM Friendship f WHERE (f.requester.id = :userId OR f.receiver.id = :userId) AND f.status = 'ACCEPTED'")
    Long countFriendsFor(@Param("userId") Long userId);

    // Lấy tất cả lời mời kết bạn đã gửi
    @Query("SELECT f FROM Friendship f WHERE f.requester.id = :userId AND f.status = 'PENDING'")
    List<Friendship> findSentPendingRequests(@Param("userId") Long userId);

    // Kiểm tra xem hai user có phải là bạn bè không (trả về true/false)
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Friendship f WHERE ((f.requester.id = :userId1 AND f.receiver.id = :userId2) OR (f.requester.id = :userId2 AND f.receiver.id = :userId1)) AND f.status = 'ACCEPTED'")
    boolean isFriendship(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
