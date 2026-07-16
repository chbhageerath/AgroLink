package com.agrolink.backend.dto.message;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageCreateRequest {
    @NotBlank
    private String receiverId;

    private String productId;

    @NotBlank
    private String content;
}
