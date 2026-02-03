package com.wolftalk.authservice.security;

import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private final SecretKey key;
    private final long expirationMs;
    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }
    public String generateToken(String subject) {
        return generateToken(subject, null);
    }
    public String generateToken(String subject, String roles) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        var builder = Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(exp);
        if (roles != null && !roles.isEmpty()) {
            builder.claim("roles", roles);
        }
        return builder.signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    public Claims parseClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}
