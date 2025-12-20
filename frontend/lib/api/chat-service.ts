import { mockApi } from "./mock-api"
import { apiClient } from "./api-client"

// Toggle this to switch between mock and real API
const USE_MOCK_API = false

export interface Message {
  id: string
  prompt: string
  response: string
  timestamp: string
}

export interface SendMessageRequest {
  prompt: string
}

export interface SendMessageResponse {
  id: string
  prompt: string
  response: string
  timestamp: string
}

export interface ChatHistoryResponse {
  messages: Message[]
}

export const chatService = {
  /**
   * Send a message to the AI assistant
   * POST /chat
   */
  sendMessage: async (prompt: string): Promise<SendMessageResponse> => {
    if (USE_MOCK_API) {
      return mockApi.sendMessage(prompt)
    }

    return apiClient.post<SendMessageResponse>("/chat", { prompt })
  },

  /**
   * Get all chat history for the authenticated user
   * GET /chat/history
   */
  getHistory: async (): Promise<ChatHistoryResponse> => {
    if (USE_MOCK_API) {
      return mockApi.getHistory()
    }

    return apiClient.get<ChatHistoryResponse>("/chat/history")
  },
}
