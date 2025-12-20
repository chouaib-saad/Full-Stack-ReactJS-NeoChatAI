package com.backend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.model.User;
import com.backend.payload.AuthPayloads.*;
import com.backend.repository.UserRepository;
import com.backend.security.JwtUtils;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user's account
        User user = new User(request.getEmail(), encoder.encode(request.getPassword()));
        userRepository.save(user);

        return new RegisterResponse("User registered successfully!", user.getId());
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Generate refresh token (simple UUID for now)
        String refreshToken = UUID.randomUUID().toString();

        // Save refresh token to user
        User user = userRepository.findByEmail(userDetails.getEmail()).orElseThrow();
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return new LoginResponse(jwt, refreshToken, userDetails.getId(), userDetails.getEmail());
    }

    public RefreshResponse refresh(RefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return userRepository.findByRefreshToken(requestRefreshToken)
                .map(user -> {
                    String token = jwtUtils.generateTokenFromUsername(user.getEmail());
                    return new RefreshResponse(token, requestRefreshToken);
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
