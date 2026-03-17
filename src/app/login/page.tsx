"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Tab = "login" | "signup"

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("login")

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  // Sign-up state
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")
  const [signupLoading, setSignupLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        toast.error(data.error ?? "Invalid credentials. Try again.")
        return
      }
      toast.success("Welcome back!")
      router.push("/")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (signupPassword !== signupConfirm) {
      toast.error("Passwords do not match.")
      return
    }
    if (signupPassword.length < 8) {
      toast.error("Password must be at least 8 characters.")
      return
    }
    setSignupLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, password: signupPassword }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) {
        toast.error(data.error ?? "Sign up failed. Please try again.")
        return
      }
      toast.success("Account created! You can now log in.")
      setTab("login")
      setLoginEmail(signupEmail)
      setSignupEmail("")
      setSignupPassword("")
      setSignupConfirm("")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSignupLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-base border-2 border-border bg-main shadow-shadow">
            {tab === "login" ? (
              <Lock className="h-6 w-6 text-main-foreground" />
            ) : (
              <UserPlus className="h-6 w-6 text-main-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl">Quant Club Admin</CardTitle>
          <CardDescription>
            {tab === "login"
              ? "Sign in to access the admin panel"
              : "Create your admin account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tab switcher */}
          <div className="flex border-2 border-border rounded-base overflow-hidden shadow-shadow">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={cn(
                "flex-1 py-2 text-sm font-base transition-colors",
                tab === "login"
                  ? "bg-main text-main-foreground"
                  : "bg-secondary-background text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setTab("signup")}
              className={cn(
                "flex-1 py-2 text-sm font-base border-l-2 border-border transition-colors",
                tab === "signup"
                  ? "bg-main text-main-foreground"
                  : "bg-secondary-background text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              Sign Up
            </button>
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="Repeat your password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-foreground/50 leading-relaxed">
                Sign up is by invitation only. Your email must be added by the Super Admin before you can create an account.
              </p>
              <Button type="submit" className="w-full" disabled={signupLoading}>
                {signupLoading ? "Creating account…" : "Create Account"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
