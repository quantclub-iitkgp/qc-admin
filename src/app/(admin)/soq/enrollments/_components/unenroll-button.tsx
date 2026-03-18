"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { unenrollAction } from "../actions"

export function UnenrollButton({ id, label }: { id: number; label: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    if (!confirm(`Remove enrollment for ${label}?`)) return
    setLoading(true)
    await unenrollAction(id)
    router.refresh()
    setLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      <Trash2 className="h-3.5 w-3.5 text-red-500" />
    </Button>
  )
}
