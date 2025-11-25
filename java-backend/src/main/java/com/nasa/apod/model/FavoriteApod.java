package com.nasa.apod.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteApod {
    private String id;
    private String date;
    private String title;
    private String url;
    private String hdurl;
    private String mediaType;
    private LocalDateTime timestamp;
}
