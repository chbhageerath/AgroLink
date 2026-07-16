package com.agrolink.backend.repository;

import com.agrolink.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByProductIdOrderByCreatedAtDesc(String productId);
    List<Review> findByProductId(String productId);
}
