package com.wolftalk.authservice.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.oauth2.redirectUri:http://localhost:5174/oauth2/redirect}")
    private String defaultRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Generate JWT
        String token = jwtUtil.generateToken(email, "ROLE_USER");

        // Determine redirect URI dynamic based on Referer if possible, or fallback
        String targetRedirectUri = defaultRedirectUri;
        String referer = request.getHeader("Referer");
        if (referer != null && referer.contains(":5173")) {
            targetRedirectUri = "http://localhost:5173/oauth2/redirect";
        }

        String targetUrl = UriComponentsBuilder.fromUriString(targetRedirectUri)
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
