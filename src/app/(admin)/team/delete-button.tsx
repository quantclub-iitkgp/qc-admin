"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteTeamMemberAction } from "./actions"

export function DeleteTeamMemberButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Remove this team member?")) return
    startTransition(async () => {
      const result = await deleteTeamMemberAction(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Team member removed")
      }
    })
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
