package com.agrolink.backend.controller;

import com.agrolink.backend.dto.auth.LoginRequest;
import com.agrolink.backend.dto.auth.RegisterRequest;
import com.agrolink.backend.model.User;
import com.agrolink.backend.security.AuthUtil;
import com.agrolink.backend.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthUtil authUtil;

    public AuthController(AuthService authService, AuthUtil authUtil) {
        this.authService = authService;
        this.authUtil = authUtil;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@Valid @RequestBody RegisterRequest payload) {
        AuthService.AuthResult result = authService.register(payload);
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", result.token());
        resp.put("user", result.user());
        return resp;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest payload) {
        AuthService.AuthResult result = authService.login(payload);
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", result.token());
        resp.put("user", result.user());
        return resp;
    }

    @PostMapping("/session")
    public Map<String, Object> emergentSession(@RequestBody Map<String, String> body, HttpServletResponse response) {
        String sessionId = body.get("session_id");
        AuthService.SessionResult result = authService.processEmergentSession(sessionId);

        Cookie cookie = new Cookie("session_token", result.sessionToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        cookie.setAttribute("SameSite", "None");
        response.addCookie(cookie);

        Map<String, Object> resp = new HashMap<>();
        resp.put("user", result.user);
        resp.put("session_token", result.sessionToken);
        resp.put("token", result.jwtToken);
        return resp;
    }

    @GetMapping("/me")
    public User me(HttpServletRequest request) {
        return authUtil.requireUser(request);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpServletRequest request, HttpServletResponse response) {
        String sessionToken = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("session_token".equals(c.getName())) {
                    sessionToken = c.getValue();
                }
            }
        }
        authService.logout(sessionToken);

        Cookie cookie = new Cookie("session_token", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        Map<String, Object> resp = new HashMap<>();
        resp.put("ok", true);
        return resp;
    }
}
