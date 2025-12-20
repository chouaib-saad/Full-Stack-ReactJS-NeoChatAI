import type React from 'react'
import type { Message } from '@/lib/api/chat-service'
import { MessageBubble } from './message-bubble'
import { Sparkles, Loader2, Bot } from 'lucide-react'

interface ChatMessagesProps {
    messages: Message[]
    isLoading: boolean
    isHistoryLoading: boolean
    messagesEndRef: React.RefObject<HTMLDivElement>
}

export function ChatMessages({ messages, isLoading, isHistoryLoading, messagesEndRef }: ChatMessagesProps) {
    if (isHistoryLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading conversation history...</p>
                </div>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center space-y-6 max-w-md animate-fade-in">
                    <div className="relative mx-auto w-20 h-20">
                        <div className="relative w-full h-full rounded-2xl bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-400/20">
                            <Bot className="w-10 h-10 text-black" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Start a conversation</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Send a message to begin chatting with your AI assistant. Ask questions, get help with tasks, or just have
                            a conversation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-4">
                        {['Explain quantum computing', 'Write a poem about stars', 'Help me debug code', 'Tell me a fun fact'].map(
                            (suggestion, index) => (
                                <button
                                    key={index}
                                    className="p-3 text-left text-sm rounded-xl glass glass-hover transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span className="text-muted-foreground">{suggestion}</span>
                                </button>
                            ),
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {messages.map((message, index) => (
                <MessageBubble key={message.id || index} message={message} isLatest={index === messages.length - 1} />
            ))}

            {/* Loading indicator for AI response */}
            {isLoading && messages.length > 0 && messages[messages.length - 1].response === '' && (
                <div className="flex gap-4 animate-fade-in">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 glass rounded-2xl rounded-tl-sm p-4">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    )
}
