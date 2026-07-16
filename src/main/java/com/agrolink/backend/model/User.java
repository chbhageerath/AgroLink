package com.agrolink.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    private String userId; // e.g. "user_ab12cd34ef56" - business ID doubles as primary key

    private String name;

    @Column(unique = true)
    private String email;

    private String password;    // bcrypt hash, null for Google-auth users
    private String role;        // farmer, buyer, admin
    private String phone = "";
    private String location = "";

    @Column(length = 1000)
    private String bio = "";

    private String farmName = "";

    @Column(columnDefinition = "LONGTEXT")
    private String avatar = "";

    private String authType = "password"; // "password" or "google"
    private String createdAt = Instant.now().toString();
}