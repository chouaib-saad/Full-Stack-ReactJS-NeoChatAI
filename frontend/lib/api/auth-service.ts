/**
 * Authentication Service
 * Handles all auth-related API calls to Spring Boot backend
 */

import { mockApi } from "./mock-api"

// Toggle this to switch between mock and real API
const USE_MOCK_API = false

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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

export const authService = {
  /**
   * Login user with email and password
   * POST /auth/login
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK_API) {
      return mockApi.login(credentials.email, credentials.password)
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "Login failed")
    }

    return response.json()
  },

  /**
   * Register new user
   * POST /auth/register
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    if (USE_MOCK_API) {
      return mockApi.register(userData.email, userData.password)
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "Registration failed")
    }

    return response.json()
  },

  /**
   * Refresh access token using refresh token
   * POST /auth/refresh
   */
  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    if (USE_MOCK_API) {
      return mockApi.refresh(refreshToken)
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Token refresh failed")
    }

    return response.json()
  },
}
