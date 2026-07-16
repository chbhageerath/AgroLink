package com.agrolink.backend.dto.auth;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    // All nullable/optional - only non-null fields get updated (matches Python's exclude-none logic)
    private String name;
    private String phone;
    private String location;
    private String bio;
    private String farmName;
    private String avatar;
}
