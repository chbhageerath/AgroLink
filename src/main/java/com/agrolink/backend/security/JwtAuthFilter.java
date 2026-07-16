package com.agrolink.backend.security;

import com.agrolink.backend.model.User;
import com.agrolink.backend.model.UserSession;
import com.agrolink.backend.repository.UserRepository;
import com.agrolink.backend.repository.UserSessionRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * Equivalent of Python's get_current_user() dependency in server.py.
 * Resolves the current user from either:
 *   1) an "Authorization: Bearer <jwt>" header, or
 *   2) a "session_token" cookie (Google OAuth flow)
 * and attaches it to the request as an attribute named "currentUser".
 * Does NOT block unauthenticated requests here - individual controllers
 * decide whether auth is required (matching FastAPI's per-route Depends()).
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    public static final String CURRENT_USER_ATTR = "currentUser";

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository, UserSessionRepository userSessionRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        User resolvedUser = null;

        // 1) Try Bearer token
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Claims claims = jwtUtil.verifyToken(token);
            if (claims != null) {
                String userId = claims.getSubject();
                resolvedUser = userRepository.findByUserId(userId).orElse(null);
            }
        }

        // 2) Fall back to session_token cookie (Google OAuth)
        if (resolvedUser == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("session_token".equals(cookie.getName())) {
                    UserSession session = userSessionRepository.findBySessionToken(cookie.getValue()).orElse(null);
                    if (session != null) {
                        Instant expiresAt = Instant.parse(session.getExpiresAt());
                        if (expiresAt.isAfter(Instant.now())) {
                            resolvedUser = userRepository.findByUserId(session.getUserId()).orElse(null);
                        }
                    }
                    break;
                }
            }
        }

        if (resolvedUser != null) {
            resolvedUser.setPassword(null); // never expose password hash, mirrors Python's projection {"password": 0}
            request.setAttribute(CURRENT_USER_ATTR, resolvedUser);
        }

        chain.doFilter(request, response);
    }
}
