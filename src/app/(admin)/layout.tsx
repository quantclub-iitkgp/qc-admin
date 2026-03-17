import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const isSuperAdmin =
    !!process.env.SUPER_ADMIN_EMAIL && user.email === process.env.SUPER_ADMIN_EMAIL

  return <AdminShell isSuperAdmin={isSuperAdmin}>{children}</AdminShell>
}
