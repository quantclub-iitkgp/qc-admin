import { notFound } from "next/navigation"
import { getSoQPhase, getSoQTopic, getSoQContent } from "@/lib/data-store"
import { TopicForm } from "../../_components/topic-form"
import { updateTopicAction } from "../../actions"

interface Props {
  params: Promise<{ id: string; topicId: string }>
}

export default async function EditTopicPage({ params }: Props) {
  const { id, topicId } = await params
  const [phase, topic] = await Promise.all([
    getSoQPhase(Number(id)),
    getSoQTopic(Number(topicId)),
  ])
  if (!phase || !topic) notFound()

  const content = await getSoQContent(topic.id)
  const action = updateTopicAction.bind(null, phase.id, topic.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">Edit Topic</h2>
        <p className="text-sm text-foreground/60">{phase.title} → {topic.title}</p>
      </div>
      <TopicForm action={action} defaultValues={topic} defaultContent={content} submitLabel="Save Changes" />
    </div>
  )
}
