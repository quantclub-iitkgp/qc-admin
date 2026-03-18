"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSoQTopic, updateSoQTopic, deleteSoQTopic, upsertSoQContent } from "@/lib/data-store"

export async function createTopicAction(phaseId: number, formData: FormData) {
  await createSoQTopic({
    phaseId,
    slug: String(formData.get("slug")).trim(),
    title: String(formData.get("title")).trim(),
    description: String(formData.get("description") ?? "").trim() || undefined,
    orderIndex: Number(formData.get("orderIndex")) || 0,
    isPublished: formData.get("isPublished") === "on",
  })
  revalidatePath(`/soq/phases/${phaseId}/topics`)
  redirect(`/soq/phases/${phaseId}/topics`)
}

export async function updateTopicAction(phaseId: number, topicId: number, formData: FormData) {
  await updateSoQTopic(topicId, {
    slug: String(formData.get("slug")).trim(),
    title: String(formData.get("title")).trim(),
    description: String(formData.get("description") ?? "").trim() || undefined,
    orderIndex: Number(formData.get("orderIndex")) || 0,
    isPublished: formData.get("isPublished") === "on",
  })
  const body = String(formData.get("body") ?? "").trim()
  if (body) await upsertSoQContent(topicId, body)
  revalidatePath(`/soq/phases/${phaseId}/topics`)
  redirect(`/soq/phases/${phaseId}/topics`)
}

export async function deleteTopicAction(phaseId: number, topicId: number) {
  await deleteSoQTopic(topicId)
  revalidatePath(`/soq/phases/${phaseId}/topics`)
}
