import { getSoQProgressAnalytics, getSoQPhases, getSoQTopics, getSoQEnrollments } from "@/lib/data-store"
import { getServiceClient } from "@/lib/supabase/service"
import { StatCard } from "@/components/admin/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Users, Trophy } from "lucide-react"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

export default async function SoQAnalyticsPage() {
  const [analytics, phases, enrollments] = await Promise.all([
    getSoQProgressAnalytics(),
    getSoQPhases(),
    getSoQEnrollments(),
  ])

  // Total topic count across all phases
  const topicCounts = await Promise.all(phases.map((p) => getSoQTopics(p.id)))
  const totalTopics = topicCounts.reduce((sum, topics) => sum + topics.length, 0)

  // Fetch email map
  let emailMap: Record<string, string> = {}
  try {
    const { data } = await getServiceClient().auth.admin.listUsers()
    emailMap = Object.fromEntries(data.users.map((u) => [u.id, u.email ?? u.id]))
  } catch {
    // fallback to user IDs
  }

  const avgCompletionPct =
    enrollments.length > 0 && totalTopics > 0
      ? Math.round(
          analytics.reduce((sum, r) => sum + r.completedCount, 0) /
            enrollments.length /
            totalTopics *
            100,
        )
      : 0

  const sortedRows = [...analytics].sort(
    (a, b) => b.completedCount - a.completedCount,
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">Progress Analytics</h2>
        <p className="text-sm text-foreground/60">Participant completion data across all SoQ topics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Enrolled" value={enrollments.length} icon={Users} description="Total participants" />
        <StatCard title="Avg Completion" value={avgCompletionPct} icon={BarChart3} description="% across all participants" />
        <StatCard title="Completions" value={analytics.filter((r) => r.completedCount >= totalTopics && totalTopics > 0).length} icon={Trophy} description="Finished all topics" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Per-User Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedRows.length === 0 ? (
            <div className="py-12 text-center text-foreground/40 font-base">No progress data yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>%</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map((row, i) => {
                  const pct = totalTopics > 0 ? Math.round((row.completedCount / totalTopics) * 100) : 0
                  return (
                    <TableRow key={row.userId}>
                      <TableCell className="text-foreground/40">{i + 1}</TableCell>
                      <TableCell className="font-base text-sm">{emailMap[row.userId] ?? row.userId}</TableCell>
                      <TableCell className="tabular-nums">{row.completedCount}</TableCell>
                      <TableCell className="tabular-nums text-foreground/50">{totalTopics}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-secondary border border-border overflow-hidden">
                            <div className="h-full bg-main rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs tabular-nums text-foreground/60">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground/50">{formatDate(row.lastActiveAt)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
