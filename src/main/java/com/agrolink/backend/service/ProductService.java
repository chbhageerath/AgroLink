package com.agrolink.backend.service;

import com.agrolink.backend.dto.product.ProductCreateRequest;
import com.agrolink.backend.dto.product.ProductUpdateRequest;
import com.agrolink.backend.exception.ApiException;
import com.agrolink.backend.model.Product;
import com.agrolink.backend.model.User;
import com.agrolink.backend.repository.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    private static String newProductId() {
        return "prod_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    public Product create(ProductCreateRequest payload, User user) {
        Product p = new Product();
        p.setProductId(newProductId());
        p.setFarmerId(user.getUserId());
        p.setFarmerName(user.getName() != null ? user.getName() : "");
        p.setFarmName(user.getFarmName() != null ? user.getFarmName() : "");
        p.setName(payload.getName());
        p.setCategory(payload.getCategory());
        p.setPrice(payload.getPrice());
        p.setUnit(payload.getUnit());
        p.setQuantity(payload.getQuantity());
        p.setDescription(payload.getDescription() != null ? payload.getDescription() : "");
        p.setImages(payload.getImages());
        p.setLocation(payload.getLocation() != null ? payload.getLocation() : "");
        p.setStatus("active");
        p.setRatingAvg(0);
        p.setRatingCount(0);
        p.setCreatedAt(Instant.now().toString());
        return productRepository.save(p);
    }

    public List<Product> list(String category, String search, String farmerId, int limit) {
        Pageable pageable = PageRequest.of(0, Math.max(limit, 1));
        // Blank strings must become null so the "IS NULL OR ..." JPQL pattern works correctly
        String cat = (category == null || category.isBlank()) ? null : category;
        String fid = (farmerId == null || farmerId.isBlank()) ? null : farmerId;
        String s = (search == null || search.isBlank()) ? null : search;
        return productRepository.search(cat, fid, s, pageable);
    }

    public List<Product> myProducts(String farmerId) {
        return productRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
    }

    public Product getByProductId(String productId) {
        return productRepository.findByProductId(productId)
                .orElseThrow(() -> new ApiException(404, "Not found"));
    }

    public Product update(String productId, ProductUpdateRequest payload, User user) {
        Product p = getByProductId(productId);
        if (!p.getFarmerId().equals(user.getUserId()) && !"admin".equals(user.getRole())) {
            throw new ApiException(403, "Forbidden");
        }
        if (payload.getName() != null) p.setName(payload.getName());
        if (payload.getCategory() != null) p.setCategory(payload.getCategory());
        if (payload.getPrice() != null) p.setPrice(payload.getPrice());
        if (payload.getUnit() != null) p.setUnit(payload.getUnit());
        if (payload.getQuantity() != null) p.setQuantity(payload.getQuantity());
        if (payload.getDescription() != null) p.setDescription(payload.getDescription());
        if (payload.getImages() != null) p.setImages(payload.getImages());
        if (payload.getLocation() != null) p.setLocation(payload.getLocation());
        if (payload.getStatus() != null) p.setStatus(payload.getStatus());
        return productRepository.save(p);
    }

    public void delete(String productId, User user) {
        Product p = getByProductId(productId);
        if (!p.getFarmerId().equals(user.getUserId()) && !"admin".equals(user.getRole())) {
            throw new ApiException(403, "Forbidden");
        }
        productRepository.deleteByProductId(productId);
    }
}
