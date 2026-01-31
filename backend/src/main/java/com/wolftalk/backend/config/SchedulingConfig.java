package com.wolftalk.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration cho Scheduled Tasks
 * Bật Spring Scheduling để chạy các task định kỳ
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
    // Scheduling được bật - các @Scheduled methods sẽ được chạy
}
