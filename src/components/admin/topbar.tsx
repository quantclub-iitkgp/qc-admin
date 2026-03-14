"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function Topbar() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" })
    toast.success("Logged out")
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="h-16 border-b-4 border-border bg-secondary-background flex items-center justify-between px-6">
      <h1 className="text-base font-heading">Quant Club Admin Panel</h1>
      <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </header>
  )
}
