import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, LogOut, User, Bot } from 'lucide-react'
import type { User as UserType } from '@/lib/api/auth-service'

interface ChatHeaderProps {
    user: UserType | null
    onToggleSidebar: () => void
    isSidebarOpen: boolean
}

export function ChatHeader({ user, onToggleSidebar }: ChatHeaderProps) {
    const { logout } = useAuth()

    return (
        <header className="h-16 border-b border-border/50 glass flex items-center justify-between px-4 lg:px-6 shrink-0">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSidebar}
                    className="hover:bg-secondary/80 transition-colors"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                </Button>

                <div className="flex items-center gap-2">
                    {/* Custom Logo: Teal background with black icon (Small) */}
                    <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center shadow-sm shadow-cyan-400/20">
                        <Bot className="w-5 h-5 text-black" />
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="font-semibold text-sm">NeoChat AI</h1>
                        <p className="text-xs text-muted-foreground">Your AI Assistant</p>
                    </div>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-9 h-9 bg-cyan-400 hover:bg-cyan-500 transition-all shadow-sm shadow-cyan-400/20"
                    >
                        <User className="h-5 w-5 text-black" />
                        <span className="sr-only">User menu</span>
                    </Button>
                </DropdownMenuTrigger>
                {/* Reduced transparency (bg-background/95) and wider container for email */}
                <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-xl border-border/50">
                    <div className="px-3 py-2">
                        {/* Removed truncate to show full email */}
                        <p className="text-sm font-medium break-all">{user?.email}</p>
                        <p className="text-xs text-muted-foreground">Signed in</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={logout}
                        // Changed from destructive to primary/foreground color
                        className="text-foreground hover:text-cyan-500 focus:text-cyan-500 focus:bg-cyan-500/10 cursor-pointer"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
