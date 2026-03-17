"use server"

import { revalidatePath } from "next/cache"
import { addInvitation, deleteInvitation } from "@/lib/admin-invitations"
import { getCurrentUser } from "@/lib/session"

async function assertSuperAdmin(): Promise<void> {
  const user = await getCurrentUser()
  if (
    !process.env.SUPER_ADMIN_EMAIL ||
    user?.email !== process.env.SUPER_ADMIN_EMAIL
  ) {
    throw new Error("Unauthorized")
  }
}

export async function inviteAdminAction(formData: FormData): Promise<void> {
  await assertSuperAdmin()
  const email = (formData.get("email") as string | null)?.trim().toLowerCase()
  if (!email) throw new Error("Email is required.")
  await addInvitation(email)
  revalidatePath("/super-admin")
}

export async function deleteInvitationAction(id: string): Promise<void> {
  await assertSuperAdmin()
  await deleteInvitation(id)
  revalidatePath("/super-admin")
}
