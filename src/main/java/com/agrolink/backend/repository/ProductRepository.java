package com.agrolink.backend.repository;

import com.agrolink.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findByProductId(String productId); // productId IS the @Id
    List<Product> findByFarmerIdOrderByCreatedAtDesc(String farmerId);
    void deleteByProductId(String productId);

    @Query("SELECT p FROM Product p WHERE p.status = 'active' " +
           "AND (:category IS NULL OR p.category = :category) " +
           "AND (:farmerId IS NULL OR p.farmerId = :farmerId) " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY p.createdAt DESC")
    List<Product> search(@Param("category") String category,
                          @Param("farmerId") String farmerId,
                          @Param("search") String search,
                          org.springframework.data.domain.Pageable pageable);
}
