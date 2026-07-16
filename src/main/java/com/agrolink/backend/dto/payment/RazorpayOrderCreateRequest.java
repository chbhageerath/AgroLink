package com.agrolink.backend.dto.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RazorpayOrderCreateRequest {
    @NotNull
    private Double amount; // in INR

    @NotBlank
    private String orderId; // our internal order id
}
