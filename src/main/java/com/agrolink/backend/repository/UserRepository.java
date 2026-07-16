package com.agrolink.backend.repository;

import com.agrolink.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserId(String userId); // userId IS the @Id, kept for naming parity with old code
}
