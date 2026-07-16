package com.agrolink.backend.controller;

import com.agrolink.backend.dto.product.ProductCreateRequest;
import com.agrolink.backend.dto.product.ProductUpdateRequest;
import com.agrolink.backend.model.Product;
import com.agrolink.backend.model.User;
import com.agrolink.backend.security.AuthUtil;
import com.agrolink.backend.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final AuthUtil authUtil;

    public ProductController(ProductService productService, AuthUtil authUtil) {
        this.productService = productService;
        this.authUtil = authUtil;
    }

    @PostMapping
    public Product create(@Valid @RequestBody ProductCreateRequest payload, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        authUtil.requireRole(user, Arrays.asList("farmer", "admin"));
        return productService.create(payload, user);
    }

    @GetMapping
    public List<Product> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(name = "farmer_id", required = false) String farmerId,
            @RequestParam(defaultValue = "100") int limit
    ) {
        return productService.list(category, search, farmerId, limit);
    }

    @GetMapping("/mine")
    public List<Product> mine(HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        return productService.myProducts(user.getUserId());
    }

    @GetMapping("/{productId}")
    public Product get(@PathVariable String productId) {
        return productService.getByProductId(productId);
    }

    @PutMapping("/{productId}")
    public Product update(@PathVariable String productId, @RequestBody ProductUpdateRequest payload, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        return productService.update(productId, payload, user);
    }

    @DeleteMapping("/{productId}")
    public Map<String, Boolean> delete(@PathVariable String productId, HttpServletRequest request) {
        User user = authUtil.requireUser(request);
        productService.delete(productId, user);
        return Map.of("ok", true);
    }
}
