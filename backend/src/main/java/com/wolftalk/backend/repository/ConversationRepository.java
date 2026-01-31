package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.Conversation;
import com.wolftalk.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.user1 = ?1 AND c.user2 = ?2) OR " +
           "(c.user1 = ?2 AND c.user2 = ?1)")
    Optional<Conversation> findConversation(User user1, User user2);

    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.user1 = ?1 OR c.user2 = ?1) AND c.isArchived = false " +
           "ORDER BY c.lastMessageAt DESC NULLS LAST")
    Page<Conversation> findUserConversations(User user, Pageable pageable);

    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.user1 = ?1 OR c.user2 = ?1) AND c.isArchived = false " +
           "ORDER BY c.lastMessageAt DESC NULLS LAST")
    List<Conversation> findUserConversations(User user);
}
