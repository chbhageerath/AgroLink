package com.agrolink.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Value("${app.cors.origins}")
    private String corsOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] origins = corsOrigins.split(",");
                registry.addMapping("/api/**")
                        .allowedOrigins(origins)
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(!corsOrigins.trim().equals("*"));
            }
        };
    }
}
