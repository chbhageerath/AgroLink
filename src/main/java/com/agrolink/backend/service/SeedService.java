package com.agrolink.backend.service;

import com.agrolink.backend.model.Product;
import com.agrolink.backend.model.User;
import com.agrolink.backend.repository.ProductRepository;
import com.agrolink.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class SeedService {

    private static final Logger log = LoggerFactory.getLogger(SeedService.class);

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public SeedService(UserRepository userRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private record SeedUser(String name, String email, String password, String role, String location, String farmName) {}

    @PostConstruct
    public void seed() {
        List<SeedUser> seeds = List.of(
                new SeedUser("Ravi Farmer", "farmer@agrolink.com", "Farmer@123", "farmer", "Punjab", "Green Valley Farms"),
                new SeedUser("Anita Buyer", "buyer@agrolink.com", "Buyer@123", "buyer", "Delhi", ""),
                new SeedUser("Admin", "admin@agrolink.com", "Admin@123", "admin", "HQ", "")
        );

        for (SeedUser s : seeds) {
            if (userRepository.findByEmail(s.email()).isEmpty()) {
                User u = new User();
                u.setUserId("user_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
                u.setName(s.name());
                u.setEmail(s.email());
                u.setPassword(AuthService.hashPassword(s.password()));
                u.setRole(s.role());
                u.setLocation(s.location());
                u.setFarmName(s.farmName());
                u.setAuthType("password");
                u.setCreatedAt(Instant.now().toString());
                userRepository.save(u);
            }
        }

        User farmer = userRepository.findByEmail("farmer@agrolink.com").orElse(null);
        if (farmer != null && productRepository.findByFarmerIdOrderByCreatedAtDesc(farmer.getUserId()).isEmpty()) {
            record SampleProduct(String name, String category, double price, String unit, double quantity,
                                  String description, String image, String location) {}
            List<SampleProduct> samples = List.of(
                    new SampleProduct("Organic Wheat", "grains", 32, "kg", 500,
                            "Freshly harvested organic wheat, chemical-free.",
                            "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800", "Punjab"),
                    new SampleProduct("Red Apples", "fruits", 120, "kg", 200,
                            "Hand-picked Shimla apples, crisp and sweet.",
                            "https://images.unsplash.com/photo-1599275247787-40daab5777bc?w=800", "Himachal Pradesh"),
                    new SampleProduct("Fresh Radishes", "vegetables", 25, "kg", 100,
                            "Crunchy farm-fresh radishes.",
                            "https://images.unsplash.com/photo-1576072115035-5fe30e447e60?w=800", "Punjab"),
                    new SampleProduct("Toor Dal", "pulses", 140, "kg", 300,
                            "Premium quality toor dal, sun-dried and cleaned.",
                            "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800", "Maharashtra")
            );
            for (SampleProduct sp : samples) {
                Product p = new Product();
                p.setProductId("prod_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
                p.setFarmerId(farmer.getUserId());
                p.setFarmerName(farmer.getName());
                p.setFarmName(farmer.getFarmName());
                p.setName(sp.name());
                p.setCategory(sp.category());
                p.setPrice(sp.price());
                p.setUnit(sp.unit());
                p.setQuantity(sp.quantity());
                p.setDescription(sp.description());
                p.setImages(List.of(sp.image()));
                p.setLocation(sp.location());
                p.setStatus("active");
                p.setCreatedAt(Instant.now().toString());
                productRepository.save(p);
            }
        }
        log.info("Seed complete");
    }
}
