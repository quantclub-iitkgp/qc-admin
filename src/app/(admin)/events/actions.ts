"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { addEvent, updateEvent, deleteEvent } from "@/lib/data-store"

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const image = formData.get("image") as string
  const link = formData.get("link") as string

  await addEvent({ title, description, date, image: image || "", link: link || "" })

  revalidatePath("/events")
  redirect("/events")
}

export async function updateEventAction(id: number, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const image = formData.get("image") as string
  const link = formData.get("link") as string

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
