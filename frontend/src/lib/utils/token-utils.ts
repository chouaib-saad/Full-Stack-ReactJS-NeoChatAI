/**
 * Token Utilities
 * Handles localStorage operations for JWT tokens
 */

import type { AuthTokens, User } from '@/lib/api/auth-service'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'

export const tokenUtils = {
    /**
     * Get tokens from localStorage
     */
    getTokens: (): Partial<AuthTokens> => {
        if (typeof window === 'undefined') {
            return {}
        }

        return {
            accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) || undefined,
            refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || undefined,
        }
    },

    /**
     * Store tokens in localStorage
     */
    setTokens: (tokens: AuthTokens): void => {
        if (typeof window === 'undefined') return

        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    },

    /**
     * Get user from localStorage
     */
    getUser: (): User | null => {
        if (typeof window === 'undefined') return null

        const userStr = localStorage.getItem(USER_KEY)
        if (!userStr) return null

        try {
            return JSON.parse(userStr) as User
        } catch {
            return null
        }
    },

    /**
     * Store user in localStorage
     */
    setUser: (user: User): void => {
        if (typeof window === 'undefined') return
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    /**
     * Clear all auth data from localStorage
     */
    clearAuth: (): void => {
        if (typeof window === 'undefined') return

        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    },

    /**
     * Check if user has valid tokens
     */
    hasTokens: (): boolean => {
        const tokens = tokenUtils.getTokens()
        return !!(tokens.accessToken && tokens.refreshToken)
    },
}
