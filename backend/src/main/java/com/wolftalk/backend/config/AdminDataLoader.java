package com.wolftalk.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.UserRepository;

@Configuration
public class AdminDataLoader {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner loadAdminData() {
        return args -> {
            // Check if admin already exists
            boolean adminExists = userRepository.existsByEmail("admin@wolftalk.com");
            
            if (!adminExists) {
                // Create admin user
                User admin = new User();
                admin.setEmail("admin@wolftalk.com");
                admin.setPassword(passwordEncoder.encode("Admin@123456")); // Change in production!
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setRoles("ROLE_ADMIN");
                admin.setLearningLanguage("en");
                admin.setHasCompletedPlacementTest(true);
                admin.setIsFirstLogin(false);
                
                userRepository.save(admin);
                System.out.println("✅ Admin user created: admin@wolftalk.com / Admin@123456");
            } else {
                System.out.println("✅ Admin user already exists");
            }

            // Create mentor user (optional)
            boolean mentorExists = userRepository.existsByEmail("mentor@wolftalk.com");
            if (!mentorExists) {
                User mentor = new User();
                mentor.setEmail("mentor@wolftalk.com");
                mentor.setPassword(passwordEncoder.encode("Mentor@123456")); // Change in production!
                mentor.setFirstName("Mentor");
                mentor.setLastName("User");
                mentor.setRoles("ROLE_MENTOR");
                mentor.setLearningLanguage("en");
                mentor.setHasCompletedPlacementTest(true);
                mentor.setIsFirstLogin(false);
                
                userRepository.save(mentor);
                System.out.println("✅ Mentor user created: mentor@wolftalk.com / Mentor@123456");
            }
        };
    }
}
