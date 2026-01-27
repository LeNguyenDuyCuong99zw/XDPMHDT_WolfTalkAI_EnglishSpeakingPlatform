package com.wolftalk.backend.repository;

import com.wolftalk.backend.entity.Conversation;
import com.wolftalk.backend.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.conversation = ?1 AND m.isDeleted = false " +
           "ORDER BY m.createdAt DESC")
    Page<Message> findByConversationAndNotDeleted(Conversation conversation, Pageable pageable);
}
