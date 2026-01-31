package com.wolftalk.backend.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                var claims = jwtUtil.parseClaims(token);
                String subject = claims.getSubject();
                if (subject != null) {
                    // Extract roles from token claims if available, default to ROLE_USER
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    Object rolesObj = claims.get("roles");
                    if (rolesObj != null) {
                        String roles = rolesObj.toString();
                        if (roles != null && !roles.isEmpty()) {
                            for (String role : roles.split(",")) {
                                authorities.add(new SimpleGrantedAuthority(role.trim()));
                            }
                        } else {
                            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                        }
                    } else {
                        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                    }
                    Authentication auth = new UsernamePasswordAuthenticationToken(subject, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception ex) {
                // invalid token -> ignore, SecurityContext remains empty
            }
        }
        filterChain.doFilter(request, response);
    }
}
