import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/ui/submit-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBlogAction } from "../actions"

export default function NewBlogPage() {
  return (
    <form action={createBlogAction} className="flex flex-col h-[calc(100vh-8rem)] w-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/blogs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-heading">New Blog Post</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/blogs">Cancel</Link>
          </Button>
          <SubmitButton pendingText="Creating…">Create Blog</SubmitButton>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0 space-y-6 overflow-y-auto pr-1 pb-2">
        {/* Top Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 shrink-0">
          {/* Metadata */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" placeholder="e.g. Introduction to Options Pricing" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Brief summary shown in listings" rows={2} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" name="author" placeholder="e.g. Team QC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="readTime">Read Time</Label>
                <Input id="readTime" name="readTime" placeholder="e.g. 8 min read" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImageFile">Cover Image</Label>
                <Input
                  id="coverImageFile"
                  name="coverImageFile"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                />
                <p className="text-xs text-foreground/50">JPEG, PNG, WebP or GIF · max 5 MB</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" name="tags" placeholder="comma-separated: quant, trading, risk" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Full Width Content */}
        <Card className="flex flex-col flex-1 min-h-[800px] shrink-0">
          <CardHeader className="shrink-0">
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 pb-6">
            <div className="flex flex-col flex-1 min-h-0 space-y-2">
              <Label htmlFor="content" className="shrink-0">
                Body{" "}
                <span className="text-xs font-base text-foreground/50">(Markdown supported)</span>
              </Label>
              <div className="flex-1 min-h-0 relative flex flex-col">
                <MarkdownEditor
                  initialContent=""
                  name="content"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
