/**
 * API Client with automatic token refresh and retry logic
 * Ready for Spring Boot backend integration
 *
 * Set USE_MOCK_API to false and configure NEXT_PUBLIC_API_BASE_URL
 * to connect to your Spring Boot backend
 */

import { tokenUtils } from "@/lib/utils/token-utils"
import { mockApi } from "./mock-api"

// Toggle this to switch between mock and real API
const USE_MOCK_API = false

// Base URL for the Spring Boot backend - configure this in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

interface ApiError {
  message: string
  status: number
}

interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

class ApiClient {
  private isRefreshing = false
  private refreshPromise: Promise<boolean> | null = null

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    const tokens = tokenUtils.getTokens()
    if (tokens.accessToken) {
      headers["Authorization"] = `Bearer ${tokens.accessToken}`
    }

    return headers
  }

  private async refreshTokens(): Promise<boolean> {
    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performRefresh()

    try {
      return await this.refreshPromise
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async performRefresh(): Promise<boolean> {
    const tokens = tokenUtils.getTokens()

    if (!tokens.refreshToken) {
      return false
    }

    try {
      let data: RefreshResponse

      if (USE_MOCK_API) {
        data = await mockApi.refresh(tokens.refreshToken)
      } else {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        })

        if (!response.ok) {
          tokenUtils.clearAuth()
          return false
        }

        data = await response.json()
      }

      tokenUtils.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

      return true
    } catch {
      tokenUtils.clearAuth()
      return false
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = await this.getHeaders()

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401 && retry) {
      const refreshed = await this.refreshTokens()

      if (refreshed) {
        // Retry the original request with new token
        return this.request<T>(endpoint, options, false)
      }

      // Refresh failed, throw unauthorized error
      throw { message: "Session expired. Please login again.", status: 401 } as ApiError
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw {
        message: errorData.message || `Request failed with status ${response.status}`,
        status: response.status,
      } as ApiError
    }

    // Handle empty responses
    const text = await response.text()
    if (!text) {
      return {} as T
    }

    return JSON.parse(text) as T
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export mock API status
export const isMockApiEnabled = () => USE_MOCK_API
