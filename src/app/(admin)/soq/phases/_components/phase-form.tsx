import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SoQPhase } from "@/lib/data-store"

interface Props {
  action: (formData: FormData) => Promise<void>
  defaultValues?: Partial<SoQPhase>
  submitLabel: string
}

export function PhaseForm({ action, defaultValues, submitLabel }: Props) {
  return (
    <form action={action}>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-heading">{submitLabel}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Phase 1: Foundations" required defaultValue={defaultValues?.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug <span className="text-foreground/40 text-xs">(URL-safe, e.g. foundations)</span></Label>
            <Input id="slug" name="slug" placeholder="foundations" required defaultValue={defaultValues?.slug} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} placeholder="What this phase covers…" defaultValue={defaultValues?.description} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderIndex">Order</Label>
            <Input id="orderIndex" name="orderIndex" type="number" min={0} defaultValue={defaultValues?.orderIndex ?? 0} />
          </div>
          <div className="flex items-center gap-3">
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              className="h-4 w-4 rounded border-2 border-border"
              defaultChecked={defaultValues?.isPublished ?? false}
            />
            <Label htmlFor="isPublished">Published (visible on frontend)</Label>
          </div>
          <Button type="submit">{submitLabel}</Button>
        </CardContent>
      </Card>
    </form>
  )
}
