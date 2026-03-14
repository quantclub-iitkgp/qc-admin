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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-heading">New Blog Post</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createBlogAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" placeholder="e.g. Introduction to Options Pricing" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Brief summary of the post" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="coverImage">Cover Image Path</Label>
              <Input id="coverImage" name="coverImage" placeholder="/images/blog-cover.webp" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" name="tags" placeholder="comma-separated: quant, trading, risk" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Create Blog</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/blogs">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
