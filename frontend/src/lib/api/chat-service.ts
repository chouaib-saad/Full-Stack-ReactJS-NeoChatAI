import { apiClient } from './api-client'

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
        return apiClient.post<SendMessageResponse>('/chat', { prompt })
    },

    /**
     * Get all chat history for the authenticated user
     * GET /chat/history
     */
    getHistory: async (): Promise<ChatHistoryResponse> => {
        return apiClient.get<ChatHistoryResponse>('/chat/history')
    },

    /**
     * Clear all chat history for the authenticated user
     * DELETE /chat/history
     */
    clearHistory: async (): Promise<void> => {
        return apiClient.delete<void>('/chat/history')
    },
}
