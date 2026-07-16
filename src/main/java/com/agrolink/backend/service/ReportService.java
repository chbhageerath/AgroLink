package com.agrolink.backend.service;

import com.agrolink.backend.model.Order;
import com.agrolink.backend.model.Product;
import com.agrolink.backend.model.User;
import com.agrolink.backend.repository.OrderRepository;
import com.agrolink.backend.repository.ProductRepository;
import com.agrolink.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReportService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private static Map<String, Integer> countBy(List<Order> orders) {
        Map<String, Integer> counts = new HashMap<>();
        for (Order o : orders) {
            String key = o.getStatus() != null ? o.getStatus() : "unknown";
            counts.merge(key, 1, Integer::sum);
        }
        return counts;
    }

    public Map<String, Object> summary(User user) {
        Map<String, Object> result = new HashMap<>();

        switch (user.getRole()) {
            case "farmer" -> {
                List<Order> orders = orderRepository.findByFarmerIdOrderByCreatedAtDesc(user.getUserId());
                List<Product> products = productRepository.findByFarmerIdOrderByCreatedAtDesc(user.getUserId());
                double totalRevenue = orders.stream().filter(o -> "paid".equals(o.getPaymentStatus())).mapToDouble(Order::getTotalAmount).sum();
                double pendingRevenue = orders.stream().filter(o -> !"paid".equals(o.getPaymentStatus())).mapToDouble(Order::getTotalAmount).sum();

                result.put("total_orders", orders.size());
                result.put("total_products", products.size());
                result.put("total_revenue", Math.round(totalRevenue * 100.0) / 100.0);
                result.put("pending_revenue", Math.round(pendingRevenue * 100.0) / 100.0);
                result.put("orders_by_status", countBy(orders));
                result.put("recent_orders", orders.stream().limit(5).toList());
            }
            case "buyer" -> {
                List<Order> orders = orderRepository.findByBuyerIdOrderByCreatedAtDesc(user.getUserId());
                double totalSpend = orders.stream().mapToDouble(Order::getTotalAmount).sum();

                result.put("total_orders", orders.size());
                result.put("total_spend", Math.round(totalSpend * 100.0) / 100.0);
                result.put("orders_by_status", countBy(orders));
                result.put("recent_orders", orders.stream().limit(5).toList());
            }
            default -> { // admin
                long usersCount = userRepository.count();
                long productsCount = productRepository.count();
                List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
                double gmv = orders.stream().mapToDouble(Order::getTotalAmount).sum();

                result.put("total_users", usersCount);
                result.put("total_products", productsCount);
                result.put("total_orders", orders.size());
                result.put("gmv", Math.round(gmv * 100.0) / 100.0);
                result.put("orders_by_status", countBy(orders));
            }
        }
        return result;
    }
}
