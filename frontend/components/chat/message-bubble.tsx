"use client"

import type { Message } from "@/lib/api/chat-service"
import { User, Copy, Check, Bot } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return ""
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className={`space-y-4 ${isLatest ? "animate-slide-up" : ""}`}>
      {/* User message */}
      <div className="flex gap-3 justify-end">
        <div className="max-w-[80%] lg:max-w-[60%] space-y-1">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-4 shadow-lg shadow-primary/10">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.prompt}</p>
          </div>
          <p className="text-xs text-muted-foreground text-right px-2">{formatTimestamp(message.timestamp)}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      </div>

      {/* AI response */}
      {message.response && (
        <div className="flex gap-3">
          {/* Custom Logo: Black background with white icon (Small) */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-secondary-foreground" />
            </div>
          </div>
          <div className="max-w-[80%] lg:max-w-[60%] space-y-1 group">
            <div className="glass rounded-2xl rounded-tl-sm p-4 relative">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{message.response}</p>

              {/* Copy button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(message.response)}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="sr-only">Copy response</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground px-2">{formatTimestamp(message.timestamp)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
