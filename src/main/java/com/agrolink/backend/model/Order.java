package com.agrolink.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    private String orderId;

    private String buyerId;
    private String buyerName;
    private String farmerId;
    private String farmerName;
    private String productId;
    private String productName;

    @Column(columnDefinition = "LONGTEXT")
    private String productImage;

    private double quantity;
    private String unit;
    private double pricePerUnit;
    private double totalAmount;

    @Column(length = 1000)
    private String deliveryAddress;

    @Column(length = 1000)
    private String notes = "";

    private String status = "pending"; // pending, confirmed, shipped, delivered, cancelled
    private String paymentStatus = "unpaid"; // unpaid, paid
    private String razorpayPaymentId;
    private String createdAt = Instant.now().toString();
}