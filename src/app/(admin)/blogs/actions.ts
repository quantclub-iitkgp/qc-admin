"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { addBlog, updateBlog, deleteBlog } from "@/lib/data-store"
import { getServiceClient } from "@/lib/supabase/service"
import { transformToSlug } from "@/lib/utils"

async function uploadCoverImage(file: File, slug: string): Promise<string> {
  const ext = file.type.split("/")[1] ?? "jpg"
  const path = `blogs/${slug}.${ext}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await getServiceClient().storage
    .from("covers")
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = getServiceClient().storage.from("covers").getPublicUrl(path)
  return publicUrl
}

export async function createBlogAction(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const author = formData.get("author") as string
  const readTime = formData.get("readTime") as string
  const date = formData.get("date") as string
  const tagsRaw = formData.get("tags") as string
  const content = formData.get("content") as string
  const coverImageFile = formData.get("coverImageFile") as File | null

  const slugAsParams = transformToSlug(title)
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : []

  let coverImage: string | undefined
  if (coverImageFile && coverImageFile.size > 0) {
    coverImage = await uploadCoverImage(coverImageFile, slugAsParams)
  }

  await addBlog({
    slug: `/blogs/${slugAsParams}`,
    slugAsParams,
    title,
    description: description || undefined,
    author: author || undefined,
    readTime: readTime || undefined,
    date: date || undefined,
    coverImage,
    tags,
    content: content || undefined,
  })

  revalidatePath("/blogs")
  redirect("/blogs")
}

export async function updateBlogAction(slugAsParams: string, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const author = formData.get("author") as string
  const readTime = formData.get("readTime") as string
  const date = formData.get("date") as string
  const tagsRaw = formData.get("tags") as string
  const content = formData.get("content") as string
  const coverImageFile = formData.get("coverImageFile") as File | null
  const existingCoverImage = formData.get("existingCoverImage") as string
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : []

  let coverImage: string | undefined = existingCoverImage || undefined
  if (coverImageFile && coverImageFile.size > 0) {
    coverImage = await uploadCoverImage(coverImageFile, slugAsParams)
  }

  await updateBlog(slugAsParams, {
    title,
    description: description || undefined,
    author: author || undefined,
    readTime: readTime || undefined,
    date: date || undefined,
    coverImage,
    tags,
    content: content || undefined,
  })

  revalidatePath("/blogs")
  redirect("/blogs")
}

export async function deleteBlogAction(slugAsParams: string): Promise<{ error?: string }> {
  try {
    await deleteBlog(slugAsParams)
    revalidatePath("/blogs")
    return {}
  } catch (e) {
    return { error: (e as Error).message }
  }
}
