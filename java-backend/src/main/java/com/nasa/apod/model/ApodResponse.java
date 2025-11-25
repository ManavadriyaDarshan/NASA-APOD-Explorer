package com.nasa.apod.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApodResponse {
    private String date;
    private String title;
    private String explanation;
    private String url;
    private String hdurl;
    
    @JsonProperty("media_type")
    private String mediaType;
    
    private String copyright;
    
    @JsonProperty("service_version")
    private String serviceVersion;
}

