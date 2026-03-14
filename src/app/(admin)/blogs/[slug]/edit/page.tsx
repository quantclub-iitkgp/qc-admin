import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getBlogs } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateBlogAction } from "../../actions"

export default async function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blogs = await getBlogs()
  const blog = blogs.find((b) => b.slugAsParams === slug)

  if (!blog) notFound()

  const action = updateBlogAction.bind(null, slug)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-heading">Edit Blog Post</h2>
      </div>

      <form action={action} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" defaultValue={blog.title} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={blog.description} rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" defaultValue={blog.author} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={blog.date} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image Path</Label>
              <Input id="coverImage" name="coverImage" defaultValue={blog.coverImage} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" name="tags" defaultValue={(blog.tags ?? []).join(", ")} />
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
                defaultValue={blog.content}
                placeholder={`## Introduction\n\nWrite your blog post content here in Markdown...`}
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">Save Changes</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/blogs">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
