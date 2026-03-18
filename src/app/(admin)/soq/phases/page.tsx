import Link from "next/link"
import { getSoQPhases } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Layers } from "lucide-react"
import { DeletePhaseButton } from "./_components/delete-phase-button"

export default async function SoQPhasesPage() {
  const phases = await getSoQPhases()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-heading mb-1">Phases & Topics</h2>
          <p className="text-sm text-foreground/60">Manage the program&apos;s phases and their sub-topics</p>
        </div>
        <Link href="/soq/phases/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Phase
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-4 w-4" /> All Phases
          </CardTitle>
        </CardHeader>
        <CardContent>
          {phases.length === 0 ? (
            <div className="py-12 text-center text-foreground/40 font-base">
              No phases yet.{" "}
              <Link href="/soq/phases/new" className="underline text-foreground/60">Create the first one</Link>.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phases.map((phase) => (
                  <TableRow key={phase.id}>
                    <TableCell className="text-foreground/40">{phase.orderIndex}</TableCell>
                    <TableCell className="font-heading">{phase.title}</TableCell>
                    <TableCell className="font-base text-foreground/60 text-sm">{phase.slug}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-base border-2 border-border text-xs font-heading ${phase.isPublished ? "bg-main text-main-foreground" : "bg-secondary text-foreground/60"}`}>
                        {phase.isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/soq/phases/${phase.id}/topics`}>
                          <Button variant="outline" size="sm">Topics</Button>
                        </Link>
                        <Link href={`/soq/phases/${phase.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <DeletePhaseButton id={phase.id} title={phase.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
