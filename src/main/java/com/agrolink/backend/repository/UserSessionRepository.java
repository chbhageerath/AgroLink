package com.agrolink.backend.repository;

import com.agrolink.backend.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, String> {
    // sessionToken IS the @Id, so findById/deleteById (inherited) work directly
    default Optional<UserSession> findBySessionToken(String sessionToken) {
        return findById(sessionToken);
    }
    default void deleteBySessionToken(String sessionToken) {
        deleteById(sessionToken);
    }
}
