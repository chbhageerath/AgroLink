package com.agrolink.backend.dto.review;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewCreateRequest {
    @NotBlank
    private String productId;

    @NotNull
    private Integer rating; // 1-5

    private String comment = "";
}
