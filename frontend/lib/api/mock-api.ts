/**
 * Mock API Implementation
 * This provides local mock responses for development/testing without a backend
 * Remove this file and update api-client.ts to use real endpoints in production
 */

import type { LoginResponse, RegisterResponse, RefreshResponse } from "./auth-service"
import type { SendMessageResponse, ChatHistoryResponse, Message } from "./chat-service"

// Mock user database (in-memory)
const mockUsers: Map<string, { id: string; email: string; passwordHash: string }> = new Map()

// Mock refresh tokens
const mockRefreshTokens: Set<string> = new Set()

// Mock messages storage
const mockMessages: Map<string, Message[]> = new Map()

// Current authenticated user
let currentUserId: string | null = null

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36)

// Helper to generate mock tokens
const generateToken = () => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = btoa(JSON.stringify({ exp: Date.now() + 5 * 60 * 1000, userId: currentUserId }))
  const signature = btoa(generateId())
  return `${header}.${payload}.${signature}`
}

// Mock AI responses
const mockAIResponses = [
  "That's an interesting question! Based on my analysis, I would suggest considering multiple perspectives before making a decision.",
  "I understand what you're asking. Let me break this down for you step by step to make it clearer.",
  "Great question! Here's what I think: the key to solving this lies in understanding the fundamental principles involved.",
  "I'd be happy to help with that! From my perspective, there are several approaches you could take.",
  "That's a thought-provoking topic. Let me share some insights that might be helpful for your situation.",
  "Interesting! I can definitely assist you with this. Here's my analysis based on the information provided.",
  "I appreciate your question. Let me provide you with a comprehensive response that addresses all aspects.",
  "That's a great point to explore! Here are some key considerations to keep in mind.",
]

const getRandomAIResponse = () => mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)]

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(800)

    // Check if user exists
    const user = Array.from(mockUsers.values()).find((u) => u.email === email)

    if (!user || user.passwordHash !== password) {
      throw new Error("Invalid email or password")
    }

    currentUserId = user.id

    const accessToken = generateToken()
    const refreshToken = generateId()
    mockRefreshTokens.add(refreshToken)

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      email: user.email,
    }
  },

  async register(email: string, password: string): Promise<RegisterResponse> {
    await delay(800)

    // Check if email already exists
    const existingUser = Array.from(mockUsers.values()).find((u) => u.email === email)

    if (existingUser) {
      throw new Error("Email already registered")
    }

    const userId = generateId()
    mockUsers.set(userId, {
      id: userId,
      email,
      passwordHash: password,
    })

    // Initialize empty message history for new user
    mockMessages.set(userId, [])

    return {
      message: "Registration successful",
      userId,
    }
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    await delay(300)

    if (!mockRefreshTokens.has(refreshToken)) {
      throw new Error("Invalid refresh token")
    }

    const newAccessToken = generateToken()
    const newRefreshToken = generateId()

    // Rotate refresh token
    mockRefreshTokens.delete(refreshToken)
    mockRefreshTokens.add(newRefreshToken)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  },

  // Chat endpoints
  async sendMessage(prompt: string): Promise<SendMessageResponse> {
    await delay(1500) // Simulate AI thinking time

    if (!currentUserId) {
      throw new Error("Not authenticated")
    }

    const message: Message = {
      id: generateId(),
      prompt,
      response: getRandomAIResponse(),
      timestamp: new Date().toISOString(),
    }

    // Store message
    const userMessages = mockMessages.get(currentUserId) || []
    userMessages.push(message)
    mockMessages.set(currentUserId, userMessages)

    return message
  },

  async getHistory(): Promise<ChatHistoryResponse> {
    await delay(500)

    if (!currentUserId) {
      throw new Error("Not authenticated")
    }

    const messages = mockMessages.get(currentUserId) || []

    return { messages }
  },

  // Utility to set current user (for restoring session)
  setCurrentUser(userId: string | null) {
    currentUserId = userId
  },
}
