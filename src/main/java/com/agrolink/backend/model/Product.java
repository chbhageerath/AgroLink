package com.agrolink.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    private String productId;

    private String farmerId;
    private String farmerName;
    private String farmName;
    private String name;
    private String category;
    private double price;
    private String unit;
    private double quantity;

    @Column(length = 2000)
    private String description = "";

    // MySQL has no native array/list column, so images are stored in a separate linked table
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    @OrderColumn(name = "image_order")
    private List<String> images = new ArrayList<>();

    private String location = "";
    private String status = "active";
    private double ratingAvg = 0;
    private int ratingCount = 0;
    private String createdAt = Instant.now().toString();
}