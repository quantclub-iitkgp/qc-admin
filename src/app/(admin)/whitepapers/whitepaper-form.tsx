"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import {
  createWhitepaperUploadUrl,
  createWhitepaperAction,
  updateWhitepaperAction,
} from "./actions"

const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

export type WhitepaperFormValues = {
  id: number
  title: string
  description?: string
  publishedAt: string
  imageUrl: string
  pdfUrl?: string
}

interface WhitepaperFormProps {
  mode: "create" | "edit"
  whitepaper?: WhitepaperFormValues
}

export function WhitepaperForm({ mode, whitepaper }: WhitepaperFormProps) {
  const router = useRouter()
  const today = new Date().toISOString().split("T")[0]

  const [title, setTitle] = useState(whitepaper?.title ?? "")
  const [description, setDescription] = useState(whitepaper?.description ?? "")
  const [publishedAt, setPublishedAt] = useState(whitepaper?.publishedAt ?? today)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)

  // Uploads `file` straight to Supabase Storage via a server-issued signed URL,
  // returning its public URL. The file never passes through the Server Action.
  async function uploadFile(kind: "pdf" | "cover", file: File, paperTitle: string): Promise<string> {
    const ext = file.name.includes(".")
      ? (file.name.split(".").pop() ?? "")
      : (file.type.split("/")[1] ?? "")

    const res = await createWhitepaperUploadUrl(paperTitle, kind, ext)
    if (res.error || !res.data) {
      throw new Error(res.error ?? "Could not create upload URL.")
    }

    const supabase = createClient()
    const { error } = await supabase.storage
      .from(res.data.bucket)
      .uploadToSignedUrl(res.data.path, res.data.token, file, {
        contentType: file.type || undefined,
      })
    if (error) throw new Error(error.message)

    return res.data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const cleanTitle = title.trim()
    if (!cleanTitle) {
      toast.error("Title is required.")
      return
    }
    if (coverFile && coverFile.size > MAX_IMAGE_BYTES) {
      toast.error("Cover image must be 5 MB or smaller.")
      return
    }

    setSubmitting(true)
    try {
      let imageUrl = whitepaper?.imageUrl
      let pdfUrl = whitepaper?.pdfUrl

      if (coverFile) {
        setProgress("Uploading cover image…")
        imageUrl = await uploadFile("cover", coverFile, cleanTitle)
      }
      if (pdfFile) {
        setProgress("Uploading PDF…")
        pdfUrl = await uploadFile("pdf", pdfFile, cleanTitle)
      }

      setProgress("Saving…")
      const payload = {
        title: cleanTitle,
        description: description.trim() || undefined,
        publishedAt,
        imageUrl,
        pdfUrl,
      }

      const result =
        mode === "edit" && whitepaper
          ? await updateWhitepaperAction(whitepaper.id, payload)
          : await createWhitepaperAction(payload)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success(mode === "edit" ? "Whitepaper updated." : "Whitepaper created.")
      router.push("/whitepapers")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed. Please try again.")
    } finally {
      setSubmitting(false)
      setProgress(null)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/whitepapers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-heading">
          {mode === "edit" ? "Edit Whitepaper" : "New Whitepaper"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Black-Scholes Model Deep Dive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Abstract / Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief abstract of the paper"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date *</Label>
              <Input
                id="publishedAt"
                name="publishedAt"
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImageFile">Cover Image</Label>
              {mode === "edit" && whitepaper?.imageUrl && (
                <p className="text-xs text-foreground/60 break-all">
                  Current: <code className="text-foreground">{whitepaper.imageUrl}</code>
                </p>
              )}
              <Input
                id="coverImageFile"
                name="coverImageFile"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-foreground/50">
                {mode === "edit" && whitepaper?.imageUrl
                  ? "Upload a new image to replace. Leave empty to keep current."
                  : "JPEG, PNG, WebP or GIF · max 5 MB. Defaults to placeholder if empty."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PDF Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "edit" && whitepaper?.pdfUrl && (
              <p className="text-sm font-base text-foreground/60 break-all">
                Current PDF: <code className="text-foreground">{whitepaper.pdfUrl}</code>
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="pdfFile">
                {mode === "edit" && whitepaper?.pdfUrl ? "Replace PDF" : "Whitepaper PDF"}
              </Label>
              <Input
                id="pdfFile"
                name="pdfFile"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-foreground/50">
                {mode === "edit" && whitepaper?.pdfUrl
                  ? "Upload a new file to replace the existing PDF. Leave empty to keep current."
                  : "Uploaded directly to storage and served at /pdfs/[slug].pdf"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {submitting ? (progress ?? "Uploading…") : mode === "edit" ? "Save Changes" : "Create Whitepaper"}
          </Button>
          <Button type="button" variant="outline" asChild disabled={submitting}>
            <Link href="/whitepapers">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
