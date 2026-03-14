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
              <Label htmlFor="imageUrl">Cover Image URL</Label>
              <Input id="imageUrl" name="imageUrl" defaultValue={wp.imageUrl} />
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
                <span className="text-xs font-base text-foreground/50">(Markdown supported)</span>
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
