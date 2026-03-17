import { redirect } from "next/navigation"
import { CheckCircle2, Clock, Mail, Shield } from "lucide-react"
import { getCurrentUser } from "@/lib/session"
import { getInvitations } from "@/lib/admin-invitations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InviteForm } from "./invite-form"
import { DeleteInvitationButton } from "./delete-invitation-button"

export default async function SuperAdminPage() {
  const user = await getCurrentUser()
  if (!process.env.SUPER_ADMIN_EMAIL || user?.email !== process.env.SUPER_ADMIN_EMAIL) {
    redirect("/")
  }

  const invitations = await getInvitations()
  const accepted = invitations.filter((i) => i.usedAt)
  const pending = invitations.filter((i) => !i.usedAt)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Manage Admins
        </h2>
        <p className="text-sm text-foreground/60 mt-1">
          Only invited emails can create an admin account. Accepted invitations cannot be
          re-used.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Invite form */}
        <Card>
          <CardHeader>
            <CardTitle>Invite an Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <InviteForm />
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <span className="text-sm text-foreground/70">Total Invitations</span>
              <span className="font-heading text-lg">{invitations.length}</span>
            </div>
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <span className="text-sm text-foreground/70 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Accepted
              </span>
              <span className="font-heading text-green-600">{accepted.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-yellow-600" />
                Pending
              </span>
              <span className="font-heading text-yellow-600">{pending.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invitation list */}
      <Card>
        <CardHeader>
          <CardTitle>Invited Emails ({invitations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <p className="text-sm text-foreground/60 py-6 text-center">
              No invitations yet. Add an email above to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 p-3 rounded-base border-2 border-border bg-secondary-background"
                >
                  <Mail className="h-4 w-4 text-foreground/40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-base truncate">{inv.email}</p>
                    <p className="text-xs text-foreground/50">
                      Invited {new Date(inv.invitedAt).toLocaleDateString()}
                      {inv.usedAt && (
                        <span> · Accepted {new Date(inv.usedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  {inv.usedAt ? (
                    <Badge variant="default" className="shrink-0 gap-1 text-xs">
                      <CheckCircle2 className="h-3 w-3" />
                      Accepted
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                  {/* Only allow deletion of pending (unused) invitations */}
                  {!inv.usedAt && <DeleteInvitationButton id={inv.id} />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
