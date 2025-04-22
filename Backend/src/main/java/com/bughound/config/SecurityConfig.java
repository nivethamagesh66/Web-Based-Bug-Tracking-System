package com.bughound.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/**").hasAuthority("3")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAuthority("3")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasAuthority("3")

                        .requestMatchers(HttpMethod.GET, "/api/bugs/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/bugs/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/bugs/**").hasAuthority("3")
                        .requestMatchers(HttpMethod.DELETE, "/api/bugs/**").hasAuthority("3")

                        .requestMatchers(HttpMethod.POST, "/api/attachments/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/history/**").permitAll() // ✅ added for bug history

                        .requestMatchers("/api/programs/**").permitAll()
                        .requestMatchers("/api/functional-areas/**").permitAll()

                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
