package com.example.shopping.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "kdniao")
public class KdniaoProperties {
    private String businessId;
    private String apiKey;
    private String url;
    private int connectTimeout = 5000;
    private int readTimeout = 5000;
}