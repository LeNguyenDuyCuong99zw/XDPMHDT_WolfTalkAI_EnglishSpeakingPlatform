package com.wolftalk.microservices.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service Routes
                .route("auth-service", r -> r
                        .path("/api/v1/auth/**")
                        .uri("lb://auth-service"))
                
                // Legacy Backend Auth Routes (NO JWT - public access for login/register)
                .route("legacy-auth", r -> r
                        .path("/api/auth/**")
                        .uri("http://localhost:8080"))
                
                // User Service Routes
                .route("user-service", r -> r
                        .path("/api/v1/users/**")
                        .uri("lb://user-service"))
                
                // AI Learning Service Routes (validates JWT itself like legacy backend)
                .route("ai-learning-service", r -> r
                        .path("/api/v1/ai/**")
                        .uri("lb://AI-LEARNING-SERVICE"))
                
                // Conversation Service Routes
                .route("conversation-service", r -> r
                        .path("/api/v1/conversations/**")
                        .filters(f -> f.filter(new JwtAuthenticationFilter()))
                        .uri("lb://conversation-service"))
                
                // Progress Tracking Service Routes
                .route("progress-tracking-service", r -> r
                        .path("/api/v1/progress/**")
                        .filters(f -> f.filter(new JwtAuthenticationFilter()))
                        .uri("lb://progress-tracking-service"))
                
                // Legacy Backend Routes
                .route("legacy-backend", r -> r
                        .path("/api/legacy/**")
                        .filters(f -> f.rewritePath("/api/legacy/(?<segment>.*)", "/${segment}"))
                        .uri("http://localhost:8080"))
                
                .build();
    }
}
