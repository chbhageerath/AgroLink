package com.agrolink.backend.dto.product;

import lombok.Data;

import java.util.List;

@Data
public class ProductUpdateRequest {
    private String name;
    private String category;
    private Double price;
    private String unit;
    private Double quantity;
    private String description;
    private List<String> images;
    private String location;
    private String status;
}
