package com.agrolink.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "user_sessions")
public class UserSession {
    @Id
    @Column(length = 500)
    private String sessionToken; // used directly as the primary key

    private String userId;
    private String expiresAt; // ISO-8601 string
    private String createdAt = Instant.now().toString();
}
