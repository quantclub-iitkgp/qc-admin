"use client"

import { useState } from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { Topbar } from "@/components/admin/topbar"

interface AdminShellProps {
  children: React.ReactNode
  isSuperAdmin: boolean
  adminName: string
  adminRole: string
}

export function AdminShell({ children, isSuperAdmin, adminName, adminRole }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isSuperAdmin={isSuperAdmin}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-64">
        <Topbar
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          adminName={adminName}
          adminRole={adminRole}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
