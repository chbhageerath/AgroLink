package com.agrolink.backend.exception;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {
    private final int statusCode;

    public ApiException(int statusCode, String detail) {
        super(detail);
        this.statusCode = statusCode;
    }
}
