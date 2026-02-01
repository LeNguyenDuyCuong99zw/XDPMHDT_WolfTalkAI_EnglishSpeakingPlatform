package com.wolftalk.microservices.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@EnableCaching
public class AiLearningServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(AiLearningServiceApplication.class, args);
    }
}
