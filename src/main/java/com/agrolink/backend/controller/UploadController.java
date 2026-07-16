package com.agrolink.backend.controller;

import com.agrolink.backend.exception.ApiException;
import com.agrolink.backend.security.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private static final long MAX_SIZE = 5L * 1024 * 1024; // 5MB, matches Python

    private final AuthUtil authUtil;

    public UploadController(AuthUtil authUtil) {
        this.authUtil = authUtil;
    }

    @PostMapping
    public Map<String, String> upload(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        authUtil.requireUser(request); // auth required, matches Python's Depends(get_current_user)

        if (file.getSize() > MAX_SIZE) {
            throw new ApiException(400, "File too large (max 5MB)");
        }
        try {
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());
            String dataUrl = "data:" + file.getContentType() + ";base64," + base64;
            return Map.of("url", dataUrl);
        } catch (IOException e) {
            throw new ApiException(500, "Failed to read file");
        }
    }
}
