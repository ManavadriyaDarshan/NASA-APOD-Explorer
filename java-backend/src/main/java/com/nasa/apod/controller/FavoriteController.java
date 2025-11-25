package com.nasa.apod.controller;

import com.nasa.apod.model.FavoriteApod;
import com.nasa.apod.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public List<FavoriteApod> getFavorites() {
        return favoriteService.getAllFavorites();
    }

    @PostMapping
    public FavoriteApod addFavorite(@RequestBody FavoriteApod favorite) {
        if (favoriteService.existsByDate(favorite.getDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This APOD is already in favorites");
        }
        return favoriteService.addFavorite(favorite);
    }

    @DeleteMapping("/{date}")
    public ResponseEntity<?> removeFavorite(@PathVariable String date) {
        boolean removed = favoriteService.removeFavorite(date);
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorite not found");
        }
        return ResponseEntity.ok(Map.of("message", "Favorite removed successfully"));
    }

    @GetMapping("/check/{date}")
    public Map<String, Boolean> checkFavorite(@PathVariable String date) {
        boolean isFavorite = favoriteService.existsByDate(date);
        return Map.of("is_favorite", isFavorite);
    }
}
