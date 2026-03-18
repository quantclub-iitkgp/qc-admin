"use server"

import { revalidatePath } from "next/cache"
import { addSoQEnrollment, removeSoQEnrollment } from "@/lib/data-store"
import { getServiceClient } from "@/lib/supabase/service"

export async function enrollByEmailAction(formData: FormData) {
  const email = String(formData.get("email")).trim().toLowerCase()
  if (!email) return

  const { data: userData, error: authError } = await getServiceClient().auth.admin.listUsers()
  if (authError) throw new Error(authError.message)

  const user = userData.users.find((u) => u.email?.toLowerCase() === email)
  if (!user) throw new Error(`No account found for ${email}. The user must sign up at /soq/signup first.`)

  await addSoQEnrollment(user.id)
  revalidatePath("/soq/enrollments")
}

export async function unenrollAction(id: number) {
  await removeSoQEnrollment(id)
  revalidatePath("/soq/enrollments")
}
