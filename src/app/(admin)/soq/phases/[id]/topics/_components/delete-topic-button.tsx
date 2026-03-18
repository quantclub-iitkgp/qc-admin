"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteTopicAction } from "../actions"

export function DeleteTopicButton({ phaseId, topicId, title }: { phaseId: number; topicId: number; title: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete topic "${title}"? Content will be permanently removed.`)) return
    setLoading(true)
    await deleteTopicAction(phaseId, topicId)
    router.refresh()
    setLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={loading}>
      <Trash2 className="h-3.5 w-3.5 text-red-500" />
    </Button>
  )
}
