"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteBlogAction } from "./actions"

export function DeleteBlogButton({ slugAsParams }: { slugAsParams: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Delete this blog post?")) return
    startTransition(async () => {
      const result = await deleteBlogAction(slugAsParams)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Blog deleted")
      }
    })
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
