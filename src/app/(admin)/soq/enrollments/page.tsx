import { getSoQEnrollments } from "@/lib/data-store"
import { getServiceClient } from "@/lib/supabase/service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatCard } from "@/components/admin/stat-card"
import { UserCheck } from "lucide-react"
import { EnrollForm } from "./_components/enroll-form"
import { UnenrollButton } from "./_components/unenroll-button"
import { BulkEnrollForm } from "./_components/bulk-enroll-form"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

export default async function EnrollmentsPage() {
  const enrollments = await getSoQEnrollments()

  // Fetch emails for enrolled user IDs via admin auth API
  let emailMap: Record<string, string> = {}
  try {
    const { data } = await getServiceClient().auth.admin.listUsers()
    emailMap = Object.fromEntries(data.users.map((u) => [u.id, u.email ?? u.id]))
  } catch {
    // email lookup optional — show user IDs as fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">Enrollments</h2>
        <p className="text-sm text-foreground/60">Grant or revoke access to SoQ program content</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard title="Enrolled" value={enrollments.length} icon={UserCheck} description="Active participants" />
      </div>

      {/* Enroll by email */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Enroll a User</CardTitle>
        </CardHeader>
        <CardContent>
          <EnrollForm />
        </CardContent>
      </Card>

      {/* Bulk enroll via CSV */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Bulk Enroll via CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <BulkEnrollForm />
        </CardContent>
      </Card>

      {/* Enrolled list */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Participants</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="py-12 text-center text-foreground/40 font-base">No enrolled users yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Email / User ID</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((e, i) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-foreground/40">{i + 1}</TableCell>
                    <TableCell className="font-base text-sm">{emailMap[e.userId] ?? e.userId}</TableCell>
                    <TableCell className="text-sm text-foreground/50">{formatDate(e.enrolledAt)}</TableCell>
                    <TableCell className="text-right">
                      <UnenrollButton id={e.id} label={emailMap[e.userId] ?? e.userId} />
                    </TableCell>
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
