import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createWhitepaperAction } from "../actions"

export default function NewWhitepaperPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/whitepapers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-heading">New Whitepaper</h2>
      </div>

      <form action={createWhitepaperAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" placeholder="e.g. Black-Scholes Model Deep Dive" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Abstract / Description</Label>
              <Textarea id="description" name="description" placeholder="Brief abstract of the paper" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Cover Image URL</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="/template-previews/blog.webp" />
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
                placeholder={`## Abstract\n\nWrite the full whitepaper content here in Markdown...\n\n## 1. Introduction\n\n## 2. Methodology`}
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit">Create Whitepaper</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/whitepapers">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
