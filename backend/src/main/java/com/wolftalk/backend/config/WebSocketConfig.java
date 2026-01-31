package com.wolftalk.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Cấu hình message broker cho WebSocket
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Tiền tố cho các topic mà client subscribe
        config.enableSimpleBroker("/topic");
        
        // Tiền tố cho các endpoint mà client gửi tin nhắn
        config.setApplicationDestinationPrefixes("/app");
        
        // Tiền tố cho tin nhắn user-specific
        config.setUserDestinationPrefix("/user");
    }

    /**
     * Cấu hình STOMP endpoints
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint để client kết nối WebSocket
        registry.addEndpoint("/ws-chat")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}
