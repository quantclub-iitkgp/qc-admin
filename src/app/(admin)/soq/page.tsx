import Link from "next/link"
import { getSoQWaitlist, getSoQPhases, getSoQEnrollments } from "@/lib/data-store"
import { StatCard } from "@/components/admin/stat-card"
import { Button } from "@/components/ui/button"
import { ListOrdered, Layers, UserCheck, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SoQOverviewPage() {
  const [waitlist, phases, enrollments] = await Promise.all([
    getSoQWaitlist(),
    getSoQPhases(),
    getSoQEnrollments(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">Summer of Quant</h2>
        <p className="text-sm text-foreground/60">Manage the SoQ program, phases, topics, and enrollments</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Waitlist" value={waitlist.length} icon={ListOrdered} description="Signups" />
        <StatCard title="Phases" value={phases.length} icon={Layers} description="Program phases" />
        <StatCard title="Enrolled" value={enrollments.length} icon={UserCheck} description="Active participants" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: "/soq/waitlist",    label: "View Waitlist",    icon: ListOrdered, desc: "See everyone who signed up for notifications" },
          { href: "/soq/phases",      label: "Manage Phases",    icon: Layers,      desc: "Create and edit program phases and topics" },
          { href: "/soq/enrollments", label: "Enrollments",      icon: UserCheck,   desc: "Grant or revoke access to program content" },
        ].map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href} className="block">
            <Card className="border-4 border-border shadow-shadow h-full cursor-pointer group transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-base border-2 border-border bg-main shadow-shadow shrink-0">
                    <Icon className="h-4 w-4 text-main-foreground" />
                  </div>
                  <CardTitle className="text-base font-heading group-hover:text-main transition-colors">{label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/60">{desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs font-heading text-main">
                  Go <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
