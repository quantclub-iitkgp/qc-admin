"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { addTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/data-store"

export async function createTeamMemberAction(formData: FormData) {
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const bio = formData.get("bio") as string
  const image = formData.get("image") as string
  const github = formData.get("github") as string
  const linkedin = formData.get("linkedin") as string
  const twitter = formData.get("twitter") as string

  await addTeamMember({
    name,
    role,
    bio,
    image: image || "/team/placeholder.jpg",
    github: github || null,
    linkedin: linkedin || null,
    twitter: twitter || null,
  })

  revalidatePath("/team")
  redirect("/team")
}

export async function updateTeamMemberAction(id: number, formData: FormData) {
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const bio = formData.get("bio") as string
  const image = formData.get("image") as string
  const github = formData.get("github") as string
  const linkedin = formData.get("linkedin") as string
  const twitter = formData.get("twitter") as string

  await updateTeamMember(id, {
    name,
    role,
    bio,
    image,
    github: github || null,
    linkedin: linkedin || null,
    twitter: twitter || null,
  })

  revalidatePath("/team")
  redirect("/team")
}

export async function deleteTeamMemberAction(id: number): Promise<{ error?: string }> {
  try {
    await deleteTeamMember(id)
    revalidatePath("/team")
    return {}
  } catch (e) {
    return { error: (e as Error).message }
  }
}
