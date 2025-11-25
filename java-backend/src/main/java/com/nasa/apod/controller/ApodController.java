package com.nasa.apod.controller;

import com.nasa.apod.model.ApodResponse;
import com.nasa.apod.service.NasaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/apod")
@RequiredArgsConstructor
public class ApodController {

    private final NasaService nasaService;

    @GetMapping("/today")
    public ApodResponse getTodayApod() {
        return nasaService.getTodayApod();
    }

    @GetMapping("/by-date")
    public ApodResponse getApodByDate(@RequestParam String date) {
        // Simple validation or rely on service
        return nasaService.getApodByDate(date);
    }

    @GetMapping("/recent")
    public List<ApodResponse> getRecentApods(@RequestParam(defaultValue = "7") int days) {
        if (days < 1 || days > 30) {
             throw new IllegalArgumentException("Days must be between 1 and 30");
        }
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return nasaService.getRecentApods(startDate.format(formatter), endDate.format(formatter));
    }

    @GetMapping("/random")
    public List<ApodResponse> getRandomApods(@RequestParam(defaultValue = "5") int count) {
        if (count < 1 || count > 20) {
            throw new IllegalArgumentException("Count must be between 1 and 20");
        }
        return nasaService.getRandomApods(count);
    }
}

