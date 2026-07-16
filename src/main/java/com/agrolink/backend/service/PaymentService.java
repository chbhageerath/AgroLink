package com.agrolink.backend.service;

import com.agrolink.backend.exception.ApiException;
import com.agrolink.backend.model.Order;
import com.agrolink.backend.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Value("${app.razorpay.key-id}")
    private String keyId;

    @Value("${app.razorpay.key-secret}")
    private String keySecret;

    private final OrderRepository orderRepository;

    public PaymentService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    private boolean isMockMode() {
        return keySecret == null || keySecret.isBlank() || keySecret.contains("placeholder");
    }

    /** Mirrors POST /api/payments/create-order */
    public Map<String, Object> createOrder(double amount, String internalOrderId) {
        long amountPaise = Math.round(amount * 100);

        if (isMockMode()) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("id", "order_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
            resp.put("amount", amountPaise);
            resp.put("currency", "INR");
            resp.put("key_id", keyId);
            resp.put("mock", true);
            return resp;
        }

        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", internalOrderId);
            com.razorpay.Order rzpOrder = client.orders.create(orderRequest);

            Map<String, Object> resp = new HashMap<>();
            for (String key : rzpOrder.toJson().keySet()) {
                resp.put(key, rzpOrder.toJson().get(key));
            }
            resp.put("key_id", keyId);
            resp.put("mock", false);
            return resp;
        } catch (RazorpayException e) {
            throw new ApiException(500, "Payment gateway error");
        }
    }

    /** Mirrors POST /api/payments/verify */
    public Map<String, Object> verify(Map<String, Object> data) {
        String orderId = (String) data.get("order_id");
        boolean mock = Boolean.TRUE.equals(data.get("mock"));

        if (mock || isMockMode()) {
            Order order = orderRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new ApiException(404, "Order not found"));
            order.setPaymentStatus("paid");
            order.setStatus("confirmed");
            orderRepository.save(order);
            return Map.of("status", "success", "mock", true);
        }

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", data.get("razorpay_order_id"));
            options.put("razorpay_payment_id", data.get("razorpay_payment_id"));
            options.put("razorpay_signature", data.get("razorpay_signature"));

            boolean valid = Utils.verifyPaymentSignature(options, keySecret);
            if (!valid) {
                throw new ApiException(400, "Payment verification failed");
            }

            Order order = orderRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new ApiException(404, "Order not found"));
            order.setPaymentStatus("paid");
            order.setStatus("confirmed");
            order.setRazorpayPaymentId((String) data.get("razorpay_payment_id"));
            orderRepository.save(order);
            return Map.of("status", "success");
        } catch (RazorpayException e) {
            throw new ApiException(400, "Payment verification failed");
        }
    }
}
