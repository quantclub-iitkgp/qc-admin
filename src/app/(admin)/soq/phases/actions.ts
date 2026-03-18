"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSoQPhase, updateSoQPhase, deleteSoQPhase } from "@/lib/data-store"

export async function createPhaseAction(formData: FormData) {
  await createSoQPhase({
    slug: String(formData.get("slug")).trim(),
    title: String(formData.get("title")).trim(),
    description: String(formData.get("description") ?? "").trim() || undefined,
    orderIndex: Number(formData.get("orderIndex")) || 0,
    isPublished: formData.get("isPublished") === "on",
  })
  revalidatePath("/soq/phases")
  redirect("/soq/phases")
}

export async function updatePhaseAction(id: number, formData: FormData) {
  await updateSoQPhase(id, {
    slug: String(formData.get("slug")).trim(),
    title: String(formData.get("title")).trim(),
    description: String(formData.get("description") ?? "").trim() || undefined,
    orderIndex: Number(formData.get("orderIndex")) || 0,
    isPublished: formData.get("isPublished") === "on",
  })
  revalidatePath("/soq/phases")
  redirect("/soq/phases")
}

export async function deletePhaseAction(id: number) {
  await deleteSoQPhase(id)
  revalidatePath("/soq/phases")
}
