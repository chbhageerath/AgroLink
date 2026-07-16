package com.agrolink.backend.controller;

import com.agrolink.backend.dto.review.ReviewCreateRequest;
import com.agrolink.backend.model.Review;
import com.agrolink.backend.model.User;
import com.agrolink.backend.security.AuthUtil;
import com.agrolink.backend.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthUtil authUtil;

    public ReviewController(ReviewService reviewService, AuthUtil authUtil) {
        this.reviewService = reviewService;
        this.authUtil = authUtil;
    }

    @PostMapping
    public Review create(@Valid @RequestBody ReviewCreateRequest payload, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        authUtil.requireRole(user, Arrays.asList("buyer", "admin"));
        return reviewService.create(payload, user);
    }

    @GetMapping("/{productId}")
    public List<Review> list(@PathVariable String productId) {
        return reviewService.list(productId);
    }
}
