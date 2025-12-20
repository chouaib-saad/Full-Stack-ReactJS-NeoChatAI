"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService, type User, type AuthTokens } from "@/lib/api/auth-service"
import { tokenUtils } from "@/lib/utils/token-utils"
import { mockApi } from "@/lib/api/mock-api"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const tokens = tokenUtils.getTokens()
      const storedUser = tokenUtils.getUser()

      if (tokens.accessToken && storedUser) {
        setUser(storedUser)
        mockApi.setCurrentUser(storedUser.id)
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authService.login({ email, password })

      const tokens: AuthTokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }

      const userData: User = {
        id: response.userId,
        email: response.email,
      }

      tokenUtils.setTokens(tokens)
      tokenUtils.setUser(userData)
      setUser(userData)

      mockApi.setCurrentUser(userData.id)

      router.push("/chat")
    },
    [router],
  )

  const register = useCallback(
    async (email: string, password: string) => {
      await authService.register({ email, password })
      // After successful registration, redirect to login
      router.push("/login?registered=true")
    },
    [router],
  )

  const logout = useCallback(() => {
    tokenUtils.clearAuth()
    setUser(null)
    mockApi.setCurrentUser(null)
    router.push("/login")
  }, [router])

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = tokenUtils.getTokens()
      if (!tokens.refreshToken) {
        return false
      }

      const response = await authService.refresh(tokens.refreshToken)

      const newTokens: AuthTokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      }

      tokenUtils.setTokens(newTokens)
      return true
    } catch {
      logout()
      return false
    }
  }, [logout])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
