package com.agrolink.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "messages")
public class Message {
    @Id
    private String messageId;

    private String threadId;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String productId;

    @Column(length = 2000)
    private String content;

    @Column(name = "is_read")
    private boolean read = false;
    private String createdAt = Instant.now().toString();
}