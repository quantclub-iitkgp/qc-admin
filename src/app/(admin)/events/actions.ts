"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { addEvent, updateEvent, deleteEvent } from "@/lib/data-store"
import { getServiceClient } from "@/lib/supabase/service"
import { transformToSlug } from "@/lib/utils"

async function uploadEventImage(file: File, title: string): Promise<string> {
  const ext = file.type.split("/")[1] ?? "jpg"
  const slug = transformToSlug(title)
  const path = `events/${slug}-${Date.now()}.${ext}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await getServiceClient().storage
    .from("covers")
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = getServiceClient().storage.from("covers").getPublicUrl(path)
  return publicUrl
}

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const imageFile = formData.get("imageFile") as File | null
  const link = formData.get("link") as string

  let image = ""
  if (imageFile && imageFile.size > 0) {
    image = await uploadEventImage(imageFile, title)
  }

  await addEvent({ title, description, date, image, link: link || "" })

  revalidatePath("/events")
  redirect("/events")
}

export async function updateEventAction(id: number, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const imageFile = formData.get("imageFile") as File | null
  const existingImage = formData.get("existingImage") as string
  const link = formData.get("link") as string

  let image = existingImage || ""
  if (imageFile && imageFile.size > 0) {
    image = await uploadEventImage(imageFile, title)
  }

  await updateEvent(id, { title, description, date, image, link })

  revalidatePath("/events")
  redirect("/events")
}

export async function deleteEventAction(id: number): Promise<{ error?: string }> {
  try {
    await deleteEvent(id)
    revalidatePath("/events")
    return {}
  } catch (e) {
    return { error: (e as Error).message }
  }
}
