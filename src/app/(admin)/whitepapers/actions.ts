"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { addWhitepaper, updateWhitepaper, deleteWhitepaper } from "@/lib/data-store"
import { getServiceClient } from "@/lib/supabase/service"
import { transformToSlug } from "@/lib/utils"

async function uploadCoverImage(file: File, slug: string): Promise<string> {
  const ext = file.type.split("/")[1] ?? "jpg"
  const path = `whitepapers/${slug}.${ext}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await getServiceClient().storage
    .from("covers")
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = getServiceClient().storage.from("covers").getPublicUrl(path)
  return publicUrl
}

async function uploadPDF(pdfFile: File, slug: string): Promise<string> {
  const bytes = await pdfFile.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await getServiceClient().storage
    .from("whitepapers")
    .upload(`${slug}.pdf`, buffer, { contentType: "application/pdf", upsert: true })

  if (error) throw new Error(error.message)

  const {
    data: { publicUrl },
  } = getServiceClient().storage.from("whitepapers").getPublicUrl(`${slug}.pdf`)

  return publicUrl
}

export async function createWhitepaperAction(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const publishedAt = formData.get("publishedAt") as string
  const pdfFile = formData.get("pdfFile") as File | null
  const coverImageFile = formData.get("coverImageFile") as File | null
  const slug = transformToSlug(title)

  let pdfUrl: string | undefined
  if (pdfFile && pdfFile.size > 0) {
    pdfUrl = await uploadPDF(pdfFile, slug)
  }

  let imageUrl = "/template-previews/blog.webp"
  if (coverImageFile && coverImageFile.size > 0) {
    imageUrl = await uploadCoverImage(coverImageFile, slug)
  }

  await addWhitepaper({
    title,
    slug,
    imageUrl,
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
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const publishedAt = formData.get("publishedAt") as string
  const pdfFile = formData.get("pdfFile") as File | null
  const coverImageFile = formData.get("coverImageFile") as File | null
  const existingImageUrl = formData.get("existingImageUrl") as string
  const slug = transformToSlug(title)

  let pdfUrl: string | undefined
  if (pdfFile && pdfFile.size > 0) {
    pdfUrl = await uploadPDF(pdfFile, slug)
  }

  let imageUrl: string | undefined = existingImageUrl || undefined
  if (coverImageFile && coverImageFile.size > 0) {
    imageUrl = await uploadCoverImage(coverImageFile, slug)
  }

  await updateWhitepaper(id, {
    title,
    slug,
    imageUrl,
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
