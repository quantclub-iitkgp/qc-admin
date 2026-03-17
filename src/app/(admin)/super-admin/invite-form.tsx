"use client"

import { useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { inviteAdminAction } from "./actions"

export function InviteForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    try {
      await inviteAdminAction(formData)
      toast.success("Invitation added. The admin can now sign up.")
      formRef.current?.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add invitation.")
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invite-email">Admin Email *</Label>
        <Input
          id="invite-email"
          name="email"
          type="email"
          placeholder="admin@example.com"
          required
        />
        <p className="text-xs text-foreground/50">
          The invited person can sign up using this email on the login page.
        </p>
      </div>
      <Button type="submit">Add Invitation</Button>
    </form>
  )
}
