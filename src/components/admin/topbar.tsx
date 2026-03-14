"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { LogOut, Moon, Sun } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function Topbar() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" })
    toast.success("Logged out")
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="h-16 border-b-4 border-border bg-secondary-background flex items-center justify-between px-6">
      <h1 className="text-base font-heading">Quant Club Admin Panel</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
