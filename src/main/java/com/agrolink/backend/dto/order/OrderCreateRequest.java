package com.agrolink.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderCreateRequest {
    @NotBlank
    private String productId;

    @NotNull
    private Double quantity;

    @NotBlank
    private String deliveryAddress;

    private String notes = "";
}
