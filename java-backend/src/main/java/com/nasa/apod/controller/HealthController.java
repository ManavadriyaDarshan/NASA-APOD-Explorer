package com.nasa.apod.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Value("${nasa.api.key}")
    private String nasaApiKey;

    @GetMapping
    public Map<String, Object> healthCheck() {
        boolean isConfigured = !"DEMO_KEY".equals(nasaApiKey);
        return Map.of("status", "healthy", "nasa_api_key_configured", isConfigured);
    }
}

