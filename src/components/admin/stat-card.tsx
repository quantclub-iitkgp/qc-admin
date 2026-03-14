import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  description?: string
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-base">{title}</CardTitle>
        <Icon className="h-4 w-4 text-main" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-heading">{value}</div>
        {description && <p className="text-xs text-foreground/60 mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}
