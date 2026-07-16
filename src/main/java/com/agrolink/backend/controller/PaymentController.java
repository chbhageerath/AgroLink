package com.agrolink.backend.controller;

import com.agrolink.backend.dto.payment.RazorpayOrderCreateRequest;
import com.agrolink.backend.security.AuthUtil;
import com.agrolink.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final AuthUtil authUtil;

    public PaymentController(PaymentService paymentService, AuthUtil authUtil) {
        this.paymentService = paymentService;
        this.authUtil = authUtil;
    }

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@Valid @RequestBody RazorpayOrderCreateRequest payload, HttpServletRequest request) {
        authUtil.requireUser(request);
        return paymentService.createOrder(payload.getAmount(), payload.getOrderId());
    }

    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody Map<String, Object> data, HttpServletRequest request) {
        authUtil.requireUser(request);
        return paymentService.verify(data);
    }
}
