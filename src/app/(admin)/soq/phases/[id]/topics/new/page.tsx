import { notFound } from "next/navigation"
import { getSoQPhase } from "@/lib/data-store"
import { TopicForm } from "../_components/topic-form"
import { createTopicAction } from "../actions"

interface Props {
  params: Promise<{ id: string }>
}

export default async function NewTopicPage({ params }: Props) {
  const { id } = await params
  const phase = await getSoQPhase(Number(id))
  if (!phase) notFound()

  const action = createTopicAction.bind(null, phase.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">New Topic</h2>
        <p className="text-sm text-foreground/60">Add a topic to {phase.title}</p>
      </div>
      <TopicForm action={action} submitLabel="Create Topic" />
    </div>
  )
}
