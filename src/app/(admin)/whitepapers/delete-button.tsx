"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteWhitepaperAction } from "./actions"

export function DeleteWhitepaperButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Delete this whitepaper?")) return
    startTransition(async () => {
      const result = await deleteWhitepaperAction(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Whitepaper deleted")
      }
    })
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
