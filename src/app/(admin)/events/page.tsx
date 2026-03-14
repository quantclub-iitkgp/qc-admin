import Link from "next/link"
import { Plus } from "lucide-react"
import { getEvents } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteEventButton } from "./delete-button"

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading">Events</h2>
          <p className="text-sm text-foreground/60">{events.length} events</p>
        </div>
        <Button asChild>
          <Link href="/events/new">
            <Plus className="h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      <div className="border-2 border-border rounded-base overflow-hidden bg-secondary-background shadow-shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-foreground/60 py-8">
                  No events yet.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-base max-w-[200px] truncate">{event.title}</TableCell>
                  <TableCell className="text-sm text-foreground/70 max-w-[260px] truncate">
                    {event.description}
                  </TableCell>
                  <TableCell className="text-sm">{event.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${event.id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteEventButton id={event.id} />
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
