import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBlogAction } from "../actions"

export default function NewBlogPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-heading">New Blog Post</h2>
      </div>

      <form action={createBlogAction} className="space-y-6">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">
                Body{" "}
                <span className="text-xs font-base text-foreground/50">(Markdown supported)</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder={`## Introduction\n\nWrite your blog post content here in Markdown...\n\n## Section 1\n\nContent here.`}
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">Create Blog</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/blogs">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
