package com.nasa.apod.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig {

    @Value("${nasa.api.base-url:https://api.nasa.gov/planetary/apod}")
    private String nasaApiBaseUrl;
    
    @Value("${cors.allowed-origins:*}")
    private String allowedOrigins;

    @Bean
    public RestClient nasaRestClient() {
        return RestClient.builder()
                .baseUrl(nasaApiBaseUrl)
                .build();
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins.split(","))
                        .allowedMethods("*")
                        .allowedHeaders("*");
            }
        };
    }
}

