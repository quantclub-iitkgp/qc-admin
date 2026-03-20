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

export async function bulkEnrollAction(emails: string[]): Promise<{
  enrolled: number
  skipped: number
  errors: string[]
}> {
  const { data: userData, error: authError } = await getServiceClient().auth.admin.listUsers()
  if (authError) throw new Error(authError.message)

  const emailToUser = new Map(
    userData.users
      .filter((u) => u.email)
      .map((u) => [u.email!.toLowerCase(), u])
  )

  let enrolled = 0
  let skipped = 0
  const errors: string[] = []

  for (const email of emails) {
    const user = emailToUser.get(email.toLowerCase())
    if (!user) {
      errors.push(`${email}: no account found`)
      skipped++
      continue
    }
    try {
      await addSoQEnrollment(user.id)
      enrolled++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes("duplicate") || msg.includes("unique")) {
        skipped++
      } else {
        errors.push(`${email}: ${msg}`)
        skipped++
      }
    }
  }

  revalidatePath("/soq/enrollments")
  return { enrolled, skipped, errors }
}
