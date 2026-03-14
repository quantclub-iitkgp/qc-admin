import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/session"
import { Sidebar } from "@/components/admin/sidebar"
import { Topbar } from "@/components/admin/topbar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated()
  if (!authenticated) redirect("/login")

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 bg-background overflow-auto">{children}</main>
      </div>
    </div>
  )
}
