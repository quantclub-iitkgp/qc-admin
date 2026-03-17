"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { LogOut, Menu, Moon, Sun } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface TopbarProps {
  onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" })
    toast.success("Logged out")
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b-4 border-border bg-secondary-background/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Hamburger — mobile only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="md:hidden text-foreground/60 hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Spacer on desktop (no hamburger) */}
      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="text-foreground/60 hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}
