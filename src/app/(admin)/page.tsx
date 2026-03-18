import { BookOpen, CalendarDays, FileText, Users } from "lucide-react"
import {
  getBlogs,
  getWhitepapers,
  getEvents,
  getTeam,
} from "@/lib/data-store"
import { StatCard } from "@/components/admin/stat-card"
import { ContentChart } from "@/components/admin/content-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const [blogs, whitepapers, events, team] = await Promise.all([
    getBlogs(),
    getWhitepapers(),
    getEvents(),
    getTeam(),
  ])

  const chartData = [
    { name: "Blogs", count: blogs.length },
    { name: "Whitepapers", count: whitepapers.length },
    { name: "Events", count: events.length },
    { name: "Team", count: team.length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">Dashboard</h2>
        <p className="text-sm text-foreground/60">Overview of all Quant Club content</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Blogs" value={blogs.length} icon={BookOpen} description="Published posts" />
        <StatCard title="Whitepapers" value={whitepapers.length} icon={FileText} description="Research papers" />
        <StatCard title="Events" value={events.length} icon={CalendarDays} description="Past & upcoming" />
        <StatCard title="Team" value={team.length} icon={Users} description="Members" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentChart data={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
