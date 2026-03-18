import { notFound } from "next/navigation"
import Link from "next/link"
import { getSoQPhase, getSoQTopics } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, ArrowLeft } from "lucide-react"
import { DeleteTopicButton } from "./_components/delete-topic-button"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PhaseTopicsPage({ params }: Props) {
  const { id } = await params
  const phase = await getSoQPhase(Number(id))
  if (!phase) notFound()

  const topics = await getSoQTopics(phase.id)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/soq/phases" className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> All phases
          </Link>
          <h2 className="text-xl md:text-2xl font-heading mb-1">Topics — {phase.title}</h2>
          <p className="text-sm text-foreground/60">Manage sub-topics and content for this phase</p>
        </div>
        <Link href={`/soq/phases/${phase.id}/topics/new`}>
          <Button><Plus className="h-4 w-4 mr-2" /> New Topic</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topics ({topics.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {topics.length === 0 ? (
            <div className="py-12 text-center text-foreground/40 font-base">
              No topics yet.{" "}
              <Link href={`/soq/phases/${phase.id}/topics/new`} className="underline text-foreground/60">Add the first one</Link>.
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
                {topics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell className="text-foreground/40">{topic.orderIndex}</TableCell>
                    <TableCell className="font-heading">{topic.title}</TableCell>
                    <TableCell className="text-sm text-foreground/60">{topic.slug}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-base border-2 border-border text-xs font-heading ${topic.isPublished ? "bg-main text-main-foreground" : "bg-secondary text-foreground/60"}`}>
                        {topic.isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/soq/phases/${phase.id}/topics/${topic.id}/edit`}>
                          <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5" /></Button>
                        </Link>
                        <DeleteTopicButton phaseId={phase.id} topicId={topic.id} title={topic.title} />
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
