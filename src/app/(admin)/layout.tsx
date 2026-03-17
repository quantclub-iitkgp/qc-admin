import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const isSuperAdmin =
    !!process.env.SUPER_ADMIN_EMAIL && user.email === process.env.SUPER_ADMIN_EMAIL

  const adminName: string =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Admin"
  const adminRole = isSuperAdmin ? "Super Admin" : "Admin"

  return (
    <AdminShell isSuperAdmin={isSuperAdmin} adminName={adminName} adminRole={adminRole}>
      {children}
    </AdminShell>
  )
}
