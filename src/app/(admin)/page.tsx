import { BookOpen, CalendarDays, FileText, Mail, Users } from "lucide-react"
import {
  getBlogs,
  getWhitepapers,
  getEvents,
  getTeam,
  getContacts,
} from "@/lib/data-store"
import { StatCard } from "@/components/admin/stat-card"
import { ContentChart } from "@/components/admin/content-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const [blogs, whitepapers, events, team, contacts] = await Promise.all([
    getBlogs(),
    getWhitepapers(),
    getEvents(),
    getTeam(),
    getContacts(),
  ])

  const recentContacts = contacts.slice(0, 5)

  const chartData = [
    { name: "Blogs", count: blogs.length },
    { name: "Whitepapers", count: whitepapers.length },
    { name: "Events", count: events.length },
    { name: "Team", count: team.length },
    { name: "Contacts", count: contacts.length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">Dashboard</h2>
        <p className="text-sm text-foreground/60">Overview of all Quant Club content</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Blogs" value={blogs.length} icon={BookOpen} description="Published posts" />
        <StatCard title="Whitepapers" value={whitepapers.length} icon={FileText} description="Research papers" />
        <StatCard title="Events" value={events.length} icon={CalendarDays} description="Past & upcoming" />
        <StatCard title="Team" value={team.length} icon={Users} description="Members" />
        <StatCard title="Contacts" value={contacts.length} icon={Mail} description="Submissions" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <p className="text-sm text-foreground/60 py-4 text-center">No contact submissions yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentContacts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-base">{c.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{c.subject || "—"}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-foreground/60">
                        {new Date(c.receivedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
