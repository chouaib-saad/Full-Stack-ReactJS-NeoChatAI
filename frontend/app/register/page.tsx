"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock, ArrowRight, Bot, Check, X, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const { register } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Password validation rules
    const passwordRules = [
        { label: "At least 8 characters", valid: password.length >= 8 },
        { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", valid: /[a-z]/.test(password) },
        { label: "Contains a number", valid: /\d/.test(password) },
    ]

    const isPasswordValid = passwordRules.every((rule) => rule.valid)
    const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password || !confirmPassword) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fill in all fields.",
            })
            return
        }

        if (!validateEmail(email)) {
            toast({
                variant: "destructive",
                title: "Invalid Email",
                description: "Please enter a valid email address.",
            })
            return
        }

        if (!isPasswordValid) {
            toast({
                variant: "destructive",
                title: "Weak Password",
                description: "Please meet all password requirements.",
            })
            return
        }

        if (!doPasswordsMatch) {
            toast({
                variant: "destructive",
                title: "Password Mismatch",
                description: "Passwords do not match.",
            })
            return
        }

        setIsLoading(true)

        try {
            await register(email, password)
            toast({
                title: "Account created!",
                description: "Please login with your new credentials.",
            })
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Registration failed. Please try again."
            toast({
                variant: "destructive",
                title: "Registration Failed",
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
                        Create your account
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Join thousands of users leveraging the power of AI.
                        Start your journey today.
                    </p>
                </div>

                <div className="text-sm text-muted-foreground">
                    &copy; 2025 NeoChat AI. All rights reserved.
                </div>
            </div>

            {/* Right side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Get started</h2>
                        <p className="text-muted-foreground">Create a new account</p>
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
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        placeholder="Create a password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
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
                                {/* Password Strength Indicators */}
                                <div className={`grid grid-cols-2 gap-2 mt-2 transition-all duration-300 ease-in-out overflow-hidden ${password.length > 0 ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
                                    {passwordRules.map((rule, index) => (
                                        <div key={index} className="flex items-center gap-1.5 text-xs">
                                            {rule.valid ? (
                                                <Check className="h-3 w-3 text-primary" />
                                            ) : (
                                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 ml-0.5 mr-1" />
                                            )}
                                            <span className={rule.valid ? "text-primary font-medium" : "text-muted-foreground"}>
                                                {rule.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        placeholder="Confirm your password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`pl-9 pr-9 ${confirmPassword.length > 0 && !doPasswordsMatch ? "border-primary focus-visible:ring-primary" : ""}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </Button>
                                </div>
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${confirmPassword.length > 0 && !doPasswordsMatch ? "max-h-10 opacity-100" : "max-h-0 opacity-0"}`}>
                                    <p className="text-xs text-primary mt-2">Passwords do not match</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-primary font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
