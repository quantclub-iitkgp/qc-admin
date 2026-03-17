"use client"

import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteInvitationAction } from "./actions"

export function DeleteInvitationButton({ id }: { id: string }) {
  async function handleDelete() {
    try {
      await deleteInvitationAction(id)
      toast.success("Invitation removed.")
    } catch {
      toast.error("Failed to remove invitation.")
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDelete}
      className="shrink-0 h-8 w-8 border-destructive text-destructive hover:bg-destructive/10"
      aria-label="Delete invitation"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}
