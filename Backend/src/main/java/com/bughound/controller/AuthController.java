package com.bughound.controller;

import com.bughound.model.User;
import com.bughound.service.UserService;
import com.bughound.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // PasswordEncoder removed for now because we are comparing raw text passwords

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String loginId = loginData.get("login_id");
        String password = loginData.get("password");

        return userService.findByLoginId(loginId).map(user -> {
            // ⚠️ Using plain text comparison for now (do not use in production)
            if (user.getPassword().equals(password)) {
                String token = jwtUtil.generateToken(user);
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", user);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }).orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "User not found")));
    }
}
