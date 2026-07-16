package com.agrolink.backend.controller;

import com.agrolink.backend.dto.order.OrderCreateRequest;
import com.agrolink.backend.dto.order.OrderStatusUpdateRequest;
import com.agrolink.backend.model.Order;
import com.agrolink.backend.model.User;
import com.agrolink.backend.security.AuthUtil;
import com.agrolink.backend.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final AuthUtil authUtil;

    public OrderController(OrderService orderService, AuthUtil authUtil) {
        this.orderService = orderService;
        this.authUtil = authUtil;
    }

    @PostMapping
    public Order create(@Valid @RequestBody OrderCreateRequest payload, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        authUtil.requireRole(user, Arrays.asList("buyer", "admin"));
        return orderService.create(payload, user);
    }

    @GetMapping
    public List<Order> list(HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        return orderService.list(user);
    }

    @GetMapping("/{orderId}")
    public Order get(@PathVariable String orderId, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        return orderService.get(orderId, user);
    }

    @PutMapping("/{orderId}/status")
    public Map<String, Object> updateStatus(@PathVariable String orderId, @Valid @RequestBody OrderStatusUpdateRequest payload, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        Order updated = orderService.updateStatus(orderId, payload, user);
        return Map.of("ok", true, "status", updated.getStatus());
    }
}
