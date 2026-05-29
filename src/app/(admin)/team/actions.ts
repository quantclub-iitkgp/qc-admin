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

function parseCSV(text: string) {
  const result: string[][] = []
  let row: string[] = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        row.push(cur)
        cur = ""
      } else if (char === '\n' || char === '\r') {
        row.push(cur)
        if (row.some((c) => c.trim() !== "")) result.push(row)
        row = []
        cur = ""
        if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') {
          i++
        }
      } else {
        cur += char
      }
    }
  }
  if (cur !== "" || row.length > 0) {
    row.push(cur)
    if (row.some((c) => c.trim() !== "")) result.push(row)
  }
  return result
}

export async function uploadTeamCsvAction(formData: FormData) {
  const file = formData.get("file") as File
  if (!file || !(file instanceof File)) {
    throw new Error("No file uploaded")
  }

  const text = await file.text()
  const rows = parseCSV(text)

  if (rows.length < 2) {
    throw new Error("CSV must have a header row and at least one data row")
  }

  const header = rows[0].map((h) => h.trim().toLowerCase())
  const nameIdx = header.indexOf("name")
  const roleIdx = header.indexOf("role")
  const bioIdx = header.indexOf("bio")
  const imageIdx = header.indexOf("image")
  const githubIdx = header.indexOf("github")
  const linkedinIdx = header.indexOf("linkedin")
  const twitterIdx = header.indexOf("twitter")

  if (nameIdx === -1 || roleIdx === -1) {
    throw new Error("CSV must contain 'name' and 'role' columns")
  }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length === 0 || !row[nameIdx]) continue

    const name = row[nameIdx]?.trim()
    const role = row[roleIdx]?.trim()
    if (!name || !role) continue

    const bio = bioIdx !== -1 ? row[bioIdx]?.trim() : ""
    const image = imageIdx !== -1 ? row[imageIdx]?.trim() : ""
    const github = githubIdx !== -1 ? row[githubIdx]?.trim() : ""
    const linkedin = linkedinIdx !== -1 ? row[linkedinIdx]?.trim() : ""
    const twitter = twitterIdx !== -1 ? row[twitterIdx]?.trim() : ""

    await addTeamMember({
      name,
      role,
      bio,
      image: image || "/team/placeholder.jpg",
      github: github || null,
      linkedin: linkedin || null,
      twitter: twitter || null,
    })
  }

  revalidatePath("/team")
  redirect("/team")
}
