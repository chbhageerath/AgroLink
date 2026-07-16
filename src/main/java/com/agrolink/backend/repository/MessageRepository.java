package com.agrolink.backend.repository;

import com.agrolink.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, String> {
    List<Message> findByThreadIdOrderByCreatedAtAsc(String threadId);

    @Query("SELECT m FROM Message m WHERE m.senderId = :userId OR m.receiverId = :userId ORDER BY m.createdAt DESC")
    List<Message> findAllInvolvingUser(@Param("userId") String userId);
}
