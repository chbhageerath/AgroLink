package com.agrolink.backend.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProductCreateRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String category;

    @NotNull
    private Double price;

    @NotBlank
    private String unit;

    @NotNull
    private Double quantity;

    private String description = "";
    private List<String> images = new ArrayList<>();
    private String location = "";
}
