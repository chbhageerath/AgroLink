package com.agrolink.backend.service;

import com.agrolink.backend.dto.auth.LoginRequest;
import com.agrolink.backend.dto.auth.RegisterRequest;
import com.agrolink.backend.exception.ApiException;
import com.agrolink.backend.model.User;
import com.agrolink.backend.model.UserSession;
import com.agrolink.backend.repository.UserRepository;
import com.agrolink.backend.repository.UserSessionRepository;
import com.agrolink.backend.security.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private static final List<String> VALID_ROLES = Arrays.asList("farmer", "buyer", "admin");

    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final JwtUtil jwtUtil;
    private final RestClient restClient = RestClient.create();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AuthService(UserRepository userRepository, UserSessionRepository userSessionRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
        this.jwtUtil = jwtUtil;
    }

    public static String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    public static boolean verifyPassword(String password, String hashed) {
        if (hashed == null) return false;
        try {
            return BCrypt.checkpw(password, hashed);
        } catch (Exception e) {
            return false;
        }
    }

    private static String newUserId() {
        return "user_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    public record AuthResult(String token, User user) {}

    public AuthResult register(RegisterRequest payload) {
        if (!VALID_ROLES.contains(payload.getRole())) {
            throw new ApiException(400, "Invalid role");
        }
        if (userRepository.findByEmail(payload.getEmail()).isPresent()) {
            throw new ApiException(400, "Email already registered");
        }
        User user = new User();
        user.setUserId(newUserId());
        user.setName(payload.getName());
        user.setEmail(payload.getEmail());
        user.setPassword(hashPassword(payload.getPassword()));
        user.setRole(payload.getRole());
        user.setPhone(payload.getPhone() != null ? payload.getPhone() : "");
        user.setLocation(payload.getLocation() != null ? payload.getLocation() : "");
        user.setAuthType("password");
        user.setCreatedAt(Instant.now().toString());
        userRepository.save(user);

        String token = jwtUtil.createToken(user.getUserId(), user.getRole());
        user.setPassword(null);
        return new AuthResult(token, user);
    }

    public AuthResult login(LoginRequest payload) {
        User user = userRepository.findByEmail(payload.getEmail()).orElse(null);
        if (user == null || user.getPassword() == null || !verifyPassword(payload.getPassword(), user.getPassword())) {
            throw new ApiException(401, "Invalid credentials");
        }
        String token = jwtUtil.createToken(user.getUserId(), user.getRole());
        user.setPassword(null);
        return new AuthResult(token, user);
    }

    /** Mirrors Python's /auth/session Google OAuth handler via Emergent's demo backend */
    public static class SessionResult {
        public User user;
        public String sessionToken;
        public String jwtToken;
    }

    public SessionResult processEmergentSession(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            throw new ApiException(400, "session_id required");
        }

        JsonNode data;
        try {
            String body = restClient.get()
                    .uri("https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data")
                    .header("X-Session-ID", sessionId)
                    .retrieve()
                    .body(String.class);
            data = objectMapper.readTree(body);
        } catch (Exception e) {
            throw new ApiException(401, "Invalid session");
        }

        String email = data.get("email").asText();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setUserId(newUserId());
            user.setName(data.has("name") ? data.get("name").asText() : email);
            user.setEmail(email);
            user.setPassword(null);
            user.setRole("buyer");
            user.setAvatar(data.has("picture") ? data.get("picture").asText() : "");
            user.setAuthType("google");
            user.setCreatedAt(Instant.now().toString());
            userRepository.save(user);
        }

        String sessionToken = data.get("session_token").asText();
        UserSession session = new UserSession();
        session.setUserId(user.getUserId());
        session.setSessionToken(sessionToken);
        session.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS).toString());
        session.setCreatedAt(Instant.now().toString());
        userSessionRepository.save(session);

        String jwtToken = jwtUtil.createToken(user.getUserId(), user.getRole());

        user.setPassword(null);
        SessionResult result = new SessionResult();
        result.user = user;
        result.sessionToken = sessionToken;
        result.jwtToken = jwtToken;
        return result;
    }

    public void logout(String sessionToken) {
        if (sessionToken != null) {
            userSessionRepository.deleteBySessionToken(sessionToken);
        }
    }
}
