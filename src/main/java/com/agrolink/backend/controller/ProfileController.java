package com.agrolink.backend.controller;

import com.agrolink.backend.dto.auth.ProfileUpdateRequest;
import com.agrolink.backend.model.User;
import com.agrolink.backend.repository.UserRepository;
import com.agrolink.backend.security.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final AuthUtil authUtil;
    private final UserRepository userRepository;

    public ProfileController(AuthUtil authUtil, UserRepository userRepository) {
        this.authUtil = authUtil;
        this.userRepository = userRepository;
    }

    @PutMapping
    public User updateProfile(@RequestBody ProfileUpdateRequest payload, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        User dbUser = userRepository.findByUserId(user.getUserId()).orElseThrow();

        // Only apply non-null fields, matching Python's exclude-none update logic
        if (payload.getName() != null) dbUser.setName(payload.getName());
        if (payload.getPhone() != null) dbUser.setPhone(payload.getPhone());
        if (payload.getLocation() != null) dbUser.setLocation(payload.getLocation());
        if (payload.getBio() != null) dbUser.setBio(payload.getBio());
        if (payload.getFarmName() != null) dbUser.setFarmName(payload.getFarmName());
        if (payload.getAvatar() != null) dbUser.setAvatar(payload.getAvatar());

        userRepository.save(dbUser);
        dbUser.setPassword(null);
        return dbUser;
    }
}
