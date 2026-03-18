"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import { enrollByEmailAction } from "../actions"

export function EnrollForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const fd = new FormData(e.currentTarget)
      await enrollByEmailAction(fd)
      ref.current?.reset()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enroll user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="flex items-end gap-4 max-w-md">
      <div className="flex-1 space-y-2">
        <Label htmlFor="email">User Email</Label>
        <Input id="email" name="email" type="email" placeholder="arjun@example.com" required />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <Button type="submit" disabled={loading}>
        <UserPlus className="h-4 w-4 mr-2" />
        {loading ? "Enrolling…" : "Enroll"}
      </Button>
    </form>
  )
}
