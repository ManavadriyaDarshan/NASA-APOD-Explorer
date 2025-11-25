package com.nasa.apod.service;

import com.nasa.apod.model.FavoriteApod;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    
    // Using a Map for O(1) lookups by date, assuming date is unique for favorites
    private final Map<String, FavoriteApod> favorites = new ConcurrentHashMap<>();

    public List<FavoriteApod> getAllFavorites() {
        return favorites.values().stream()
                .sorted((a, b) -> {
                    if (a.getTimestamp() == null || b.getTimestamp() == null) return 0;
                    return b.getTimestamp().compareTo(a.getTimestamp());
                })
                .collect(Collectors.toList());
    }

    public boolean existsByDate(String date) {
        return favorites.containsKey(date);
    }

    public FavoriteApod addFavorite(FavoriteApod favorite) {
        if (favorite.getId() == null) {
            favorite.setId(UUID.randomUUID().toString());
        }
        if (favorite.getTimestamp() == null) {
            favorite.setTimestamp(LocalDateTime.now());
        }
        favorites.put(favorite.getDate(), favorite);
        return favorite;
    }

    public boolean removeFavorite(String date) {
        return favorites.remove(date) != null;
    }
}

