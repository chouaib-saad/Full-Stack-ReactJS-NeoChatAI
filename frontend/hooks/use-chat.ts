"use client"

import { useState, useCallback, useEffect } from "react"
import { chatService, type Message } from "@/lib/api/chat-service"
import { useToast } from "@/hooks/use-toast"

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  isHistoryLoading: boolean
  sendMessage: (prompt: string) => Promise<void>
  clearHistory: () => void
  refreshHistory: () => Promise<void>
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const { toast } = useToast()

  // Load chat history on mount
  const refreshHistory = useCallback(async () => {
    setIsHistoryLoading(true)
    try {
      const response = await chatService.getHistory()
      setMessages(response.messages || [])
    } catch (error) {
      console.error("Failed to load chat history:", error)
    } finally {
      setIsHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshHistory()
  }, [refreshHistory])

  const sendMessage = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || isLoading) return

      // Create a temporary message for optimistic UI
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        prompt: prompt.trim(),
        response: "",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, tempMessage])
      setIsLoading(true)

      try {
        const response = await chatService.sendMessage(prompt.trim())

        // Replace temp message with actual response
        setMessages((prev) => prev.map((msg) => (msg.id === tempMessage.id ? response : msg)))
      } catch (error) {
        // Remove the temp message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))

        const message = error instanceof Error ? error.message : "Failed to send message. Please try again."
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, toast],
  )

  const clearHistory = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    isHistoryLoading,
    sendMessage,
    clearHistory,
    refreshHistory,
  }
}
