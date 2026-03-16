"use server"

import { promises as fs } from "fs"
import path from "path"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { addWhitepaper, updateWhitepaper, deleteWhitepaper } from "@/lib/data-store"
import { transformToSlug } from "@/lib/utils"

async function savePDF(pdfFile: File, slug: string): Promise<string> {
  const bytes = await pdfFile.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = `${slug}.pdf`
  const pdfDir = path.join(process.cwd(), "..", "qc-frontend", "public", "pdfs")
  await fs.mkdir(pdfDir, { recursive: true })
  await fs.writeFile(path.join(pdfDir, filename), buffer)
  return `/pdfs/${filename}`
}

export async function createWhitepaperAction(formData: FormData) {
  const title = formData.get("title") as string
  const imageUrl = formData.get("imageUrl") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const publishedAt = formData.get("publishedAt") as string
  const pdfFile = formData.get("pdfFile") as File | null
  const slug = transformToSlug(title)

  let pdfUrl: string | undefined
  if (pdfFile && pdfFile.size > 0) {
    pdfUrl = await savePDF(pdfFile, slug)
  }

  await addWhitepaper({
    title,
    slug,
    imageUrl: imageUrl || "/template-previews/blog.webp",
    description: description || undefined,
    content: content || undefined,
    publishedAt: publishedAt || new Date().toISOString().split("T")[0],
    pdfUrl,
  })

  revalidatePath("/whitepapers")
  redirect("/whitepapers")
}

export async function updateWhitepaperAction(id: number, formData: FormData) {
  const title = formData.get("title") as string
  const imageUrl = formData.get("imageUrl") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const publishedAt = formData.get("publishedAt") as string
  const pdfFile = formData.get("pdfFile") as File | null
  const slug = transformToSlug(title)

  let pdfUrl: string | undefined
  if (pdfFile && pdfFile.size > 0) {
    pdfUrl = await savePDF(pdfFile, slug)
  }

  await updateWhitepaper(id, {
    title,
    slug,
    imageUrl: imageUrl || undefined,
    description: description || undefined,
    content: content || undefined,
    publishedAt: publishedAt || undefined,
    ...(pdfUrl ? { pdfUrl } : {}),
  })

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
