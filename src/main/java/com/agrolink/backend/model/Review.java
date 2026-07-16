package com.agrolink.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    private String reviewId;

    private String productId;
    private String buyerId;
    private String buyerName;
    private int rating; // 1-5

    @Column(length = 2000)
    private String comment = "";

    private String createdAt = Instant.now().toString();
}
