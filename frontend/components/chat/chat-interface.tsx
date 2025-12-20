"use client"

// Re-trigger build
import { useState, useRef, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { chatService, type Message } from "@/lib/api/chat-service"
import { ChatHeader } from "./chat-header"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { ChatSidebar } from "./chat-sidebar"
import { useToast } from "@/hooks/use-toast"

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await chatService.getHistory()
        setMessages(response.messages || [])
      } catch (error) {
        console.error("Failed to load chat history:", error)
        // Don't show error for empty history
      } finally {
        setIsHistoryLoading(false)
      }
    }

    loadHistory()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return

    // Create a temporary message for optimistic UI
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      prompt: prompt.trim(),
      response: "",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempUserMessage])
    setIsLoading(true)

    try {
      const response = await chatService.sendMessage(prompt.trim())

      // Replace temp message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempUserMessage.id
            ? {
              ...response,
            }
            : msg,
        ),
      )
    } catch (error) {
      // Remove the temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id))

      const message = error instanceof Error ? error.message : "Failed to send message. Please try again."
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = () => {
    setMessages([])
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background relative">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        messages={messages}
        onClearHistory={handleClearHistory}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col relative z-10">
        <ChatHeader
          user={user}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          isHistoryLoading={isHistoryLoading}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}
