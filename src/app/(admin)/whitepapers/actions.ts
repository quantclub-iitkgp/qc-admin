"use server"

import { revalidatePath } from "next/cache"
import { addWhitepaper, updateWhitepaper, deleteWhitepaper } from "@/lib/data-store"
import { getServiceClient } from "@/lib/supabase/service"
import { createClient } from "@/lib/supabase/server"
import { transformToSlug } from "@/lib/utils"

const PLACEHOLDER_IMAGE = "/template-previews/blog.webp"

type UploadKind = "pdf" | "cover"

export type SignedUpload = {
  bucket: string
  path: string
  token: string
  publicUrl: string
}

type WhitepaperInput = {
  title: string
  description?: string
  publishedAt?: string
  imageUrl?: string
  pdfUrl?: string
}

/**
 * Mints a one-time signed upload URL so the browser can stream the file
 * straight to Supabase Storage, bypassing the 1 MB Server Action body limit.
 * The bucket and object path are derived server-side from the title so the
 * client can never target an arbitrary location.
 */
export async function createWhitepaperUploadUrl(
  title: string,
  kind: UploadKind,
  ext: string
): Promise<{ data?: SignedUpload; error?: string }> {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const slug = transformToSlug(title)
  if (!slug) return { error: "A title is required before uploading files." }

  const bucket = kind === "pdf" ? "whitepapers" : "covers"
  const safeExt = kind === "pdf" ? "pdf" : (ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin")
  const path = kind === "pdf" ? `${slug}.pdf` : `whitepapers/${slug}.${safeExt}`

  const { data, error } = await getServiceClient()
    .storage.from(bucket)
    .createSignedUploadUrl(path, { upsert: true })

  if (error || !data) return { error: error?.message ?? "Could not create upload URL." }

  const {
    data: { publicUrl },
  } = getServiceClient().storage.from(bucket).getPublicUrl(path)

  return { data: { bucket, path: data.path, token: data.token, publicUrl } }
}

export async function createWhitepaperAction(input: WhitepaperInput): Promise<{ error?: string }> {
  try {
    await addWhitepaper({
      title: input.title,
      slug: transformToSlug(input.title),
      imageUrl: input.imageUrl || PLACEHOLDER_IMAGE,
      description: input.description || undefined,
      publishedAt: input.publishedAt || new Date().toISOString().split("T")[0],
      pdfUrl: input.pdfUrl,
    })
  } catch (e) {
    return { error: (e as Error).message }
  }

  revalidatePath("/whitepapers")
  return {}
}

export async function updateWhitepaperAction(
  id: number,
  input: WhitepaperInput
): Promise<{ error?: string }> {
  try {
    await updateWhitepaper(id, {
      title: input.title,
      slug: transformToSlug(input.title),
      imageUrl: input.imageUrl || undefined,
      description: input.description || undefined,
      publishedAt: input.publishedAt || undefined,
      ...(input.pdfUrl ? { pdfUrl: input.pdfUrl } : {}),
    })
  } catch (e) {
    return { error: (e as Error).message }
  }

  revalidatePath("/whitepapers")
  return {}
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
