/**
 * Authentication Service
 * Handles all auth-related API calls to Spring Boot backend
 */

export interface User {
    id: string
    email: string
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    userId: string
    email: string
}

export interface RegisterResponse {
    message: string
    userId: string
}

export interface RefreshResponse {
    accessToken: string
    refreshToken: string
}

// Base URL for the Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const authService = {
    /**
     * Login user with email and password
     * POST /auth/login
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(error.message || 'Login failed')
        }

        return response.json()
    },

    /**
     * Register new user
     * POST /auth/register
     */
    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(error.message || 'Registration failed')
        }

        return response.json()
    },

    /**
     * Refresh access token using refresh token
     * POST /auth/refresh
     */
    refresh: async (refreshToken: string): Promise<RefreshResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        })

        if (!response.ok) {
            throw new Error('Token refresh failed')
        }

        return response.json()
    },
}
