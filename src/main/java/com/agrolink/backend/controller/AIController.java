package com.agrolink.backend.controller;

import com.agrolink.backend.dto.AIRequest;
import com.agrolink.backend.security.AuthUtil;
import com.agrolink.backend.service.AIService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;
    private final AuthUtil authUtil;

    public AIController(AIService aiService, AuthUtil authUtil) {
        this.aiService = aiService;
        this.authUtil = authUtil;
    }

    @PostMapping("/recommend")
    public Map<String, Object> recommend(@Valid @RequestBody AIRequest payload, HttpServletRequest request) {
        authUtil.requireUser(request);
        return aiService.recommend(payload);
    }
}
