"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { addBlog, updateBlog, deleteBlog } from "@/lib/data-store"
import { transformToSlug } from "@/lib/utils"

export async function createBlogAction(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const author = formData.get("author") as string
  const readTime = formData.get("readTime") as string
  const date = formData.get("date") as string
  const coverImage = formData.get("coverImage") as string
  const tagsRaw = formData.get("tags") as string
  const content = formData.get("content") as string

  const slugAsParams = transformToSlug(title)
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : []

  await addBlog({
    slug: `/blogs/${slugAsParams}`,
    slugAsParams,
    title,
    description: description || undefined,
    author: author || undefined,
    readTime: readTime || undefined,
    date: date || undefined,
    coverImage: coverImage || undefined,
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
  const coverImage = formData.get("coverImage") as string
  const tagsRaw = formData.get("tags") as string
  const content = formData.get("content") as string
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : []

  await updateBlog(slugAsParams, {
    title,
    description: description || undefined,
    author: author || undefined,
    readTime: readTime || undefined,
    date: date || undefined,
    coverImage: coverImage || undefined,
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
