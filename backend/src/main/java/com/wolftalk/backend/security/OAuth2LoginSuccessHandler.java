package com.wolftalk.backend.security;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.wolftalk.backend.entity.User;
import com.wolftalk.backend.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Extract email and name
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name"); // Google uses "name", Facebook also tends to use "name" or
                                                       // "first_name" + "last_name"

        // Determine provider (rudimentary check, can be improved by checking
        // AuthorizedClientService)
        // For simplicity, we assume the provider based on current request or
        // attributes?
        // A better way is to pass the provider in the authorization request or infer
        // from the issuer.
        // For now, let's treat it generically or check attributes.
        // Google usually has "sub", "email", "name". Facebook has "id", "email",
        // "name".

        if (email == null) {
            // Fallback or error
            // Try to get "sub" or "id" as identifier if email is missing
            System.err.println("OAuth2 Login: Email is null for provider. Attributes: " + oAuth2User.getAttributes());
            getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173/login?error=no_email");
            return;
        }

        // Check if user exists
        Optional<User> userOptional = userRepository.findByEmailIgnoreCase(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update existing user info if needed
            if (user.getProvider() == null) {
                user.setProvider("oauth2");
                userRepository.save(user); // Save update
            }
        } else {
            // Create new user
            user = new User();
            user.setEmail(email);
            if (name != null) {
                String[] parts = name.split(" ");
                if (parts.length > 0)
                    user.setFirstName(parts[0]);
                if (parts.length > 1)
                    user.setLastName(name.substring(parts[0].length()).trim());
            } else {
                user.setFirstName("User");
            }
            user.setProvider("oauth2");
            // Set dummy password to satisfy potential NOT NULL constraint in DB schema
            // if ddl-auto didn't update the column helper.
            user.setPassword("OAUTH2_SOCIAL_LOGIN_placeholder");
            user.setRoles("Learner"); // Default role
            user.setHasCompletedPlacementTest(false);
            userRepository.save(user);
        }

        // Generate JWT
        String token = jwtUtil.generateToken(user.getEmail());

        // Redirect to frontend with token
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/auth/callback")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
