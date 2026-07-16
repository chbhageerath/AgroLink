package com.agrolink.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AIRequest {
    @NotBlank
    private String crop;

    private String region = "India";
    private String query = "";
}
