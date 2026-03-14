"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { addWhitepaper, updateWhitepaper, deleteWhitepaper } from "@/lib/data-store"
import { transformToSlug } from "@/lib/utils"

export async function createWhitepaperAction(formData: FormData) {
  const title = formData.get("title") as string
  const imageUrl = formData.get("imageUrl") as string
  const slug = transformToSlug(title)

  await addWhitepaper({ title, slug, imageUrl: imageUrl || "/template-previews/blog.webp" })

  revalidatePath("/whitepapers")
  redirect("/whitepapers")
}

export async function updateWhitepaperAction(id: number, formData: FormData) {
  const title = formData.get("title") as string
  const imageUrl = formData.get("imageUrl") as string
  const slug = transformToSlug(title)

  await updateWhitepaper(id, { title, slug, imageUrl: imageUrl || undefined })

  revalidatePath("/whitepapers")
  redirect("/whitepapers")
}

export async function deleteWhitepaperAction(id: number): Promise<{ error?: string }> {
  try {
    await deleteWhitepaper(id)
    revalidatePath("/whitepapers")
    return {}
  } catch (e) {
    return { error: (e as Error).message }
  }
}
