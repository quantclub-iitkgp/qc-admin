import Link from "next/link"
import { Plus } from "lucide-react"
import { getBlogs } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteBlogButton } from "./delete-button"

export default async function BlogsPage() {
  const blogs = await getBlogs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading">Blogs</h2>
          <p className="text-sm text-foreground/60">{blogs.length} posts</p>
        </div>
        <Button asChild>
          <Link href="/blogs/new">
            <Plus className="h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>

      <div className="border-2 border-border rounded-base overflow-hidden bg-secondary-background shadow-shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-foreground/60 py-8">
                  No blogs yet. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.slugAsParams}>
                  <TableCell className="font-base max-w-[260px] truncate">{blog.title}</TableCell>
                  <TableCell className="text-sm text-foreground/70">{blog.author ?? "—"}</TableCell>
                  <TableCell className="text-sm">{blog.date ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(blog.tags ?? []).slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blogs/${blog.slugAsParams}/edit`}>Edit</Link>
                      </Button>
                      <DeleteBlogButton slugAsParams={blog.slugAsParams} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
