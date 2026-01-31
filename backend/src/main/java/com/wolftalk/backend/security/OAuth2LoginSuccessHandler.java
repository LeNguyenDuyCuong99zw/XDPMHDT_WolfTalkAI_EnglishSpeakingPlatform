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

        // Better way to get provider info
        String provider = "oauth2";
        if (authentication instanceof org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) {
            provider = ((org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) authentication)
                    .getAuthorizedClientRegistrationId();
        }

        // Extract attributes
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = null;
        String providerId = oAuth2User.getAttribute("sub"); // Google

        if (provider.equals("google")) {
            picture = oAuth2User.getAttribute("picture");
        } else if (provider.equals("facebook")) {
            providerId = oAuth2User.getAttribute("id");
            // Facebook picture is usually nested, but let's try to get simple one or skip
            // for now
            // Detailed FB picture extraction needs more complex mapping
        }

        if (email == null) {
            System.err.println(
                    "OAuth2 Login: Email is null for " + provider + ". Attributes: " + oAuth2User.getAttributes());
            getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173/login?error=no_email");
            return;
        }

        // Check if user exists
        Optional<User> userOptional = userRepository.findByEmailIgnoreCase(email);
        User user;
        boolean isBrandNew = false;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update provider info if not set
            if (user.getProvider() == null || user.getProvider().equals("oauth2")) {
                user.setProvider(provider);
            }
            if (user.getProviderId() == null) {
                user.setProviderId(providerId);
            }
            if (user.getAvatar() == null && picture != null) {
                user.setAvatar(picture);
            }
            userRepository.save(user);
        } else {
            // Create new user
            isBrandNew = true;
            user = new User();
            user.setEmail(email);
            user.setProvider(provider);
            user.setProviderId(providerId);
            user.setAvatar(picture);

            if (name != null) {
                String[] parts = name.split(" ");
                if (parts.length > 0)
                    user.setFirstName(parts[0]);
                if (parts.length > 1)
                    user.setLastName(name.substring(parts[0].length()).trim());
            } else {
                user.setFirstName("User");
            }

            user.setPassword("OAUTH2_SOCIAL_LOGIN_" + java.util.UUID.randomUUID().toString());
            user.setRoles("ROLE_USER,Learner");
            user.setHasCompletedPlacementTest(false);
            user.setIsFirstLogin(true);
            userRepository.save(user);
        }

        // Generate JWT
        String token = jwtUtil.generateToken(user.getEmail());

        // Redirect to frontend with token
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/auth/callback")
                .queryParam("token", token)
                .queryParam("isNewUser", isBrandNew)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
