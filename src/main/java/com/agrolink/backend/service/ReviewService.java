package com.agrolink.backend.service;

import com.agrolink.backend.dto.review.ReviewCreateRequest;
import com.agrolink.backend.exception.ApiException;
import com.agrolink.backend.model.Product;
import com.agrolink.backend.model.Review;
import com.agrolink.backend.model.User;
import com.agrolink.backend.repository.ProductRepository;
import com.agrolink.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    private static String newReviewId() {
        return "rev_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    public Review create(ReviewCreateRequest payload, User user) {
        if (payload.getRating() < 1 || payload.getRating() > 5) {
            throw new ApiException(400, "Rating must be 1-5");
        }
        Review review = new Review();
        review.setReviewId(newReviewId());
        review.setProductId(payload.getProductId());
        review.setBuyerId(user.getUserId());
        review.setBuyerName(user.getName() != null ? user.getName() : "");
        review.setRating(payload.getRating());
        review.setComment(payload.getComment() != null ? payload.getComment() : "");
        review.setCreatedAt(Instant.now().toString());
        reviewRepository.save(review);

        // Recalculate product rating aggregate
        List<Review> allReviews = reviewRepository.findByProductId(payload.getProductId());
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0);
        Product product = productRepository.findByProductId(payload.getProductId()).orElse(null);
        if (product != null) {
            product.setRatingAvg(Math.round(avg * 100.0) / 100.0);
            product.setRatingCount(allReviews.size());
            productRepository.save(product);
        }
        return review;
    }

    public List<Review> list(String productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }
}
