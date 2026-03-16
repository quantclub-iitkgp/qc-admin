import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getWhitepapers } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateWhitepaperAction } from "../../actions"

export default async function EditWhitepaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wps = await getWhitepapers()
  const wp = wps.find((w) => w.id === Number(id))

  if (!wp) notFound()

  const action = updateWhitepaperAction.bind(null, wp.id)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/whitepapers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-heading">Edit Whitepaper</h2>
      </div>

      <form action={action} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" defaultValue={wp.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Abstract / Description</Label>
              <Textarea id="description" name="description" defaultValue={wp.description} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date *</Label>
              <Input
                id="publishedAt"
                name="publishedAt"
                type="date"
                defaultValue={wp.publishedAt}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImageFile">Cover Image</Label>
              {wp.imageUrl && (
                <p className="text-xs text-foreground/60 break-all">
                  Current: <code className="text-foreground">{wp.imageUrl}</code>
                </p>
              )}
              <Input
                id="coverImageFile"
                name="coverImageFile"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              />
              <p className="text-xs text-foreground/50">
                {wp.imageUrl
                  ? "Upload a new image to replace. Leave empty to keep current."
                  : "JPEG, PNG, WebP or GIF · max 5 MB"}
              </p>
              <input type="hidden" name="existingImageUrl" value={wp.imageUrl ?? ""} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PDF Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wp.pdfUrl && (
              <p className="text-sm font-base text-foreground/60">
                Current PDF: <code className="text-foreground">{wp.pdfUrl}</code>
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="pdfFile">{wp.pdfUrl ? "Replace PDF" : "Upload PDF"}</Label>
              <Input
                id="pdfFile"
                name="pdfFile"
                type="file"
                accept=".pdf,application/pdf"
              />
              <p className="text-xs text-foreground/50">
                {wp.pdfUrl
                  ? "Upload a new file to replace the existing PDF. Leave empty to keep current."
                  : "PDF will be saved to the frontend public directory and served at /pdfs/[slug].pdf"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">
                Full Paper Body{" "}
                <span className="text-xs font-base text-foreground/50">(Markdown — used as fallback when no PDF)</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={wp.content}
                placeholder={`## Abstract\n\nWrite the full whitepaper content here in Markdown...`}
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">Save Changes</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/whitepapers">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
