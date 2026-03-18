import { notFound } from "next/navigation"
import { getSoQPhase } from "@/lib/data-store"
import { PhaseForm } from "../../_components/phase-form"
import { updatePhaseAction } from "../../actions"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPhasePage({ params }: Props) {
  const { id } = await params
  const phase = await getSoQPhase(Number(id))
  if (!phase) notFound()

  const action = updatePhaseAction.bind(null, phase.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading mb-1">Edit Phase</h2>
        <p className="text-sm text-foreground/60">{phase.title}</p>
      </div>
      <PhaseForm action={action} defaultValues={phase} submitLabel="Save Changes" />
    </div>
  )
}
