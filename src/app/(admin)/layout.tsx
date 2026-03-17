import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/session"
import { AdminShell } from "@/components/admin/admin-shell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect("/login")

  return <AdminShell>{children}</AdminShell>
}
