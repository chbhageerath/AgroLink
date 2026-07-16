package com.agrolink.backend.controller;

import com.agrolink.backend.model.User;
import com.agrolink.backend.repository.UserRepository;
import com.agrolink.backend.security.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
public class AdminController {

    private final AuthUtil authUtil;
    private final UserRepository userRepository;

    public AdminController(AuthUtil authUtil, UserRepository userRepository) {
        this.authUtil = authUtil;
        this.userRepository = userRepository;
    }

    @GetMapping("/api/admin/users")
    public List<User> adminUsers(HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        authUtil.requireRole(user, Arrays.asList("admin"));
        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setPassword(null));
        return users;
    }

    @GetMapping("/api/")
    public Map<String, String> root() {
        return Map.of("message", "AgroLink API", "status", "ok");
    }
}
