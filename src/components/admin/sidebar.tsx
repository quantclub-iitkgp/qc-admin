"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, CalendarDays, FileText, Mail, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/blogs", label: "Blogs", icon: BookOpen },
  { href: "/whitepapers", label: "Whitepapers", icon: FileText },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/team", label: "Team", icon: Users },
  { href: "/contacts", label: "Contacts", icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 border-r-4 border-border bg-secondary-background flex flex-col min-h-screen">
      <div className="p-6 border-b-4 border-border">
        <span className="text-lg font-heading">QC Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-base text-sm font-base transition-colors border-2",
                isActive
                  ? "bg-main text-main-foreground border-border shadow-shadow"
                  : "border-transparent hover:bg-black/5 dark:hover:bg-white/10 hover:border-border"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
