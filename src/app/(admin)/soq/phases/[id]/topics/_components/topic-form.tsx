import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SoQTopic, SoQContent } from "@/lib/data-store"

interface Props {
  action: (formData: FormData) => Promise<void>
  defaultValues?: Partial<SoQTopic>
  defaultContent?: SoQContent | null
  submitLabel: string
}

export function TopicForm({ action, defaultValues, defaultContent, submitLabel }: Props) {
  return (
    <form action={action}>
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Topic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Options & Derivatives" required defaultValue={defaultValues?.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug <span className="text-foreground/40 text-xs">(URL-safe, e.g. options-basics)</span></Label>
              <Input id="slug" name="slug" placeholder="options-basics" required defaultValue={defaultValues?.slug} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short description</Label>
              <Textarea id="description" name="description" rows={2} placeholder="What learners will cover in this topic…" defaultValue={defaultValues?.description} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Order</Label>
                <Input id="orderIndex" name="orderIndex" type="number" min={0} defaultValue={defaultValues?.orderIndex ?? 0} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input id="isPublished" name="isPublished" type="checkbox" className="h-4 w-4 rounded border-2 border-border" defaultChecked={defaultValues?.isPublished ?? false} />
              <Label htmlFor="isPublished">Published (visible on frontend)</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Content <span className="text-foreground/40 text-sm font-base">(Markdown)</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="body"
              name="body"
              rows={20}
              placeholder="Write topic content in Markdown…&#10;&#10;## Overview&#10;&#10;This section covers..."
              defaultValue={defaultContent?.body ?? ""}
              className="font-mono text-sm resize-y"
            />
            <p className="text-xs text-foreground/40 mt-2">Supports GitHub-flavored Markdown. Content is only visible to enrolled users.</p>
          </CardContent>
        </Card>

        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
