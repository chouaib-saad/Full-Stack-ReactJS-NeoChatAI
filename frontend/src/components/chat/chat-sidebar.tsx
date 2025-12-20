import type { Message } from '@/lib/api/chat-service'
import { Button } from '@/components/ui/button'
import { X, MessageSquare, Trash2, Clock, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
    isOpen: boolean
    onClose: () => void
    messages: Message[]
    onClearHistory: () => void
}

export function ChatSidebar({ isOpen, onClose, messages, onClearHistory }: ChatSidebarProps) {
    const formatDate = (timestamp: string) => {
        try {
            const date = new Date(timestamp)
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            if (date.toDateString() === today.toDateString()) {
                return 'Today'
            } else if (date.toDateString() === yesterday.toDateString()) {
                return 'Yesterday'
            } else {
                return date.toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                })
            }
        } catch {
            return ''
        }
    }

    // Group messages by date
    const groupedMessages = messages.reduce(
        (acc, message) => {
            const date = formatDate(message.timestamp)
            if (!acc[date]) {
                acc[date] = []
            }
            acc[date].push(message)
            return acc
        },
        {} as Record<string, Message[]>,
    )

    return (
        <aside
            className={cn(
                'fixed lg:relative inset-y-0 left-0 z-30 w-[85vw] sm:w-80 h-full border-r border-border/50 glass flex flex-col transition-transform duration-300 ease-in-out',
                isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden',
            )}
        >
            {/* Header */}
            <div className="h-16 border-b border-border/50 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h2 className="font-semibold text-sm">Conversation History</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden hover:bg-secondary/80">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close sidebar</span>
                </Button>
            </div>

            {/* Message history */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">No conversations yet</p>
                            <p className="text-xs text-muted-foreground">Start chatting to see your history here</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                            <div key={date} className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground px-2 sticky top-0 bg-background/80 backdrop-blur-sm py-1 z-10">
                                    {date}
                                </p>
                                <div className="space-y-2">
                                    {dateMessages.map((message, index) => (
                                        <div
                                            key={message.id || index}
                                            className="p-3 rounded-xl glass glass-hover transition-all duration-200 cursor-default group"
                                        >
                                            <div className="flex items-start gap-2">
                                                <Bot className="h-3.5 w-3.5 text-cyan-500 mt-0.5 shrink-0" />
                                                <p className="text-xs text-muted-foreground line-clamp-2">{message.prompt}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {messages.length > 0 && (
                <div className="p-4 border-t border-border/50 shrink-0">
                    <Button
                        variant="ghost"
                        onClick={onClearHistory}
                        // Changed from destructive to muted-foreground with primary hover
                        className="w-full justify-start text-muted-foreground hover:text-cyan-500 hover:bg-cyan-500/10 transition-colors"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear history
                    </Button>
                </div>
            )}
        </aside>
    )
}
