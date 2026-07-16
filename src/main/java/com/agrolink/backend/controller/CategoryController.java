package com.agrolink.backend.controller;

import com.agrolink.backend.dto.CategoryDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private static final List<CategoryDto> CATEGORIES = List.of(
            new CategoryDto("vegetables", "Vegetables", "leaf"),
            new CategoryDto("fruits", "Fruits", "apple"),
            new CategoryDto("grains", "Grains & Cereals", "wheat"),
            new CategoryDto("pulses", "Pulses & Legumes", "bean"),
            new CategoryDto("dairy", "Dairy", "milk"),
            new CategoryDto("spices", "Spices & Herbs", "pepper"),
            new CategoryDto("flowers", "Flowers", "flower"),
            new CategoryDto("livestock", "Livestock", "cow")
    );

    @GetMapping
    public List<CategoryDto> getCategories() {
        return CATEGORIES;
    }
}
