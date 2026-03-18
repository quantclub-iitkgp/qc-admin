"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FileText,
  Shield,
  Users,
  X,
  Sun,
  ListOrdered,
  Layers,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/blogs", label: "Blogs", icon: BookOpen },
  { href: "/whitepapers", label: "Whitepapers", icon: FileText },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/team", label: "Team", icon: Users },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  isSuperAdmin?: boolean
}

export function Sidebar({ isOpen = false, onClose, isSuperAdmin = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r-4 border-border bg-secondary-background flex flex-col transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b-4 border-border shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-base border-2 border-border bg-main shadow-shadow shrink-0">
          <span className="text-xs font-heading text-main-foreground leading-none">QC</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-heading leading-none truncate">Quant Club</p>
          <p className="text-xs text-foreground/50 mt-0.5">Admin Panel</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden flex items-center justify-center h-8 w-8 rounded-base border-2 border-border hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-xs font-heading uppercase tracking-widest text-foreground/40">
          Content
        </p>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-base text-sm font-base transition-all border-2",
                isActive
                  ? "bg-main text-main-foreground border-border shadow-shadow translate-x-[2px] translate-y-[2px]"
                  : "border-transparent text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:border-border"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  !isActive && "group-hover:scale-110"
                )}
              />
              {label}
            </Link>
          )
        })}

        {/* Summer of Quant section */}
        <div className="pt-4 pb-1">
          <p className="px-3 pb-2 text-xs font-heading uppercase tracking-widest text-foreground/40">
            Summer of Quant
          </p>
        </div>
        {[
          { href: "/soq/waitlist",    label: "Waitlist",        icon: ListOrdered },
          { href: "/soq/phases",      label: "Phases & Topics", icon: Layers },
          { href: "/soq/enrollments", label: "Enrollments",     icon: UserCheck },
        ].map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-base text-sm font-base transition-all border-2",
                isActive
                  ? "bg-main text-main-foreground border-border shadow-shadow translate-x-[2px] translate-y-[2px]"
                  : "border-transparent text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:border-border"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform", !isActive && "group-hover:scale-110")} />
              {label}
            </Link>
          )
        })}

        {/* Super Admin section — only shown to super admin */}
        {isSuperAdmin && (
          <>
            <div className="pt-4 pb-1">
              <p className="px-3 pb-2 text-xs font-heading uppercase tracking-widest text-foreground/40">
                Super Admin
              </p>
            </div>
            <Link
              href="/super-admin"
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-base text-sm font-base transition-all border-2",
                pathname.startsWith("/super-admin")
                  ? "bg-main text-main-foreground border-border shadow-shadow translate-x-[2px] translate-y-[2px]"
                  : "border-transparent text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:border-border"
              )}
            >
              <Shield
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  !pathname.startsWith("/super-admin") && "group-hover:scale-110"
                )}
              />
              Manage Admins
            </Link>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t-2 border-border/40 shrink-0">
        <p className="text-xs text-foreground/30">IIT Kharagpur · v1.0</p>
      </div>
    </aside>
  )
}
