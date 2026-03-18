import { getSoQWaitlist } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users } from "lucide-react"
import { StatCard } from "@/components/admin/stat-card"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function SoQWaitlistPage() {
  const entries = await getSoQWaitlist()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">SoQ Waitlist</h2>
        <p className="text-sm text-foreground/60">People who signed up for Summer of Quant notifications</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Signups" value={entries.length} icon={Users} description="On the waitlist" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Waitlist Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="py-12 text-center text-foreground/40 font-base">
              No waitlist entries yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Signed Up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, i) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-foreground/40 font-base">{i + 1}</TableCell>
                    <TableCell className="font-heading">{entry.name}</TableCell>
                    <TableCell className="font-base text-foreground/70">{entry.email}</TableCell>
                    <TableCell className="font-base text-foreground/70">{entry.phone}</TableCell>
                    <TableCell className="text-sm text-foreground/50">{formatDate(entry.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
