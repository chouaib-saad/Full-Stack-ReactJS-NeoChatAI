package com.backend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

public class AuthPayloads {

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RefreshRequest {
        private String refreshToken;
    }

    @Data
    @AllArgsConstructor
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
        private String userId;
        private String email;
    }

    @Data
    @AllArgsConstructor
    public static class RegisterResponse {
        private String message;
        private String userId;
    }

    @Data
    @AllArgsConstructor
    public static class RefreshResponse {
        private String accessToken;
        private String refreshToken;
    }

    @Data
    @AllArgsConstructor
    public static class MessageResponse {
        private String message;
    }
}
