"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock, ArrowRight, Bot, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const { login } = useAuth()
    const { toast } = useToast()
    const searchParams = useSearchParams()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        // Show success message if redirected from registration
        if (searchParams.get("registered") === "true") {
            toast({
                title: "Registration successful",
                description: "Please login with your credentials.",
            })
        }
    }, [searchParams, toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fill in all fields.",
            })
            return
        }

        setIsLoading(true)

        try {
            await login(email, password)
            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
            })
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Invalid credentials. Please try again."
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: message,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`min-h-screen flex w-full transition-opacity duration-500 ease-in-out ${isMounted ? "opacity-100" : "opacity-0"}`}>
            {/* Left side - Branding & Info */}
            <div className="hidden lg:flex w-1/2 bg-muted/30 p-12 flex-col justify-between border-r border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-400/20">
                        <Bot className="w-7 h-7 text-black" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">NeoChat AI</span>
                </div>

                <div className="max-w-md space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Experience the future of communication
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Connect with our advanced AI assistant for intelligent, natural conversations.
                        Secure, fast, and always available.
                    </p>
                </div>

                <div className="text-sm text-muted-foreground">
                    &copy; 2025 NeoChat AI. All rights reserved.
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-muted-foreground">Enter your email to sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        placeholder="Email"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 pr-9"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline underline-offset-4 hover:text-primary font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
