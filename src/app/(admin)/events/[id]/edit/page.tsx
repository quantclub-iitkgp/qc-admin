import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getEvents } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateEventAction } from "../../actions"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const events = await getEvents()
  const event = events.find((e) => e.id === Number(id))

  if (!event) notFound()

  const action = updateEventAction.bind(null, event.id)

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/events">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-heading">Edit Event</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} encType="multipart/form-data" className="space-y-4">
            <input type="hidden" name="existingImage" value={event.image} />
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" defaultValue={event.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={event.description} rows={3} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={event.date} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link Slug</Label>
                <Input id="link" name="link" defaultValue={event.link} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageFile">Cover Image</Label>
              {event.image && (
                <div className="mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.image} alt="Current cover" className="h-24 w-auto rounded border object-cover" />
                  <p className="text-xs text-muted-foreground mt-1">Current image — upload a new file to replace it</p>
                </div>
              )}
              <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/events">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
