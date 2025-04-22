package com.bughound.config;

import io.jsonwebtoken.Jwts;
import com.bughound.model.User;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private static final String SECRET = "secret_key";
    private static final long EXPIRATION = 86400000L; // 24 hours in milliseconds

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getLoginId())
                .claim("id", user.getId())
                .claim("role", user.getLevel())
                .claim("name", user.getName())
                .claim("loginId", user.getLoginId())
                .claim("authorities", String.valueOf(user.getLevel())) // ✅ Required for role-based access
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }
}
