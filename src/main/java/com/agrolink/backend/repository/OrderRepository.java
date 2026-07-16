package com.agrolink.backend.repository;

import com.agrolink.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findByOrderId(String orderId); // orderId IS the @Id
    List<Order> findByFarmerIdOrderByCreatedAtDesc(String farmerId);
    List<Order> findByBuyerIdOrderByCreatedAtDesc(String buyerId);
    List<Order> findAllByOrderByCreatedAtDesc();
}
