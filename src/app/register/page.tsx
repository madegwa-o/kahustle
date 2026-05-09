"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, Loader2, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Form fields
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)

    // Validation states
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
    const [usernameChecking, setUsernameChecking] = useState(false)
    const [emailChecking, setEmailChecking] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Check username availability
    const checkUsername = async (value: string) => {
        if (value.length < 3 || value.length > 20) {
            setUsernameAvailable(null)
            return
        }

        setUsernameChecking(true)
        try {
            const response = await fetch(`/api/auth/register?username=${encodeURIComponent(value)}`)
            const data = await response.json()
            setUsernameAvailable(data.available)
        } catch (error) {
            console.error("Username check error:", error)
            setUsernameAvailable(null)
        } finally {
            setUsernameChecking(false)
        }
    }

    // Check email availability
    const checkEmail = async (value: string) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailAvailable(null)
            return
        }

        setEmailChecking(true)
        try {
            const response = await fetch(`/api/auth/register?email=${encodeURIComponent(value)}`)
            const data = await response.json()
            setEmailAvailable(data.available)
        } catch (error) {
            console.error("Email check error:", error)
            setEmailAvailable(null)
        } finally {
            setEmailChecking(false)
        }
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setUsername(value)
        checkUsername(value)
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        checkEmail(value)
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Final validation
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            setError("All fields are required")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (usernameAvailable === false) {
            setError("Username is already taken")
            return
        }

        if (emailAvailable === false) {
            setError("Email is already registered")
            return
        }

        if (!agreedToTerms || !agreedToPrivacy) {
            setError("You must agree to Terms & Conditions and Privacy Policy")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    phone: phone || null,
                    password,
                    confirmPassword,
                    agreedToTerms,
                    agreedToPrivacy,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Registration failed")
                return
            }

            setSuccess(true)
            // Redirect to signin after 2 seconds
            setTimeout(() => {
                router.push("/signin?registered=true")
            }, 2000)
        } catch (error) {
            console.error("Registration error:", error)
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Registration Successful</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                Your account has been created. Redirecting to sign in...
                            </p>
                            <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                    <CardDescription className="text-center">
                        Join Kahustle to start posting ads
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">
                                Username {usernameChecking && <Loader2 className="inline h-3 w-3 animate-spin ml-1" />}
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="username"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    required
                                    disabled={isLoading}
                                />
                                {usernameAvailable === true && (
                                    <Check className="h-10 w-10 text-green-500 flex-shrink-0" />
                                )}
                                {usernameAvailable === false && (
                                    <X className="h-10 w-10 text-red-500 flex-shrink-0" />
                                )}
                            </div>
                            {username && username.length < 3 && (
                                <p className="text-xs text-muted-foreground">At least 3 characters</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email {emailChecking && <Loader2 className="inline h-3 w-3 animate-spin ml-1" />}
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    disabled={isLoading}
                                />
                                {emailAvailable === true && (
                                    <Check className="h-10 w-10 text-green-500 flex-shrink-0" />
                                )}
                                {emailAvailable === false && (
                                    <X className="h-10 w-10 text-red-500 flex-shrink-0" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+254 700 000 000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            {password && password.length < 6 && (
                                <p className="text-xs text-muted-foreground">At least 6 characters</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            {password && confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-red-500">Passwords do not match</p>
                            )}
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                    disabled={isLoading}
                                />
                                <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                                    I agree to the{" "}
                                    <a href="/terms-conditions" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                        Terms & Conditions
                                    </a>
                                </Label>
                            </div>

                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="privacy"
                                    checked={agreedToPrivacy}
                                    onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                                    disabled={isLoading}
                                />
                                <Label htmlFor="privacy" className="text-sm font-normal leading-tight cursor-pointer">
                                    I agree to the{" "}
                                    <a href="/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                        Privacy Policy
                                    </a>
                                </Label>
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading || usernameAvailable === false || emailAvailable === false} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-muted-foreground text-sm">
                        Already have an account?{" "}
                        <a href="/signin" className="text-primary hover:underline">
                            Sign in
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
