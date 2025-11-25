package com.nasa.apod.service;

import com.nasa.apod.model.ApodResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NasaService {

    private final RestClient nasaRestClient;

    @Value("${nasa.api.key}")
    private String nasaApiKey;

    @Cacheable(value = "apodCache", key = "#params.toString()")
    public Object fetchNasaApod(Map<String, String> params) {
        log.info("Fetching from NASA API with params: {}", params);
        
        try {
            return nasaRestClient.get()
                    .uri(uriBuilder -> {
                        uriBuilder.queryParam("api_key", nasaApiKey);
                        params.forEach(uriBuilder::queryParam);
                        return uriBuilder.build();
                    })
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                        log.error("NASA API Client Error: {}", response.getStatusCode());
                        if (response.getStatusCode().value() == 404) {
                            throw new ResponseStatusException(response.getStatusCode(), "APOD not found for the specified date");
                        }
                        throw new ResponseStatusException(response.getStatusCode(), "Invalid request parameters");
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, (request, response) -> {
                         log.error("NASA API Server Error: {}", response.getStatusCode());
                         throw new ResponseStatusException(response.getStatusCode(), "NASA API error");
                    })
                    .body(Object.class); // Return generic object (Map or List) to handle both single object and list responses
        } catch (Exception e) {
            log.error("Error connecting to NASA API", e);
            throw new ResponseStatusException(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR, "Error connecting to NASA API: " + e.getMessage());
        }
    }
    
    public ApodResponse getTodayApod() {
        Object result = fetchNasaApod(Collections.emptyMap());
        return convertToApodResponse(result);
    }

    public ApodResponse getApodByDate(String date) {
        Object result = fetchNasaApod(Map.of("date", date));
        return convertToApodResponse(result);
    }
    
    @SuppressWarnings("unchecked")
    public List<ApodResponse> getRecentApods(String startDate, String endDate) {
         Object result = fetchNasaApod(Map.of("start_date", startDate, "end_date", endDate));
         return convertToListApodResponse(result);
    }
    
    @SuppressWarnings("unchecked")
    public List<ApodResponse> getRandomApods(int count) {
        Object result = fetchNasaApod(Map.of("count", String.valueOf(count)));
        return convertToListApodResponse(result);
    }
    
    private ApodResponse convertToApodResponse(Object result) {
        if (result instanceof Map) {
            return mapToApodResponse((Map<String, Object>) result);
        }
        throw new RuntimeException("Expected single APOD object, got " + result.getClass().getName());
    }
    
    @SuppressWarnings("unchecked")
    private List<ApodResponse> convertToListApodResponse(Object result) {
        if (result instanceof List) {
            return ((List<Map<String, Object>>) result).stream()
                    .map(this::mapToApodResponse)
                    .toList();
        } else if (result instanceof Map) {
            // Single object returned where list expected (edge case)
            return List.of(mapToApodResponse((Map<String, Object>) result));
        }
         throw new RuntimeException("Expected list of APOD objects");
    }

    private ApodResponse mapToApodResponse(Map<String, Object> map) {
        return ApodResponse.builder()
                .date((String) map.get("date"))
                .title((String) map.get("title"))
                .explanation((String) map.get("explanation"))
                .url((String) map.get("url"))
                .hdurl((String) map.get("hdurl"))
                .mediaType((String) map.get("media_type"))
                .copyright((String) map.get("copyright"))
                .serviceVersion((String) map.get("service_version"))
                .build();
    }
}

