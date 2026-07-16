package com.agrolink.backend.service;

import com.agrolink.backend.dto.order.OrderCreateRequest;
import com.agrolink.backend.dto.order.OrderStatusUpdateRequest;
import com.agrolink.backend.exception.ApiException;
import com.agrolink.backend.model.Order;
import com.agrolink.backend.model.Product;
import com.agrolink.backend.model.User;
import com.agrolink.backend.repository.OrderRepository;
import com.agrolink.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private static final List<String> VALID_STATUSES =
            Arrays.asList("pending", "confirmed", "shipped", "delivered", "cancelled");

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    private static String newOrderId() {
        return "ord_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    public Order create(OrderCreateRequest payload, User user) {
        Product product = productRepository.findByProductId(payload.getProductId())
                .orElseThrow(() -> new ApiException(404, "Product not found"));

        if (payload.getQuantity() > product.getQuantity()) {
            throw new ApiException(400, "Insufficient stock");
        }
        double total = Math.round(product.getPrice() * payload.getQuantity() * 100.0) / 100.0;

        Order order = new Order();
        order.setOrderId(newOrderId());
        order.setBuyerId(user.getUserId());
        order.setBuyerName(user.getName() != null ? user.getName() : "");
        order.setFarmerId(product.getFarmerId());
        order.setFarmerName(product.getFarmerName());
        order.setProductId(product.getProductId());
        order.setProductName(product.getName());
        order.setProductImage(product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "");
        order.setQuantity(payload.getQuantity());
        order.setUnit(product.getUnit());
        order.setPricePerUnit(product.getPrice());
        order.setTotalAmount(total);
        order.setDeliveryAddress(payload.getDeliveryAddress());
        order.setNotes(payload.getNotes() != null ? payload.getNotes() : "");
        order.setStatus("pending");
        order.setPaymentStatus("unpaid");
        order.setCreatedAt(Instant.now().toString());
        return orderRepository.save(order);
    }

    public List<Order> list(User user) {
        return switch (user.getRole()) {
            case "admin" -> orderRepository.findAllByOrderByCreatedAtDesc();
            case "farmer" -> orderRepository.findByFarmerIdOrderByCreatedAtDesc(user.getUserId());
            default -> orderRepository.findByBuyerIdOrderByCreatedAtDesc(user.getUserId());
        };
    }

    public Order get(String orderId, User user) {
        Order o = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ApiException(404, "Not found"));
        boolean isParty = user.getUserId().equals(o.getBuyerId()) || user.getUserId().equals(o.getFarmerId());
        if (!"admin".equals(user.getRole()) && !isParty) {
            throw new ApiException(403, "Forbidden");
        }
        return o;
    }

    public Order updateStatus(String orderId, OrderStatusUpdateRequest payload, User user) {
        Order o = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ApiException(404, "Not found"));
        if (!"admin".equals(user.getRole()) && !user.getUserId().equals(o.getFarmerId())) {
            throw new ApiException(403, "Only farmer can update status");
        }
        if (!VALID_STATUSES.contains(payload.getStatus())) {
            throw new ApiException(400, "Invalid status");
        }
        o.setStatus(payload.getStatus());
        orderRepository.save(o);
        return o;
    }
}
