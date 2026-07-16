package com.agrolink.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderStatusUpdateRequest {
    @NotBlank
    private String status; // pending, confirmed, shipped, delivered, cancelled
}
